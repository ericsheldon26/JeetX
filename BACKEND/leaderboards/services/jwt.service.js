
const jwt = require('jsonwebtoken');

class JWTService {
    constructor() {
        this.ACCESS_SECRET = process.env.JWT_SECRET;
        this.REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
        this.ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '7d';
        this.REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
    }

    /**
     * Generate access token
     * @param {Object} payload 
     * @returns {string} JWT token
     */
    generateAccessToken(payload) {
        return jwt.sign(payload, this.ACCESS_SECRET, {
            expiresIn: this.ACCESS_EXPIRY,
        });
    }

    /**
     * Generate refresh token
     * @param {Object} payload 
     * @returns {string} JWT token
     */
    generateRefreshToken(payload) {
        return jwt.sign(payload, this.REFRESH_SECRET, {
            expiresIn: this.REFRESH_EXPIRY,
        });
    }

    /**
     * Verify access token
     * @param {string} token 
     * @returns {Object} Decoded payload
     */
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.ACCESS_SECRET);
        } catch (error) {
            throw new Error('Invalid or expired access token', error);
        }
    }

    /**
     * Verify refresh token
     * @param {string} token 
     * @returns {Object} Decoded payload
     */
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.REFRESH_SECRET);
        } catch (error) {
            throw new Error('Invalid or expired refresh token', error);
        }
    }

    /**
     * Decode token without verification (for debugging)
     * @param {string} token 
     * @returns {Object} Decoded payload
     */
    decodeToken(token) {
        return jwt.decode(token);
    }
}

module.exports = new JWTService();
