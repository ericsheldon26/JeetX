const WebAccess = require("@/permissions/webAccess");

const ActionMiddleware = async (request, response, next, key) => {
    const WebAccessValues = WebAccess();
    let permission;

    if (Array.isArray(key)) {
        key && key.length > 0 && key.map(k => {
            if (!permission) {
                permission = request.user?.actionIds.find(action => action?.actionKey == WebAccessValues[k]);
            }
        })
    } else {
        permission = request.user?.actionIds.find(action => action?.actionKey == WebAccessValues[key]);
    }

    if (permission?.actionKey) {
        next();
    }
    else {
        return response.status(200).json({
            code: 401,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "You don't have permission to do this task."
                }
            ],
            message: ""
        })
    }
}

module.exports = ActionMiddleware;