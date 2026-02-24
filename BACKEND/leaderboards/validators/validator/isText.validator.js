const isText = (text) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(text);
}

module.exports = isText;