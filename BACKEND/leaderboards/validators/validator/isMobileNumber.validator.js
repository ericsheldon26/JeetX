const isMobileNumber = (mobileNumber) => {
    const regex = /^[6-9]\d{9}$/;
    
    return regex.test(mobileNumber);
}

module.exports = isMobileNumber;