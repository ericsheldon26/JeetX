// ==========================================
// src/services/otp.service.js - Complete OTP Service
// ==========================================
const redisClient = require('../config/redis');
const logger = require('../utils/logger');

class OTPService {
  constructor() {
    this.OTP_LENGTH = parseInt(process.env.OTP_LENGTH) || 6;
    this.OTP_EXPIRY = parseInt(process.env.OTP_EXPIRY_MINUTES) * 60 || 300; // Convert to seconds
    this.RESEND_DELAY = parseInt(process.env.OTP_RESEND_SECONDS) || 30;
    this.MAX_ATTEMPTS = parseInt(process.env.MAX_OTP_ATTEMPTS) || 5;
  }

  /**
   * Generate a random OTP
   * @returns {string} OTP code
   */
  generateOTP() {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < this.OTP_LENGTH; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    
    logger.debug(`OTP generated: ${otp.substring(0, 2)}****`);
    return otp;
  }

  /**
   * Store OTP in Redis with metadata
   * @param {string} identifier - Email or phone number
   * @param {string} otp - OTP code
   * @param {string} type - 'email' or 'mobile'
   * @returns {Promise<Object>} Stored data
   */
  async storeOTP(identifier, otp, type = 'email') {
    try {
      const key = `otp:${type}:${identifier}`;
      
      // Check if OTP already exists
      const existing = await redisClient.client.get(key);
      let attemptCount = 1;
      
      if (existing) {
        const parsed = JSON.parse(existing);
        attemptCount = parsed.attempt_count + 1;
        
        // Check if max attempts exceeded
        if (attemptCount > this.MAX_ATTEMPTS) {
          throw new Error('RATE_LIMITED');
        }
      }
      
      const data = {
        otp,
        sent_at: Date.now(),
        resend_after: Date.now() + (this.RESEND_DELAY * 1000),
        attempt_count: attemptCount,
      };
      
      // Store in Redis with expiry
      await redisClient.client.setEx(
        key,
        this.OTP_EXPIRY,
        JSON.stringify(data)
      );
      
      logger.info(`OTP stored for ${type}: ${identifier.substring(0, 3)}***`);
      logger.debug(`OTP expires in ${this.OTP_EXPIRY} seconds`);
      
      return data;
    } catch (error) {
      logger.error('Store OTP error:', error);
      throw error;
    }
  }

  /**
   * Verify OTP
   * @param {string} identifier - Email or phone number
   * @param {string} otp - OTP code to verify
   * @param {string} type - 'email' or 'mobile'
   * @returns {Promise<Object>} Verification result
   */
  async verifyOTP(identifier, otp, type = 'email') {
    try {
      const key = `otp:${type}:${identifier}`;
      const data = await redisClient.client.get(key);
      
      if (!data) {
        logger.warn(`OTP verification failed: expired or not found for ${identifier.substring(0, 3)}***`);
        return { 
          valid: false, 
          error: 'OTP_EXPIRED',
          message: 'OTP has expired or does not exist'
        };
      }
      
      const parsed = JSON.parse(data);
      
      // Check if max attempts exceeded
      if (parsed.attempt_count > this.MAX_ATTEMPTS) {
        await redisClient.client.del(key);
        logger.warn(`OTP verification failed: rate limited for ${identifier.substring(0, 3)}***`);
        return { 
          valid: false, 
          error: 'RATE_LIMITED',
          message: 'Too many OTP attempts'
        };
      }
      
      // Verify OTP
      if (parsed.otp !== otp) {
        logger.warn(`OTP verification failed: invalid code for ${identifier.substring(0, 3)}***`);
        return { 
          valid: false, 
          error: 'OTP_INVALID',
          message: 'Invalid OTP code'
        };
      }
      
      // OTP is valid - delete it
      await redisClient.client.del(key);
      logger.info(`OTP verified successfully for ${type}: ${identifier.substring(0, 3)}***`);
      
      return { 
        valid: true,
        message: 'OTP verified successfully'
      };
    } catch (error) {
      logger.error('Verify OTP error:', error);
      throw error;
    }
  }

