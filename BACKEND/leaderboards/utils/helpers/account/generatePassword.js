const isPassword = require("@/validators/user/isPassword.validator");

const GeneratePassword = () => {
    const password = ReturnPassword();

    if (isPassword(password)) {
        return password;
    }
    else {
        GeneratePassword();
    }
}

const ReturnPassword = () => {
    // Define characters for each character type
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digitChars = "0123456789";
    const specialChars = "@$!%*?&";

    // Generate a random character from each character type
    const randomLowercase = lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    const randomUppercase = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    const randomDigit = digitChars[Math.floor(Math.random() * digitChars.length)];
    const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];

    // Concatenate all random characters
    const randomChars = randomLowercase + randomUppercase + randomDigit + randomSpecial;

    // Generate remaining random characters
    let remainingChars = "";
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * randomChars.length);
        remainingChars += randomChars[randomIndex];
    }

    // Shuffle all characters to ensure randomness
    const shuffledChars = randomChars + remainingChars;
    const shuffledPasswordArray = shuffledChars.split("");
    shuffledPasswordArray.sort(() => Math.random() - 0.5);

    // Convert array back to string
    const password = shuffledPasswordArray.join("");

    return password;
}

module.exports = GeneratePassword;