const isEmpty = require("@/validators/validator/isEmpty.validator");

const UpdateSubmoduleValidator = async (request, response, next) => {
    let error = [];

    const { submoduleName, moduleId } = request.body;

    if (isEmpty(submoduleName)) {
        error.push({
            field: "submoduleName",
            message: "Please enter submodule name."
        });
    }

    if (isEmpty(moduleId)) {
        error.push({
            field: "moduleId",
            message: "Please select a module."
        });
    }

    const submoduleKey = submoduleName.replaceAll(" ", "-").toLowerCase();

    if (isEmpty(submoduleKey)) {
        error.push({
            field: "submoduleKey",
            message: "Submodule key is not generated."
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
        request.body.submoduleKey = submoduleKey;
        next();
    }
}

module.exports = UpdateSubmoduleValidator;