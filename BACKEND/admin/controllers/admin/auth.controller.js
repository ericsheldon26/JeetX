const userModel = require('../../models/user/user.model');
const firebaseService = require('../../services/firebase.service');
const jwtService = require('../../services/jwt.service');
const logger = require('../../utils/logger');
const db = require('../../config/database');
const crypto = require("crypto");

// const bcrypt = require('bcrypt');

async function getAdminCount() {
    const query = "SELECT COUNT(*) as count FROM users WHERE role != 'USER'";
    const result = await db.query(query);
    // console.log(parseInt(result.rows[0].count))
    return parseInt(result.rows[0].count);
    // return 0
}

function getDefaultPermissions(role) {
    if (role === 'SUPER_ADMIN') {
        return {
            users: {
                "view": true,
                "create": true,
                "edit": true,
                "delete": false
            },
            tournaments: {
                "view": true,
                "create": true,
                "edit": true,
                "delete": true,
                "cancel": true
            },
            notifications: {
                "view": true,
                "create": true,
                "send": true
            },
            referrals: {
                "view": true,
                "edit": false
            },
            settings: {
                "view": true,
                "edit": false
            },
            admins: {
                "view": true,
                "create": true,
                "edit": true,
                "delete": true,
            },
            analytics: {
                "view": true,
            },
            wallet: {
                "view": true,
                "create": true,
            },
            campaigns: {
                "view": true,
                "create": true,
                "edit": true,
                "delete": true,
                "cancel": true
            },
        };
    }

    // Regular admin
    return {
        users: {
            "view": true,
            "create": true,
            "edit": true,
            "delete": false
        },
        tournaments: {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true,
            "cancel": true
        },
        notifications: {
            "view": true,
            "create": true,
            "send": true
        },
        referrals: {
            "view": true,
            "edit": false
        },
        settings: {
            "view": true,
            "edit": false
        },
        admins: {
            "view": true,
            "create": false,
            "edit": false,
            "delete": false,
        },
        analytics: {
            "view": true,
        },
        wallet: {
            "view": true,
            "create": false,
        },
        campaigns: {
            "view": true,
            "create": true,
            "edit": true,
            "delete": true,
            "cancel": false
        },
    };
}

class AdminAuthController {
    constructor() {
        this.loginAdmin = this.loginAdmin.bind(this);
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
    getDefaultPermissions(role) {
        if (role === 'SUPER_ADMIN') {
            return {
                users: {
                    "view": true,
                    "create": true,
                    "edit": true,
                    "delete": false
                },
                tournaments: {
                    "view": true,
                    "create": true,
                    "edit": true,
                    "delete": true,
                    "cancel": true
                },
                notifications: {
                    "view": true,
                    "create": true,
                    "send": true
                },
                referrals: {
                    "view": true,
                    "edit": false
                },
                settings: {
                    "view": true,
                    "edit": false
                },
                admins: {
                    "view": true,
                    "create": true,
                    "edit": true,
                    "delete": true,
                },
                analytics: {
                    "view": true,
                },
                wallet: {
                    "view": true,
                    "create": true,
                },
                campaigns: {
                    "view": true,
                    "create": true,
                    "edit": true,
                    "delete": true,
                    "cancel": true
                },
            };
        }

        // Regular admin
        return {
            users: {
                "view": true,
                "create": true,
                "edit": true,
                "delete": false
            },
            tournaments: {
                "view": true,
                "create": true,
                "edit": true,
                "delete": true,
                "cancel": true
            },
            notifications: {
                "view": true,
                "create": true,
                "send": true
            },
            referrals: {
                "view": true,
                "edit": false
            },
            settings: {
                "view": true,
                "edit": false
            },
            admins: {
                "view": true,
                "create": false,
                "edit": false,
                "delete": false,
            },
            analytics: {
                "view": true,
            },
            wallet: {
                "view": true,
                "create": false,
            },
            campaigns: {
                "view": true,
                "create": true,
                "edit": true,
                "delete": true,
                "cancel": false
            },
        };
    }
    /**
     * Register admin (Super Admin only or initial setup)
     * POST /admin/api/v1/auth/register
     */
    async registerAdmin(req, res, next) {
        try {
            const {
                full_name,
                email,
                password,
                mobile,
                country_code,
                role = 'ADMIN',
                permissions,
            } = req.body;
            const fullMobile = `${country_code}${mobile}`;

            // Check if this is initial setup (no admins exist)

            const adminCount = await getAdminCount();
            const password_hash = this.hashPassword(password)

            // If admins exist, require super admin authentication
            if (adminCount > 0) {
                // This endpoint should only be called by authenticated super admin
                if (!req.user || req.user.role !== 'SUPER_ADMIN') {
                    return res.status(403).json({
                        success: false,
                        error: 'SUPER_ADMIN_REQUIRED',
                        message: 'Only Super Admin can create new admins',
                    });
                }
            }

            // Validate role
            if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    error: 'INVALID_ROLE',
                    message: 'Role must be ADMIN or SUPER_ADMIN',
                });
            }

