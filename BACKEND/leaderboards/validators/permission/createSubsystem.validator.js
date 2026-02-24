const isEmpty = require("@/validators/validator/isEmpty.validator");
const { ValidateMongooseObjectIds } = require("@/validators/validator/multivalidator");

const CreateSubsystemValidator = async (request, response, next) => {
    let error = [];

    const { subSystemName, subSystemKey, subSystemIcon, systemId } = request.body;

    if (isEmpty(subSystemName)) {
        error.push({
            field: "subSystemName",
            message: "Please enter subsystem name."
        });
    }

    if (isEmpty(subSystemIcon)) {
        error.push({
            field: "subSystemIcon",
            message: "Please enter subsystem icon."
        });
    }

    if (isEmpty(systemId)) {
        error.push({
            field: "systemId",
            message: "Please select a system."
        });
    }
    const validateError = ValidateMongooseObjectIds({ systemId })
    error.push(...validateError)

    if (isEmpty(subSystemKey)) {
        const subSystemKey = subSystemName.replaceAll(" ", "-").toLowerCase();
        request.body.subSystemKey = subSystemKey;
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

module.exports = CreateSubsystemValidator;