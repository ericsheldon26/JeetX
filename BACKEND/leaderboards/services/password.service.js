

class PasswordService {
    constructor() {
        this.MIN_LENGTH = 8;
        this.MAX_LENGTH = 16;
        this.SPECIAL_CHARS = '@#$%^&*';
    }

    /**
     * Validate password against policy
     * @param {string} password 
     * @returns {Object} Validation result
     */
    validatePassword(password) {
        const rules = {
            length: password.length >= this.MIN_LENGTH && password.length <= this.MAX_LENGTH,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: new RegExp(`[${this.SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password),
        };

        const passedRules = Object.values(rules).filter(Boolean).length;

        let strength = 'WEAK';
        let borderColor = 'RED';

        if (passedRules === 5) {
            strength = 'STRONG';
            borderColor = 'GREEN';
        } else if (passedRules >= 3) {
            strength = 'MEDIUM';
            borderColor = 'YELLOW';
        }

        return {
            valid: Object.values(rules).every(Boolean),
            strength,
            score: passedRules,
            rules,
            ui_hint: {
                border_color: borderColor,
                info_message: `Password must be ${this.MIN_LENGTH}-${this.MAX_LENGTH} characters and include uppercase, lowercase, number, and special character (${this.SPECIAL_CHARS})`,
            },
        };
    }

    /**
     * Get password rules
     * @returns {Object} Password rules
     */
    getPasswordRules() {
        return {
            length: `${this.MIN_LENGTH}-${this.MAX_LENGTH} characters`,
            uppercase: 'At least 1 uppercase letter (A-Z)',
            lowercase: 'At least 1 lowercase letter (a-z)',
            number: 'At least 1 number (0-9)',
            special: `At least 1 special character (${this.SPECIAL_CHARS})`,
        };
    }
}

module.exports = new PasswordService();
