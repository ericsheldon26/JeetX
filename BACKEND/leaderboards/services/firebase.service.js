
// ==========================================
// src/services/firebase.service.js
// ==========================================
const { admin } = require('../config/firebase');

class FirebaseService {
    async sendMobileOTP(phoneNumber) {
        // Note: This is a simplified version
        // In production, you'd use Firebase Authentication's phone auth
        // with proper verification ID management
        try {
            // Firebase phone auth requires client-side implementation
            // This is a placeholder for the backend flow
            return {
                success: true,
                verificationId: `verify_${Date.now()}`,
            };
        } catch (error) {
            throw new Error(`Failed to send OTP: ${error.message}`);
        }
    }

    async verifyMobileOTP(verificationId, code) {
        try {
            // In production, verify with Firebase
            // This is a simplified version
            return {
                valid: true,
                uid: `firebase_uid_${Date.now()}`,
            };
        } catch (error) {
            throw new Error(`Failed to verify OTP: ${error.message}`);
        }
    }

    async createUserWithEmailPassword(email, password, phoneNumber) {

        try {
            const userRecord = await admin.auth().getUserByEmail(email);
            if (userRecord) {
                return userRecord;
            }
        }
        catch (err) {
            const newUserRecord = await admin.auth().createUser({
                email,
                password,
                phoneNumber,
                emailVerified: false
            });
            return newUserRecord;
        }

    }

    async signInWithEmail(email, password) {
        try {
            // Get user by email
            const userRecord = await admin.auth().getUserByEmail(email);

            // Note: Password verification should be done client-side
            // This is for server-side validation
            return userRecord;
        } catch (error) {
            throw new Error(`Failed to sign in: ${error.message}`);
        }
    }
    async signInWithNumber(number) {
        try {
            // Get user by email
            const userRecord = await admin.auth().getUserByPhoneNumber(number);
            // Note: Password verification should be done client-side
            // This is for server-side validation
            return userRecord;
        } catch (error) {
            throw new Error(`Failed to sign in: ${error.message}`);
        }
    }

    async sendPasswordResetEmail(email) {
        try {
            const link = await admin.auth().generatePasswordResetLink(email);
            return { link };
        } catch (error) {
            throw new Error(`Failed to send password reset: ${error.message}`);
        }
    }

    async verifyIdToken(token) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            return decodedToken;
        } catch (error) {
            throw new Error(`Failed to verify token: ${error.message}`);
        }
    }

    async updateUserPassword(uid, newPassword) {
        try {
            await admin.auth().updateUser(uid, {
                password: newPassword,
            });
            return { success: true };
        } catch (error) {
            throw new Error(`Failed to update password: ${error.message}`);
        }
    }
    async deleteUser(email) {
        try {
            // const userRecord = await admin.auth().getUserByEmail(email);
            // console.log("userRecord", userRecord);
            // await admin.auth().deleteUser(userRecord.uid);
            const userList = await admin.auth().listUsers(300);

            return { success: true, userList: userList };
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}

module.exports = new FirebaseService();

