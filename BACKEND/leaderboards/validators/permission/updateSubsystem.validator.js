const isEmpty = require("@/validators/validator/isEmpty.validator");

const UpdateSubsystemValidator = async (request, response, next) => {
    let error = [];

    const { subSystemName, subSystemKey, subSystemIcon, systemId } = request.body;

    if (isEmpty(subSystemName)) {
        error.push({
            field: "subSystemName",
            message: "Please enter subsystem name."
        });
    }
    if (isEmpty(subSystemIcon)) {
        request.body.subSystemIcon = "";
    }

    if (isEmpty(systemId)) {
        error.push({
            field: "systemId",
            message: "Please select a system."
        });
    }


    if (isEmpty(subSystemKey)) {
        const subsystemKey = subSystemName.replaceAll(" ", "-").toLowerCase();
        request.body.subSystemKey = subsystemKey;

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

module.exports = UpdateSubsystemValidator;