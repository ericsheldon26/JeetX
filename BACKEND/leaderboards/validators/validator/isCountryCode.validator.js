const isCountryCode = (countryCode) => {
    const regex = /^\+[1-9]\d{0,2}$/;

    return regex.test(countryCode);
}

module.exports = isCountryCode;