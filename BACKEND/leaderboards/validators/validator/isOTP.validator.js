const isOTP = (otp) => {
    const regex = /^[0-9]{6}$/;

    return regex.test(otp);
}

module.exports = isOTP;