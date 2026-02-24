const isEmpty = require("@/validators/validator/isEmpty.validator");

const LoginValidator = async (request, response, next) => {
    let error = [];

    if (isEmpty(request.body?.firebase_user_id)) {
        error.push({
            field: "firebase_user_id",
            message: "Please provide firebase_user_id for login."
        });
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

module.exports = LoginValidator;