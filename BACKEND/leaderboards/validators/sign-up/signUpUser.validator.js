const isEmpty = require("@/validators/validator/isEmpty.validator");
const isEmail = require("@/validators/validator/isEmail.validator");
// password field removed — using Firebase auth instead
const isMobileNumber = require("@/validators/validator/isMobileNumber.validator");
const isCountryCode = require("@/validators/validator/isCountryCode.validator");
const isText = require("@/validators/validator/isText.validator");
const isObject = require("@/validators/validator/isObject.validator");

const SignUpUserValidator = async (request, response, next) => {
    let error = [];

    const {
        first_name,
        // eslint-disable-next-line no-unused-vars
        middle_name,
        last_name,
        email,
        firebase_user_id,
        firebaseUserId,
        mobileNumber,
        personal,
        address,
        currency,
        city
    } = request.body || {};

    const firebaseId = firebase_user_id || firebaseUserId || null;

    // Names
    if (isEmpty(first_name)) {
        error.push({ field: "first_name", message: "Please enter first name." });
    }
    else if (!isText(first_name)) {
        error.push({ field: "first_name", message: "Please enter a valid first name." });
    }

    if (isEmpty(last_name)) {
        error.push({ field: "last_name", message: "Please enter last name." });
    }
    else if (!isText(last_name)) {
        error.push({ field: "last_name", message: "Please enter a valid last name." });
    }

    // Email
    if (isEmpty(email)) {
        error.push({ field: "email", message: "Please enter your email address." });
    }
    else if (!isEmail(email)) {
        error.push({ field: "email", message: "Please enter a valid email address." });
    }

    // Password removed from signup — require firebase_user_id instead
    if (isEmpty(firebase_user_id)) {
        error.push({ field: "firebase_user_id", message: "Please provide firebase_user_id." });
    }

    // Mobile
    if (!mobileNumber || isEmpty(mobileNumber?.number) || isEmpty(mobileNumber?.countryCode)) {
        error.push({ field: "mobileNumber", message: "Please provide mobile number and country code." });
    }
    else {
        if (!isMobileNumber(mobileNumber.number)) {
            error.push({ field: "mobileNumber.number", message: "Please enter a valid mobile number." });
        }
        if (!isCountryCode(mobileNumber.countryCode)) {
            error.push({ field: "mobileNumber.countryCode", message: "Please enter a valid country code (e.g. +91)." });
        }
    }

    // Optional player-related fields
    if (!isEmpty(personal) && !isObject(personal)) {
        error.push({ field: "personal", message: "Personal must be an object." });
    }

    if (!isEmpty(address) && typeof address !== 'string') {
        error.push({ field: "address", message: "Address must be a string." });
    }

    if (!isEmpty(currency)) {
        if (typeof currency !== 'string' || !/^[A-Za-z]{3}$/.test(currency)) {
            error.push({ field: "currency", message: "Currency must be a 3-letter ISO code (e.g. USD)." });
        }
    }

    if (!isEmpty(city) && !isText(city)) {
        error.push({ field: "city", message: "Please enter a valid city name." });
    }


    if (error.length > 0) {
        return response.status(200).json({
            code: 200,
            success: false,
            error: error,
            message: ""
        });
    }

    next();
}

module.exports = SignUpUserValidator;

