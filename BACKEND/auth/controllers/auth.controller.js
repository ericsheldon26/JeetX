
const firebaseService = require('../services/firebase.service');
const otpService = require('../services/otp.service');
const passwordService = require('../services/password.service');
const jwtService = require('../services/jwt.service');
const emailService = require('../services/email.service');
const userModel = require('../models/user/user.model');
const crypto = require("crypto");
// const db = require('@/config/database');
const logger = require('../utils/logger');

class AuthController {
    constructor() {
        this.loginWithEmail = this.loginWithEmail.bind(this);
    }

    hashPassword(password) {
        const salt = crypto.randomBytes(16).toString("hex");

        const hash = crypto.pbkdf2Sync(
            password,
            salt,
            100000,
            64,
            "sha512"
        ).toString("hex");

        return `${salt}:${hash}`;
    }

    verifyPassword(password, storedValue) {
        const [salt, originalHash] = storedValue.split(":");

        const hash = crypto.pbkdf2Sync(
            password,
            salt,
            100000,
            64,
            "sha512"
        );

        return crypto.timingSafeEqual(
            // eslint-disable-next-line no-undef
            Buffer.from(originalHash, "hex"),
            hash
        );
    }

    // ==========================================
    // MOBILE OTP ENDPOINTS
    // ==========================================

    async sendMobileOTP(req, res, next) {
        try {
            const { mobile, country_code } = req.body;
            const fullMobile = `${country_code}${mobile}`;

            // Check if can resend
            const canResend = await otpService.canResend(fullMobile, 'mobile');
            if (!canResend.allowed) {
                return res.status(429).json({
                    success: false,
                    error: canResend.error,
                    wait_seconds: canResend.wait_seconds,
                    message: `Please wait ${canResend.wait_seconds} seconds before requesting another OTP`,
                });
            }

            // Send OTP via Firebase
            const result = await firebaseService.sendMobileOTP(fullMobile);

            // Store OTP metadata in Redis
            await otpService.storeOTP(fullMobile, 'firebase_managed', 'mobile');

            logger.info(`Mobile OTP sent to: ${fullMobile.substring(0, 5)}***`);

            res.json({
                success: true,
                message: 'OTP sent successfully to your mobile',
                verification_id: result.verificationId,
            });
        } catch (error) {
            logger.error('Send mobile OTP error:', error);
            next(error);
        }
    }

    async verifyMobileOTP(req, res, next) {
        try {
            const { mobile, country_code, otp, verification_id } = req.body;
            const fullMobile = `${country_code}${mobile}`;

            // Verify OTP with Firebase
            const result = await firebaseService.verifyMobileOTP(verification_id, otp);

            if (!result.valid) {
                return res.status(400).json({
                    success: false,
                    error: 'OTP_INVALID',
                    message: 'Invalid OTP code',
                });
            }

            logger.info(`Mobile verified: ${fullMobile.substring(0, 5)}***`);

            res.json({
                success: true,
                message: 'Mobile number verified successfully',
                firebase_uid: result.uid,
                mobile: fullMobile,
            });
        } catch (error) {
            logger.error('Verify mobile OTP error:', error);
            next(error);
        }
    }

    // ==========================================
    // EMAIL OTP ENDPOINTS
    // ==========================================

    async sendEmailOTP(req, res, next) {
        try {
            const { email } = req.body;

            // Check if can resend
            const canResend = await otpService.canResend(email, 'email');
            if (!canResend.allowed) {
                return res.status(429).json({
                    success: false,
                    error: canResend.error,
                    wait_seconds: canResend.wait_seconds,
                    message: `Please wait ${canResend.wait_seconds} seconds before requesting another OTP`,
                });
            }

            // Generate OTP
            const otp = otpService.generateOTP();

            // Store in Redis
            await otpService.storeOTP(email, otp, 'email');

            // Send email
            await emailService.sendOTP(email, otp);

            logger.info(`Email OTP sent to: ${email.substring(0, 3)}***`);

            res.json({
                success: true,
                message: 'OTP sent successfully to your email',
            });
        } catch (error) {
            logger.error('Send email OTP error:', error);
            next(error);
        }
    }

    async verifyEmailOTP(req, res, next) {
        try {
            const { email, otp } = req.body;

            // Verify OTP
            const result = await otpService.verifyOTP(email, otp, 'email');

            if (!result.valid) {
                return res.status(400).json({
                    success: false,
                    error: result.error,
                    message: result.error === 'OTP_EXPIRED'
                        ? 'OTP has expired. Please request a new one'
                        : 'Invalid OTP code',
                });
            }

            logger.info(`Email verified: ${email.substring(0, 3)}***`);

            res.json({
                success: true,
                message: 'Email verified successfully',
                email: email,
            });
        } catch (error) {
            logger.error('Verify email OTP error:', error);
            next(error);
        }
    }

