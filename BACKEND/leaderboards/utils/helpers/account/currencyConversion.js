const currency_conversion_into_inr = (amount, currencyName, currencyConversionRate) => {
    try {
        // console.debug(`Converting ${amount} ${currencyName} to INR at rate ${currencyConversionRate}`);

        if (typeof amount !== 'number' || typeof currencyConversionRate !== 'number') {
            throw new Error('Invalid input: amount and conversion rate must be numbers');
        }

        const convertedAmount = amount * currencyConversionRate;
        return parseFloat(convertedAmount.toFixed(2));
    } catch (error) {
        console.error(`Error converting currency: ${error.message}`);
        return null;
    }
};

module.exports = { currency_conversion_into_inr }
