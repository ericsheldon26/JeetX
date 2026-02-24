const { default: mongoose } = require("mongoose");
const isEmpty = require("./isEmpty.validator");
/**
 * Validates that the provided fields are not empty.
 *
 * @param {Object} nonEmptyElements - Object with key-value pairs where values must not be empty.
 * @returns {Array} - List of error objects for each empty field.
 */


const ValidateNonEmptyElements = (nonEmptyElements) => {
    let error = [];

    for (const [key, value] of Object.entries(nonEmptyElements)) {
        if (isEmpty(value)) {
            let fieldName = key.replace(/([A-Z])/g, ' $1').toLowerCase();  // Format the field name (camelCase to sentence case)
            error.push({
                field: "popup",
                message: `Please enter ${fieldName.replace(/^./, str => str)}.`
            });
        }
    }
    return error
}


/**
 * Validates that the provided values are valid Mongoose ObjectIds.
 *
 * @param {Object} MongooseObjectIds - Object with key-value pairs where values should be valid Mongoose ObjectIds.
 * @returns {Array} - List of error objects for each invalid ObjectId.
 */

const ValidateMongooseObjectIds = (MongooseObjectIds) => {
    let error = [];

    for (const [key, value] of Object.entries(MongooseObjectIds)) {
        if (!value || !mongoose.isValidObjectId(value)) {
            let fieldName = key.replace(/([A-Z])/g, ' $1').toLowerCase(); // Format the field name (camelCase to sentence case)
            error.push({
                field: "popup",  // Add the index to indicate which slot is invalid
                message: `Please enter valid ${fieldName.replace(/^./, str => str)}.`
            });
        }
    }
    return error
}

/**
 * Validates that required fields are present and valid Mongoose ObjectIds.
 * Responds immediately with an error if any field is missing or invalid.
 *
 * @param {Object} requiredFields - Object with key-value pairs of required fields.
 * @returns {Array} - Always returns an empty array (since response is returned immediately on error).
 */


/**
 * Validates that date fields contain valid date strings.
 *
 * @param {Object} dateFields - Object with key-value pairs where values should be valid date strings.
 * @returns {Array} - List of error objects for each invalid date field.
 */
const ValidateDateFields = (dateFields) => {
    const error = [];

    // Strict ISO 8601 date format: YYYY-MM-DD
    const isoDateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    for (const [key, value] of Object.entries(dateFields)) {
        const isValidFormat = isoDateRegex.test(value);
        const isValidDate = !isNaN(new Date(value).getTime());

        if (!isValidFormat || !isValidDate) {
            const fieldName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            error.push({
                field: "popup",
                message: `Please enter valid ${fieldName}. Format should be YYYY-MM-DD.`
            });
        }
    }

    return error;
};




/**
 * Constructs a query object by including only non-empty filter values.
 *
 * @param {Object} filters - Object with key-value pairs to filter by.
 * @returns {Object} - A new object containing only the non-empty filters.
 */
const ValidateQueryFiltersAndInsert = (filters) => {
    let query = {};

    for (const [key, value] of Object.entries(filters)) {
        if (value) {
            query[key] = value;
        }
    }
    return query
}


/**
 * Validates that specified fields in an input object match allowed enum values.
 * 
 * - For **required fields**, ensures the value is present and within allowed values.
 * - For **optional fields**, if present, ensures the value is within allowed values.
 * 
 * @param {Object} inputFields - The object containing key-value pairs of fields to validate.
 * @param {Object<string, string[]>} requiredFieldsMap - Map of required field names to their allowed values.
 * @param {Object<string, string[]>} [optionalFieldsMap={}] - Map of optional field names to their allowed values.
 * 
 * @returns {Array<{field: string, message: string}>} - Array of validation error objects.
 *
 * @example
 * const fields = {
 *   gradeName: "GradeX",
 *   level: "",
 *   status: "Archived"
 * };
 * 
 * const requiredEnumMap = {
 *   gradeName: ["GradeA", "GradeB", "GradeC"],
 *   level: ["Level1", "Level2"]
 * };
 * 
 * const optionalEnumMap = {
 *   status: ["Active", "Inactive"]
 * };
 * 
 * const errors = validateEnumFields(fields, requiredEnumMap, optionalEnumMap);
 * console.log(errors);
 * // [
 * //   { field: 'gradeName', message: 'Grade name is invalid.' },
 * //   { field: 'level', message: 'Level is required.' },
 * //   { field: 'status', message: 'Status is invalid.' }
 * // ]
 */
const validateEnumFields = (inputFields, requiredFieldsMap = {}, optionalFieldsMap = {}) => {
    const errors = [];

    const formatFieldLabel = (field) =>
        field.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase());

    const validateRequiredField = (field, allowedValues) => {
        const value = inputFields[field];
        const label = formatFieldLabel(field);

        if (!value || value === "") {
            errors.push({ field: "popup", message: `${label} is required.` });
            return;
        }

        if (!allowedValues.includes(value)) {
            errors.push({ field: "popup", message: `${label} is invalid. Allowed: [${allowedValues.join(", ")}]` });
        }
    };

    const validateOptionalField = (field, allowedValues) => {
        const value = inputFields[field];
        const label = formatFieldLabel(field);

        if (value && !allowedValues.includes(value)) {
            errors.push({ field: "popup", message: `${label} is invalid. Allowed: [${allowedValues.join(", ")}]` });
        }
    };

    Object.entries(requiredFieldsMap).forEach(([field, allowedValues]) => {
        validateRequiredField(field, allowedValues);
    });

    Object.entries(optionalFieldsMap).forEach(([field, allowedValues]) => {
        validateOptionalField(field, allowedValues);
    });

    return errors;
};

/**
 * Validates that specified fields are arrays with at least one element.
 *
 * @param {Object} arrayFields - Object with key-value pairs where values should be non-empty arrays.
 * @returns {Array} - List of error objects for each invalid or empty array field.
 *
 * @example
 * const input = {
 *   studentIds: [],
 *   subjectIds: ["123"],
 *   teacherIds: "notAnArray"
 * };
 * 
 * const errors = ValidateNonEmptyArrays(input);
 * console.log(errors);
 * // [
 * //   { field: 'popup', message: 'Student ids must be a non-empty array.' },
 * //   { field: 'popup', message: 'Teacher ids must be a non-empty array.' }
 * // ]
 */

const ValidateNonEmptyArrays = (arrayFields) => {
    const errors = [];

    for (const [key, value] of Object.entries(arrayFields)) {
        const isValidArray = Array.isArray(value) && value.length > 0;

        if (!isValidArray) {
            const fieldName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
            errors.push({
                field: "popup",
                message: `${fieldName.replace(/^./, str => str.toUpperCase())} must be a non-empty array.`
            });
        }
    }

    return errors;
};



module.exports = { ValidateNonEmptyElements, ValidateMongooseObjectIds, ValidateDateFields, ValidateQueryFiltersAndInsert, validateEnumFields, ValidateNonEmptyArrays }