    // ==========================================
    // PASSWORD VALIDATION ENDPOINT
    // ==========================================

    async validatePassword(req, res, next) {
        try {
            const { password } = req.body;

            const validation = passwordService.validatePassword(password);

            res.json({
                success: true,
                ...validation,
            });
        } catch (error) {
            logger.error('Validate password error:', error);
            next(error);
        }
    }

    // ==========================================
    // USER REGISTRATION
    // ==========================================

    async register(req, res, next) {
        try {
            const {
                full_name,
                mobile,
                country_code,
                email,
                password,
                confirm_password,
                firebase_uid,
                referral_code,
            } = req.body;

            // Check if passwords match
            if (password !== confirm_password) {
                return res.status(400).json({
                    success: false,
                    error: 'PASSWORD_MISMATCH',
                    message: 'Passwords do not match',
                });
            }

            // Validate password strength
            const passwordValidation = passwordService.validatePassword(password);
            if (!passwordValidation.valid) {
                return res.status(400).json({
                    success: false,
                    error: 'PASSWORD_POLICY_FAILED',
                    message: 'Password does not meet security requirements',
                    details: passwordValidation,
                });
            }

            const fullMobile = `${country_code}${mobile}`;

            // Check if user already exists
            const existingEmail = await userModel.findByEmail(email);
            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    error: 'EMAIL_EXISTS',
                    message: 'Email already registered',
                });
            }

            const existingMobile = await userModel.findByMobile(fullMobile);
            if (existingMobile) {
                return res.status(409).json({
                    success: false,
                    error: 'MOBILE_EXISTS',
                    message: 'Mobile number already registered',
                });
            }

            // Create Firebase user with email and password
            const firebaseUser = await firebaseService.createUserWithEmailPassword(email, password, fullMobile);
            const password_hash = this.hashPassword(password.toString().trim())
            // Create user in database
            const userData = {
                firebase_uid: firebaseUser.uid,
                password_hash,
                full_name: full_name.trim(),
                email: email.toLowerCase(),
                mobile: fullMobile,
                is_email_verified: true,
                is_mobile_verified: true,
                status: 'ACTIVE',
            };

            const user = await userModel.create(userData);

            // Create referral code for new user
            const referralService = require('@/services/referral.service');
            await referralService.createReferralCodeForUser(user.id);

            // CREATE WALLET FOR NEW USER
            const walletModel = require('@/models/wallet/wallet.model');
            await walletModel.create(user.id);

            // Generate JWT tokens
            const accessToken = jwtService.generateAccessToken({
                userId: user.id,
                email: user.email,
            });

            // APPLY REFERRAL CODE IF PROVIDED
            if (referral_code) {
                const ipAddress = req.ip || req.connection.remoteAddress;
                const deviceFingerprint = req.headers['x-device-fingerprint'] || null;

                await referralService.applyReferralCode(
                    referral_code,
                    user.id,
                    ipAddress,
                    deviceFingerprint
                );
                await referralService.processReferralEligibility(user.id, 'FIRST_WALLET_ADD')

            }

            const refreshToken = jwtService.generateRefreshToken({
                userId: user.id,
            });

            logger.info(`User registered: ${user.email}`);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    mobile: user.mobile,
                    created_at: user.created_at,
                },
                tokens: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                },
            });
        } catch (error) {
            logger.error('Registration error:', error);

            // Handle specific errors
            if (error.message.includes('email-already-in-use')) {
                return res.status(409).json({
                    success: false,
                    error: 'EMAIL_EXISTS',
                    message: 'Email already registered in Firebase',
                });
            }

            next(error);
        }
    }

    // ==========================================
    // LOGIN WITH EMAIL & PASSWORD
    // ==========================================

    async loginWithEmail(req, res, next) {
        try {
            const { email, password } = req.body;

            // Find user in database
            const user = await userModel.findByEmail(email.toLowerCase());

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password',
                });
            }
            const isMatch = this.verifyPassword(password.toString().trim(), user.password_hash)

            if (user.role !== 'USER') {
                return res.status(403).json({
                    success: false,
                    error: 'NOT_A_USER',
                    message: 'Email is registered to another role.',
                });
            }
            // Check if user is blocked
            if (user.status === 'BLOCKED') {
                return res.status(403).json({
                    success: false,
                    error: 'USER_BLOCKED',
                    message: 'Your account has been blocked. Please contact support.',
                });
            }

            if (!isMatch) {
                return res.status(403).json({
                    success: false,
                    error: 'PASSWORD_INVALID',
                    message: 'Password does not match. Please try again.',
                });
            }

            // Verify password with Firebase
            try {
                await firebaseService.signInWithEmail(email, password);
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    error: `${'INVALID_CREDENTIALS', error}`,
                    message: 'Invalid email or password',
                });
            }

            // Update last login
            await userModel.updateLastLogin(user.id);

            // Generate JWT tokens
            const accessToken = jwtService.generateAccessToken({
                userId: user.id,
                email: user.email,
            });

            const notificationService = require('../services/notification.service');
            await notificationService.sendSystemNotification(
                user.id,
                'LOGIN_SUCCESS',
                {
                    message: "Congratulations on logging in to JeetX"
                }
            );
            // const refreshToken = jwtService.generateRefreshToken({
            //     userId: user.id,
            // });

            logger.info(`User logged in: ${user.email}`);

            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    mobile: user.mobile,
                },
                tokens: {
                    access_token: accessToken,
                    // refresh_token: refreshToken,
                },
            });
        } catch (error) {
            logger.error('Login error:', error);
            next(error);
        }
    }

    // ==========================================
    // LOGIN WITH MOBILE OTP
    // ==========================================

    async loginWithMobile(req, res, next) {
        try {
            const { mobile, country_code, } = req.body;
            const fullMobile = `${country_code}${mobile}`;

            // Verify OTP with Firebase
            // const otpResult = await firebaseService.verifyMobileOTP(verification_id, otp);

            // if (!otpResult.valid) {
            //     return res.status(400).json({
            //         success: false,
            //         error: 'OTP_INVALID',
            //         message: 'Invalid OTP code',
            //     });
            // }
            // Verify password with Firebase



            const fireBaseUser = await firebaseService.signInWithNumber(fullMobile);
            if (!fireBaseUser) {
                return res.status(401).json({
                    success: false,
                    error: 'INVALID_CREDENTIALS',
                    message: 'Invalid mobile number',
                });
            }

            // Find user in database
            const user = await userModel.findByMobile(fullMobile);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'USER_NOT_FOUND',
                    message: 'No account found with this mobile number',
                });
            }

            // Check if user is blocked
            if (user.status === 'BLOCKED') {
                return res.status(403).json({
                    success: false,
                    error: 'USER_BLOCKED',
                    message: 'Your account has been blocked. Please contact support.',
                });
            }

            // Update last login
            await userModel.updateLastLogin(user.id);

            // Generate JWT tokens
            const accessToken = jwtService.generateAccessToken({
                userId: user.id,
                email: user.email,
            });

            const refreshToken = jwtService.generateRefreshToken({
                userId: user.id,
            });

            logger.info(`User logged in with mobile: ${fullMobile.substring(0, 5)}***`);

            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    mobile: user.mobile,
                },
                tokens: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                },
            });
        } catch (error) {
            logger.error('Mobile login error:', error);
            next(error);
        }
    }

    // ==========================================
    // FORGOT PASSWORD - EMAIL
    // ==========================================

    async forgotPasswordEmail(req, res, next) {
        try {
            const { email } = req.body;

            // Check if user exists
            const user = await userModel.findByEmail(email.toLowerCase());
            // For security, always return success even if user doesn't exist
            if (!user) {
                return res.json({
                    success: true,
                    message: 'If an account exists with this email, you will receive a password reset link',
                });
            }

            // Generate password reset link via Firebase
            const result = await firebaseService.sendPasswordResetEmail(email);
            // Send email with reset link
            await emailService.sendPasswordResetEmail(email, result.link);

            logger.info(`Password reset requested for: ${email.substring(0, 3)}***`);

            res.json({
                success: true,
                message: 'Password reset link sent to your email',
            });
        } catch (error) {
            logger.error('Forgot password email error:', error);
            next(error);
        }
    }

    // ==========================================
    // FORGOT PASSWORD - MOBILE OTP
    // ==========================================

    async forgotPasswordMobile(req, res, next) {
        try {
            const { mobile, country_code } = req.body;
            const fullMobile = `${country_code}${mobile}`;

            // Check if user exists
            const user = await userModel.findByMobile(fullMobile);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'USER_NOT_FOUND',
                    message: 'No account found with this mobile number',
                });
            }

            // Check if can resend
            const canResend = await otpService.canResend(fullMobile, 'mobile');
            if (!canResend.allowed) {
                return res.status(429).json({
                    success: false,
                    error: canResend.error,
                    wait_seconds: canResend.wait_seconds,
                });
            }

            // Send OTP via Firebase
            const result = await firebaseService.sendMobileOTP(fullMobile);
            await otpService.storeOTP(fullMobile, 'firebase_managed', 'mobile');

            logger.info(`Password reset OTP sent to: ${fullMobile.substring(0, 5)}***`);

            res.json({
                success: true,
                message: 'OTP sent to your mobile for password reset',
                verification_id: result.verificationId,
            });
        } catch (error) {
            logger.error('Forgot password mobile error:', error);
            next(error);
        }
    }

    // ==========================================
    // RESET PASSWORD (After OTP Verification)
    // ==========================================

    async resetPassword(req, res, next) {
        try {
            const { email, mobile, country_code, new_password, confirm_password } = req.body;

            // Check if passwords match
            if (new_password !== confirm_password) {
                return res.status(400).json({
                    success: false,
                    error: 'PASSWORD_MISMATCH',
                    message: 'Passwords do not match',
                });
            }

            // Validate new password
            const passwordValidation = passwordService.validatePassword(new_password);
            if (!passwordValidation.valid) {
                return res.status(400).json({
                    success: false,
                    error: 'PASSWORD_POLICY_FAILED',
                    message: 'Password does not meet security requirements',
                    details: passwordValidation,
                });
            }

            // Find user by email or mobile
            let user;
            if (email) {
                user = await userModel.findByEmail(email.toLowerCase());
            } else if (mobile && country_code) {
                const fullMobile = `${country_code}${mobile}`;
                user = await userModel.findByMobile(fullMobile);
            }

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'USER_NOT_FOUND',
                    message: 'User not found',
                });
            }

            // Update password in Firebase
            await firebaseService.updateUserPassword(user.firebase_uid, new_password);

            logger.info(`Password reset for user: ${user.email}`);

            res.json({
                success: true,
                message: 'Password reset successfully. You can now login with your new password',
            });
        } catch (error) {
            logger.error('Reset password error:', error);
            next(error);
        }
    }

    // ==========================================
    // REFRESH TOKEN
    // ==========================================

    async refreshToken(req, res, next) {
        try {
            const { refresh_token } = req.body;

            if (!refresh_token) {
                return res.status(400).json({
                    success: false,
                    error: 'REFRESH_TOKEN_REQUIRED',
                    message: 'Refresh token is required',
                });
            }

            // Verify refresh token
            let decoded;
            try {
                decoded = jwtService.verifyRefreshToken(refresh_token);
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    error: `${'INVALID_REFRESH_TOKEN', error}`,
                    message: 'Invalid or expired refresh token',
                });
            }

            // Get user
            const user = await userModel.findById(decoded.userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'USER_NOT_FOUND',
                    message: 'User not found',
                });
            }

            if (user.status === 'BLOCKED') {
                return res.status(403).json({
                    success: false,
                    error: 'USER_BLOCKED',
                    message: 'User account is blocked',
                });
            }

            // Generate new access token
            const accessToken = jwtService.generateAccessToken({
                userId: user.id,
                email: user.email,
            });

            res.json({
                success: true,
                message: 'Token refreshed successfully',
                access_token: accessToken,
            });
        } catch (error) {
            logger.error('Refresh token error:', error);
            next(error);
        }
    }

    // ==========================================
    // LOGOUT (Optional - client-side token removal)
    // ==========================================

    async logout(req, res, next) {
        try {
            // In JWT, logout is typically handled client-side by removing tokens
            // This endpoint can be used for logging or future token blacklisting

            logger.info(`User logged out: ${req.user?.email || 'unknown'}`);

            res.json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            logger.error('Logout error:', error);
            next(error);
        }
    }

    async delete(req, res) {
        try {
            const { email } = req.body;

            const result = await firebaseService.deleteUser(email)
            if (result.success) {
                logger.info(`User deleted: ${email}`);

                return res.json({
                    success: true,
                    message: 'User deleted successfully',
                    userList: result?.userList
                });
            }
            else {
                return res.json({
                    success: false,
                    error: result?.error
                });
            }

        } catch (error) {
            logger.error('Delete User error:', error);
            return res.json({
                success: false,
                error: error
            });
        }
    }
}

module.exports = new AuthController();