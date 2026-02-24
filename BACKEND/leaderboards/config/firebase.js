
const admin = require('firebase-admin');
const logger = require('@/utils/logger');

// Validate required environment variables
const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    logger.error(`Missing required Firebase environment variables: ${missingEnvVars.join(', ')}`);
    throw new Error('Firebase configuration incomplete');
}

// Parse private key (handle escaped newlines)
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

// Service account configuration
const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

// Initialize Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
    });

    // logger.info('✓ Firebase Admin SDK initialized successfully');
    // logger.info(`✓ Firebase Project: ${process.env.FIREBASE_PROJECT_ID}`);
} catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK:', error);
    throw error;
}

/**
 * Get Firebase Auth instance
 */
const getAuth = () => {
    return admin.auth();
};

/**
 * Get Firebase Firestore instance (if needed)
 */
const getFirestore = () => {
    return admin.firestore();
};

/**
 * Get Firebase Storage instance (if needed)
 */
const getStorage = () => {
    return admin.storage();
};

/**
 * Verify Firebase ID token
 * @param {string} idToken 
 * @returns {Promise<Object>} Decoded token
 */
const verifyIdToken = async (idToken) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        logger.debug(`Token verified for user: ${decodedToken.uid}`);
        return decodedToken;
    } catch (error) {
        logger.error('Token verification failed:', error);
        throw error;
    }
};

/**
 * Create custom token
 * @param {string} uid 
 * @param {Object} additionalClaims 
 * @returns {Promise<string>}
 */
const createCustomToken = async (uid, additionalClaims = {}) => {
    try {
        const customToken = await admin.auth().createCustomToken(uid, additionalClaims);
        logger.debug(`Custom token created for user: ${uid}`);
        return customToken;
    } catch (error) {
        logger.error('Custom token creation failed:', error);
        throw error;
    }
};

/**
 * Get user by UID
 * @param {string} uid 
 * @returns {Promise<Object>}
 */
const getUserByUid = async (uid) => {
    try {
        const userRecord = await admin.auth().getUser(uid);
        return userRecord;
    } catch (error) {
        logger.error(`Failed to get user by UID ${uid}:`, error);
        throw error;
    }
};

/**
 * Get user by email
 * @param {string} email 
 * @returns {Promise<Object>}
 */
const getUserByEmail = async (email) => {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        return userRecord;
    } catch (error) {
        logger.error(`Failed to get user by email ${email}:`, error);
        throw error;
    }
};

/**
 * Get user by phone number
 * @param {string} phoneNumber 
 * @returns {Promise<Object>}
 */
const getUserByPhone = async (phoneNumber) => {
    try {
        const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
        return userRecord;
    } catch (error) {
        logger.error(`Failed to get user by phone ${phoneNumber}:`, error);
        throw error;
    }
};

/**
 * Delete user
 * @param {string} uid 
 */
const deleteUser = async (uid) => {
    try {
        await admin.auth().deleteUser(uid);
        logger.info(`User deleted: ${uid}`);
    } catch (error) {
        logger.error(`Failed to delete user ${uid}:`, error);
        throw error;
    }
};

/**
 * Update user
 * @param {string} uid 
 * @param {Object} properties 
 */
const updateUser = async (uid, properties) => {
    try {
        const userRecord = await admin.auth().updateUser(uid, properties);
        logger.info(`User updated: ${uid}`);
        return userRecord;
    } catch (error) {
        logger.error(`Failed to update user ${uid}:`, error);
        throw error;
    }
};

/**
 * Set custom user claims
 * @param {string} uid 
 * @param {Object} customClaims 
 */
const setCustomClaims = async (uid, customClaims) => {
    try {
        await admin.auth().setCustomUserClaims(uid, customClaims);
        logger.info(`Custom claims set for user: ${uid}`);
    } catch (error) {
        logger.error(`Failed to set custom claims for ${uid}:`, error);
        throw error;
    }
};

/**
 * Health check
 * @returns {Promise<boolean>}
 */
const healthCheck = async () => {
    try {
        // Try to list users (limit 1) as a health check
        await admin.auth().listUsers(1);
        return true;
    } catch (error) {
        logger.error('Firebase health check failed:', error);
        return false;
    }
};

module.exports = {
    admin,
    getAuth,
    getFirestore,
    getStorage,
    verifyIdToken,
    createCustomToken,
    getUserByUid,
    getUserByEmail,
    getUserByPhone,
    deleteUser,
    updateUser,
    setCustomClaims,
    healthCheck,
};