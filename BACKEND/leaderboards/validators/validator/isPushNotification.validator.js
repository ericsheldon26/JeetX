function validateRequest(body, requiredFields) {
    const errors = [];

    for (const field of requiredFields) {
        if (!body[field]) {
            errors.push(`${field} is required`);
        }
    }

    return errors;
}

module.exports = {validateRequest};