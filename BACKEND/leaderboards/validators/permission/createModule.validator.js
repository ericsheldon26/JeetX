const isEmpty = require("@/validators/validator/isEmpty.validator");

const CreateModuleValidator = async (request, response, next) => {
    let error = [];

    const { subSystemId, moduleName, moduleIcon, moduleKey } = request.body;

    if (isEmpty(moduleName)) {
        error.push({
            field: "moduleName",
            message: "Please enter module name."
        });
    }

    if (isEmpty(moduleIcon)) {
        const moduleIcon = "";
        request.body.moduleIcon = moduleIcon;

    }

    if (isEmpty(subSystemId)) {
        error.push({
            field: "subSystemId",
            message: "Please select a subsystem."
        });
    }


    if (isEmpty(moduleKey)) {
        const moduleKey = moduleName.replaceAll(" ", "-").toLowerCase();
        request.body.moduleKey = moduleKey;

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

module.exports = CreateModuleValidator;