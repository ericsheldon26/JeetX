const OTPExpiryValidation = (createdAt) => {
    if (createdAt) {
        const created = new Date(createdAt);
        const currentTime = new Date();

        const differenceInMilliseconds = currentTime - created;

        const isWithin15Minutes = differenceInMilliseconds <= 15 * 60 * 1000;

        if (isWithin15Minutes) {
            return {
                success: true,
                expire: false
            };
        } else {
            return {
                success: true,
                expire: true
            };
        }
    }
    else {
        return {
            success: false,
            expire: null
        };
    }
}

module.exports = OTPExpiryValidation;