  /**
   * Check if OTP can be resent
   * @param {string} identifier - Email or phone number
   * @param {string} type - 'email' or 'mobile'
   * @returns {Promise<Object>} Can resend status
   */
  async canResend(identifier, type = 'email') {
    try {
      const key = `otp:${type}:${identifier}`;
      const data = await redisClient.client.get(key);
      
      if (!data) {
        // No existing OTP, can send
        return { 
          allowed: true,
          message: 'Can send OTP'
        };
      }
      
      const parsed = JSON.parse(data);
      const now = Date.now();
      
      // Check if max attempts exceeded
      if (parsed.attempt_count >= this.MAX_ATTEMPTS) {
        const ttl = await redisClient.client.ttl(key);
        logger.warn(`OTP resend blocked: rate limited for ${identifier.substring(0, 3)}***`);
        return {
          allowed: false,
          error: 'RATE_LIMITED',
          message: 'Too many OTP requests',
          retry_after: ttl > 0 ? ttl : 0
        };
      }
      
      // Check if resend delay has passed
      if (now < parsed.resend_after) {
        const waitTime = Math.ceil((parsed.resend_after - now) / 1000);
        logger.info(`OTP resend blocked: too soon for ${identifier.substring(0, 3)}***`);
        return {
          allowed: false,
          error: 'OTP_RESEND_NOT_ALLOWED',
          message: `Please wait ${waitTime} seconds before requesting another OTP`,
          wait_seconds: waitTime,
        };
      }
      
      // Can resend
      return { 
        allowed: true,
        message: 'Can resend OTP'
      };
    } catch (error) {
      logger.error('Can resend OTP error:', error);
      throw error;
    }
  }

  /**
   * Get OTP details (for debugging - use carefully)
   * @param {string} identifier - Email or phone number
   * @param {string} type - 'email' or 'mobile'
   * @returns {Promise<Object|null>} OTP details or null
   */
  async getOTPDetails(identifier, type = 'email') {
    try {
      const key = `otp:${type}:${identifier}`;
      const data = await redisClient.client.get(key);
      
      if (!data) {
        return null;
      }
      
      const parsed = JSON.parse(data);
      const ttl = await redisClient.client.ttl(key);
      
      return {
        ...parsed,
        expires_in_seconds: ttl,
        can_resend: Date.now() >= parsed.resend_after,
      };
    } catch (error) {
      logger.error('Get OTP details error:', error);
      throw error;
    }
  }

  /**
   * Delete OTP (for cleanup or testing)
   * @param {string} identifier - Email or phone number
   * @param {string} type - 'email' or 'mobile'
   * @returns {Promise<boolean>} True if deleted
   */
  async deleteOTP(identifier, type = 'email') {
    try {
      const key = `otp:${type}:${identifier}`;
      const result = await redisClient.client.del(key);
      
      logger.info(`OTP deleted for ${type}: ${identifier.substring(0, 3)}***`);
      return result === 1;
    } catch (error) {
      logger.error('Delete OTP error:', error);
      throw error;
    }
  }

  /**
   * Clear all OTPs (for testing only!)
   * @returns {Promise<void>}
   */
  async clearAllOTPs() {
    try {
      const keys = await redisClient.client.keys('otp:*');
      
      if (keys.length > 0) {
        await redisClient.client.del(keys);
        logger.warn(`Cleared ${keys.length} OTPs from Redis`);
      }
    } catch (error) {
      logger.error('Clear all OTPs error:', error);
      throw error;
    }
  }

  /**
   * Get statistics
   * @returns {Promise<Object>} OTP statistics
   */
  async getStats() {
    try {
      const emailKeys = await redisClient.client.keys('otp:email:*');
      const mobileKeys = await redisClient.client.keys('otp:mobile:*');
      
      return {
        total_otps: emailKeys.length + mobileKeys.length,
        email_otps: emailKeys.length,
        mobile_otps: mobileKeys.length,
      };
    } catch (error) {
      logger.error('Get OTP stats error:', error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new OTPService();