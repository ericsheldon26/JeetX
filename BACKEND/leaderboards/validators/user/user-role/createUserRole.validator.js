const isEmpty = require("@/validators/main/validator/isEmpty.validator");

const CreateUserRoleValidator = async (request, response, next) => {

    let error = [];
    let userType = ["admin", "employee", "student", "parent"];


    if (isEmpty(request.body?.userRoleName)) {
        error.push({
            field: "userRoleName",
            message: "Please enter user role name."
        })
    }

    if (isEmpty(request.body?.userRoleKey)) {
        error.push({
            field: "userRoleKey",
            message: "Please enter user role key."
        })
    }

    if (isEmpty(request.body?.userType)) {
        error.push({
            field: "userType",
            message: "Please select a user type."
        })
    }
    else if (!userType.includes(request.body?.userType)) {
        error.push({
            field: "userType",
            message: "User type is not valid."
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
module.exports = CreateUserRoleValidator;