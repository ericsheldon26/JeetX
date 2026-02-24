const isEmpty = require("@/validators/validator/isEmpty.validator");

const CreateActionValidator = async (request, response, next) => {
    let error = [];

    const { submoduleId, userCategory } = request.body;

    if (isEmpty(submoduleId)) {
        error.push({
            field: "submoduleId",
            message: "Please select a submodule."
        });
    }

    if (!userCategory || userCategory?.length == 0) {
        error.push({
            field: "userCategory",
            message: "Please select a user category."
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

module.exports = CreateActionValidator;