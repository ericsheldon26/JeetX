const eslint = require("@eslint/js");

module.exports = [
    eslint.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",
            globals: {
                require: "readonly",
                module: "readonly",
                process: "readonly",
                console: "readonly",
                fetch: "readonly",
                btoa: "readonly",
            },
        },
        rules: {
            "no-unused-vars": "warn",
        },
    }
];
