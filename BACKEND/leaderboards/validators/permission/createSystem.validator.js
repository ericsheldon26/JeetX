const isEmpty = require("@/validators/validator/isEmpty.validator");

const CreateSystemValidator = async (request, response, next) => {
    let error = [];

    const { systemName, systemKey } = request.body;

    if (isEmpty(systemName)) {
        error.push({
            field: "systemName",
            message: "Please enter system name."
        });
    }


    if (isEmpty(systemKey)) {
        const systemKey = systemName.replaceAll(" ", "-").toLowerCase();
        request.body.systemKey = systemKey;
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

module.exports = CreateSystemValidator;