            // Check if email already exists
            const existingUser = await userModel.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    error: 'EMAIL_EXISTS',
                    message: 'Email already registered',
                });
            }

            // Create Firebase user
            const firebaseUser = await firebaseService.createUserWithEmailPassword(
                email,
                password,
                fullMobile
            );

            // Create admin user in database
            const adminData = {
                firebase_uid: firebaseUser.uid,
                full_name: full_name.trim(),
                password_hash,
                email: email.toLowerCase(),
                mobile: fullMobile,
                role: role,
                is_admin: true,
                admin_permissions: getDefaultPermissions(role),
                is_email_verified: true,
                is_mobile_verified: true,
                status: 'ACTIVE',
                created_by: req.user?.id || null,
            };

            const admin = await userModel.create(adminData);

            logger.info(`Admin created: ${admin.email} by ${req.user?.email || 'system'}`);

            res.status(201).json({
                success: true,
                message: 'Admin registered successfully',
                data: {
                    id: admin.id,
                    full_name: admin.full_name,
                    email: admin.email,
                    role: admin.role,
                    permissions: admin.admin_permissions,
                },
            });
        } catch (error) {
            logger.error('Admin registration error:', error);
            next(error);
        }
    }

    /**
     * Admin login
     * POST /admin/api/v1/auth/login
     */
    async loginAdmin(req, res, next) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await userModel.findByEmail(email.toLowerCase());

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password',
                });
            }

            // Check if user is admin
            if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    error: 'ADMIN_ACCESS_REQUIRED',
                    message: 'Admin access required',
                });
            }

            // Check if blocked
            if (user.status === 'BLOCKED') {
                return res.status(403).json({
                    success: false,
                    error: 'ACCOUNT_BLOCKED',
                    message: 'Your account has been blocked',
                });
            }

            const isMatch = this.verifyPassword(password.toString().trim(), user.password_hash)
            if (!isMatch) {
                return res.status(403).json({
                    success: false,
                    error: 'PASSWORD_INVALID',
                    message: 'Password does not match. Please try again.',
                });
            }
            try {
                await firebaseService.signInWithEmail(email, password);
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    error: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password',
                });
            }

            // Update last login
            await userModel.updateLastLogin(user.id);

            // Generate JWT tokens
            const accessToken = jwtService.generateAccessToken({
                userId: user.id,
                email: user.email,
                role: user.role,
                is_admin: true,
            });

            // const refreshToken = jwtService.generateRefreshToken({
            //     userId: user.id,
            // });

            logger.info(`Admin logged in: ${user.email}`);

            res.json({
                success: true,
                message: 'Admin login successful',
                data: {
                    user: {
                        id: user.id,
                        full_name: user.full_name,
                        email: user.email,
                        role: user.role,
                        permissions: user.admin_permissions,
                    },
                    tokens: {
                        access_token: accessToken,
                        // refresh_token: refreshToken,
                    },
                },
            });
        } catch (error) {
            logger.error('Admin login error:', error);
            next(error);
        }
    }

    /**
     * Get all admins (Super Admin only)
     * GET /admin/api/v1/auth/admins
     */
    async getAdmins(req, res, next) {
        try {
            const query = `
        SELECT 
          id, full_name, email, mobile, role, 
           admin_permissions, status, created_at,
          last_login_at
        FROM users
        WHERE role != 'USER'
        ORDER BY created_at DESC
      `;

            const result = await db.query(query);

            res.json({
                success: true,
                data: result.rows,
                count: result.rows.length,
            });
        } catch (error) {
            logger.error('Get admins error:', error);
            next(error);
        }
    }

    /**
     * Update admin permissions
     * PUT /admin/api/v1/auth/admins/:id/permissions
     */
    async updatePermissions(req, res, next) {
        try {
            const { id } = req.params;
            const { permissions } = req.body;

            // Only super admin can update permissions
            if (req.user.role !== 'SUPER_ADMIN') {
                return res.status(403).json({
                    success: false,
                    error: 'SUPER_ADMIN_REQUIRED',
                });
            }

            const query = `
        UPDATE users
        SET admin_permissions = $1
        WHERE id = $2 AND is_admin = TRUE
        RETURNING id, email, role, admin_permissions
      `;

            const result = await db.query(query, [JSON.stringify(permissions), id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'ADMIN_NOT_FOUND',
                });
            }

            res.json({
                success: true,
                message: 'Permissions updated',
                data: result.rows[0],
            });
        } catch (error) {
            logger.error('Update permissions error:', error);
            next(error);
        }
    }

    /**
     * Deactivate admin
     * DELETE /admin/api/v1/auth/admins/:id
     */
    async deactivateAdmin(req, res, next) {
        try {
            const { id } = req.params;

            // Only super admin can deactivate
            if (req.user.role !== 'SUPER_ADMIN') {
                return res.status(403).json({
                    success: false,
                    error: 'SUPER_ADMIN_REQUIRED',
                });
            }

            // Cannot deactivate yourself
            if (req.user.id === id) {
                return res.status(400).json({
                    success: false,
                    error: 'CANNOT_DEACTIVATE_SELF',
                });
            }

            const query = `
        UPDATE users
        SET is_admin = FALSE, role = 'USER', status = 'BLOCKED'
        WHERE id = $1
        RETURNING email
      `;

            const result = await db.query(query, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'ADMIN_NOT_FOUND',
                });
            }

            res.json({
                success: true,
                message: 'Admin deactivated successfully',
            });
        } catch (error) {
            logger.error('Deactivate admin error:', error);
            next(error);
        }
    }

    // Helper methods



}

module.exports = new AdminAuthController();