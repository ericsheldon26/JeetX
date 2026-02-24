const isNotZero = require("@/validators/main/validator/isNotZero.validator");

const GetUserRoleValidator = (request, response, next) => {
    if (isNotZero(request.query.page)) {
        return response.status(200).json({
            code: 200,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "Please enter a page number greater then 0."
                }
            ],

            message: ""
        });
    }
    next();
}

module.exports = GetUserRoleValidator;