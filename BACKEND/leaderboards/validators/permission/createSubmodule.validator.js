const isEmpty = require("@/validators/validator/isEmpty.validator");

const CreateSubmoduleValidator = async (request, response, next) => {
    let error = [];

    const { subModuleName, subModuleKey, moduleId } = request.body;

    if (isEmpty(subModuleName)) {
        error.push({
            field: "subModuleName",
            message: "Please enter submodule name."
        });
    }

    if (isEmpty(moduleId)) {
        error.push({
            field: "moduleId",
            message: "Please select a module."
        });
    }


    if (isEmpty(subModuleKey)) {
        const subModuleKey = subModuleName.replaceAll(" ", "-").toLowerCase();
        request.body.subModuleKey = subModuleKey;
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

module.exports = CreateSubmoduleValidator;