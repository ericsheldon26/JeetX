/* eslint-disable no-prototype-builtins */
const sanitizeHtml = require("sanitize-html");

const SanitizeRequest = async (request, response, next) => {
    if (request.body) {
        for (let key in request.body) {
            if (request.body.hasOwnProperty(key)) {
                request.body[key] = sanitizeInput(request.body[key]);
            }
        }
    }

    if (request.query) {
        for (let key in request.query) {
            if (request.query.hasOwnProperty(key)) {
                request.query[key] = sanitizeInput(request.query[key]);
            }
        }
    }

    if (request.params) {
        for (let key in request.params) {
            if (request.params.hasOwnProperty(key)) {
                request.params[key] = sanitizeInput(request.params[key]);
            }
        }
    }

    next();
}

const sanitizeInput = (input) => {
    if (typeof input == "string") {
        input = input.trim();
        input = sanitizeHtml(input);
    }

    return input;
}

module.exports = SanitizeRequest;