const isTimezone = (timezone) => {
    const regex = /^(Z|[+-](?:2[0-3]|[01]?[0-9])(?::?(?:[0-5]?[0-9]))?)$/;

    return regex.test(timezone);
}

module.exports = isTimezone;