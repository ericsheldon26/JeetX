const User = require("@/models/user/user.model");
// const UserRole = require("@/models/user/user-role.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { GetAccessToken } = require("@/utils/connections/jwt/getTokens.jwt.js");
const getRedisClient = require("@/utils/connections/database/redisClient");
const getCookies = require("@/utils/cookies/getCookies.js");

const checkRefreshToken = async (client, request) => {
    const refreshTokenCookies = getCookies(request, "refreshToken");
    const decoded = jwt.verify(refreshTokenCookies, process.env.REFRESH_JWT_SECRET);
    const storedToken = await client.get(`refresh:${decoded._id}`);
    if (!storedToken || storedToken !== refreshTokenCookies) {
        return {
            code: 401,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "Refresh token is expired. Please Log in Again."
                }
            ]
        }
    }
    const token = jwt.sign({ _id: decoded._id }, process.env.ACCESS_JWT_SECRET, { expiresIn: "15m" });
    await client.set(`access:${decoded._id}`, token, { EX: 60 * 15 }); // 15 min
    return {
        code: 200,
        success: true,
        error: [
            {
                field: "popup",
                message: "Access Token Recreated after Refresh Token Validated."
            }
        ],
        data: { user: decoded, token: token },
        message: ""
    };
}
const checkAccessToken = async (client, request) => {
    try {
        const accessToken = GetAccessToken(request)
        if (!accessToken) {
            return {
                code: 401,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "Unauthorized user, token not available."
                    }
                ],
                message: ""
            };
        }
        const userLoggedOut = await client.get(`logout:${accessToken.toString()}`);
        if (userLoggedOut && userLoggedOut != null && userLoggedOut != undefined) {
            return {
                code: 400,
                success: false,
                expired: true,
                error: [
                    {
                        field: "popup",
                        message: "This token has expired, Please login again."
                    }
                ],
                message: ""
            }

        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
        const storedToken = await client.get(`access:${decoded._id}`);
        if (!storedToken || storedToken !== accessToken) {
            const checkRefreshTokenStatus = checkRefreshToken(client, request)
            return checkRefreshTokenStatus

        }

        return {
            code: 200,
            success: true,
            error: [],
            data: { user: decoded, token: storedToken },
            message: "Access Token Validated."
        };
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            // check if refresh token is there and valid so assign a new token
            const checkRefreshTokenStatus = checkRefreshToken(client, request)
            return checkRefreshTokenStatus
        }
        return {
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error}`
                }
            ],
            message: ""
        };
    }
}

const Middleware = async (request, response, next) => {
    const client = await getRedisClient(); // reuse singleton client
    await client.set("last_request_middleware", Date.now().toString());
    try {

        const ATStatus = await checkAccessToken(client, request)
        if (!ATStatus.success) {
            return response.status(ATStatus?.code)
                .json({
                    code: ATStatus?.code,
                    success: ATStatus?.success,
                    error: ATStatus?.error,
                    message: ATStatus?.message
                })
        }

        const accessToken = ATStatus.data.token
        request.token = accessToken;

        const userId = new mongoose.Types.ObjectId(String(ATStatus.data.user._id))

        const cachedUser = await client.get(ATStatus.data.user._id.toString());
        if (cachedUser && cachedUser != null && cachedUser != undefined) {
            request.user = JSON.parse(cachedUser);
            return next();
        }


        const user = await User.middleware(userId)


        // if (user?.user_type == "employee") {
        //     const userRole = await UserRole.findOne({ userId: user?._id }).select("userRoleName");
        //     user.userRoleName = userRole?.userRoleName;
        // }

        if (!user) {
            return response.status(200).json({
                code: 401,
                success: false,
                error: [
                    {
                        field: "popup",
                        message: "No account found with these associated credentials."
                    }
                ],
                message: ""
            });
        }
        if (user?.userBlockStatus == "yes") {
            return response.status(200).json({
                code: 401,
                success: false,
                blocked: true,
                error: [
                    {
                        field: "popup",
                        message: "Your account is blocked by admin, Please contect support@k12onlineschools.com."
                    }
                ],
                message: ""
            });
        }


        request.user = user;
        client.set(userId.toString(), JSON.stringify(user), { EX: 3600 });

        return next();

    }
    catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error}`
                }
            ],
            message: ""
        });
    }
}

module.exports = Middleware;