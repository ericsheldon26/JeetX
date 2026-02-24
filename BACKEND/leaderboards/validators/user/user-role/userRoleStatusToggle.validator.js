
const isEmpty = require("@/validators/main/validator/isEmpty.validator");

const UserRoleStatusToggleValidator = async (request, response, next) => {
    let error = [];
    let userRoleStatus = ["active", "inactive"];

    if (isEmpty(request.body?.userRoleStatus)) {
        error.push({
            field: "userRoleStatus",
            message: "Please select a user role status."
        })
    }

    if (!userRoleStatus.includes(request.body?.userRoleStatus)) {
        error.push({
            field: "userRoleStatus",
            message: "Please select a valid user role status e.g (active, inactive)."
        })
    }

    if (error.length > 0) {
        return response.status(200).json({
            code: 200,
            success: false,
            error: error,
            message: ""
        });
    }
    else {
        next();
    }
}

module.exports = UserRoleStatusToggleValidator;