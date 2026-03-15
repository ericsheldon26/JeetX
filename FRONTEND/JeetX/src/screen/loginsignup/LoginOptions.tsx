import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Platform, Alert, ToastAndroid } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import ScreenWrapper from '../../components/ScreenWrapper'; // Linux/NewArch Fix

import JeetXSmall from '../../assets/Jeetxsmall.svg';
import { googleLogin, facebookLogin } from "../../config/authMethods";
import { CONFIG, setTokens, setGoogleUser } from '../../api/config';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';
import { getFCMToken } from '../../utils/notificationHelper';
import { registerToken, removeToken } from '../../api/notificationApi';

const LoginOptions = ({ navigation }: any) => {

    const showToast = (message: string) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert('', message);
        }
    };

    const handleGoogleLogin = async () => {
        console.log('[LoginOptions.tsx] handleGoogleLogin() called');
        try {
            const user = await googleLogin();
            console.log('[LoginOptions.tsx] Google Login Success. User:', JSON.stringify(user, null, 2));
            setGoogleUser(user);

            if (user && user.email) {
                // Perform backend login with email and placeholder password as requested
                console.log('[LoginOptions.tsx] Authenticating with Backend URL:', `${CONFIG.BASE_URL}api/v1/auth/login/email`);

                const payload = {
                    email: user.email,
                    password: "firebaseRandomPassword" // Placeholder as per user request for "random user password" flow
                };
                console.log('[LoginOptions.tsx] SSO Login Payload:', JSON.stringify(payload, null, 2));

                const response = await fetch(`${CONFIG.BASE_URL}api/v1/auth/login/email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const responseText = await response.text();
                console.log('[LoginOptions.tsx] Backend Raw Response:', responseText);

                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    console.error('[LoginOptions.tsx] JSON Parse Error:', e);
                    showToast('Invalid Server Response');
                    return;
                }

                console.log('[LoginOptions.tsx] Parsed Response:', JSON.stringify(data, null, 2));

                if (data.success) {
                    if (data.tokens) {
                        setTokens(data.tokens.access_token, data.tokens.refresh_token);
                    }

                    // Register FCM Token for Push Notifications
                    try {
                        const fcmToken = await getFCMToken();
                        if (fcmToken) {
                            // Call remove token first to clear old session if any, then register
                            await removeToken(fcmToken);
                            await registerToken(fcmToken, Platform.OS as 'android' | 'ios');
                        }
                    } catch (err) {
                        console.error('[LoginOptions.tsx] FCM Token Management Error:', err);
                    }

                    showToast('Login Successful');
                    navigation.navigate('Main');
                } else {
                    showToast(data.message || 'Login Failed');
                }
            } else {
                showToast('Google Login Error: No email found');
            }

        } catch (err: any) {
            console.error('[LoginOptions.tsx] Google Login Failed:', err);
            showToast('Google Login Failed: ' + (err.message || 'Unknown Error'));
        }
    };

    const handleFacebookLogin = async () => {
        console.log('[LoginOptions.tsx] handleFacebookLogin() called');
        try {
            const user = await facebookLogin();
            console.log('[LoginOptions.tsx] Facebook Login Success. User:', JSON.stringify(user, null, 2));

            // Register FCM Token for Push Notifications
            try {
                const fcmToken = await getFCMToken();
                if (fcmToken) {
                    await removeToken(fcmToken);
                    await registerToken(fcmToken, Platform.OS as 'android' | 'ios');
                }
            } catch (err) {
                console.error('[LoginOptions.tsx] FCM Token Management Error:', err);
            }

            navigation.navigate('Main');
        } catch (err: any) {
            console.error('[LoginOptions.tsx] Facebook Login Failed:', err);
            showToast('Facebook Login Failed: ' + (err.message || 'Unknown Error'));
        }
    };

    return (
        <ScreenWrapper 
          style={styles.container}
          statusBarColor="#ffffff"
          statusBarStyle="dark-content"
          backgroundColor="#ffffff"
        >
            {/* <SafeAreaView style={styles.container}> */} {/* Original code */}
            {/* <StatusBar barStyle="dark-content" backgroundColor="#ffffff" /> */} {/* Original code */}


            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <JeetXSmall width={scale(100)} height={scale(100)} style={styles.logo} />
                    <Text style={styles.title}>Login</Text>
                </View>

                <View style={styles.form}>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('LoginOTP')}
                        style={styles.methodButton}
                    >
                        <Text style={styles.methodButtonText}>Login with OTP</Text>
                        <FontAwesome name="chevron-right" size={moderateScale(16)} color="#64748b" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('LoginPassword')}
                        style={styles.methodButton}
                    >
                        <Text style={styles.methodButtonText}>Login with Username & Password</Text>
                        <FontAwesome name="chevron-right" size={moderateScale(16)} color="#64748b" />
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.line} />
                    </View>

                    <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                        <FontAwesome name="google" size={moderateScale(20)} color="#DB4437" />
                        <Text style={styles.socialText}>Login with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
                        <FontAwesome name="facebook" size={moderateScale(20)} color="#4267B2" />
                        <Text style={styles.socialText}>Login with Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.forgotText}>Forgot Password ?</Text>
                    </TouchableOpacity>

                    <View style={styles.signupRow}>
                        <Text style={styles.signupLabel}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            console.log('[LoginOptions.tsx] BYPASS LOGIN pressed');
                            showToast('Bypassing Login...');
                            navigation.navigate('Main');
                        }}
                        style={styles.bypassButton}
                    >
                        <FontAwesome name="shield" size={moderateScale(20)} color="#ef4444" />
                        <Text style={styles.bypassText}>BYPASS LOGIN (DEV)</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {/* </SafeAreaView > */} {/* Original code */}
        </ScreenWrapper>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: scale(24),
        paddingTop: verticalScale(40),
        paddingBottom: verticalScale(40),
    },
    header: {
        alignItems: 'center',
        marginBottom: verticalScale(40),
    },
    logo: {
        width: scale(100),
        height: scale(100),
        marginBottom: verticalScale(10),
    },
    title: {
        fontSize: moderateScale(28),
        fontWeight: 'bold',
        color: '#1e293b',
        fontFamily: 'Montserrat-Bold',
    },
    form: {
        width: '100%',
    },
    methodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: scale(12),
        paddingVertical: verticalScale(18),
        paddingHorizontal: scale(20),
        marginBottom: verticalScale(16),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    methodButtonText: {
        fontSize: moderateScale(15),
        color: '#334155',
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: verticalScale(24),
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        marginHorizontal: scale(16),
        color: '#94a3b8',
        fontSize: moderateScale(14),
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: scale(12),
        paddingVertical: verticalScale(14),
        justifyContent: 'center',
        marginBottom: verticalScale(16),
    },
    socialText: {
        marginLeft: scale(12),
        fontSize: moderateScale(15),
        color: '#334155',
        fontWeight: '600',
    },
    forgotBtn: {
        alignItems: 'center',
        marginVertical: verticalScale(10),
        marginBottom: verticalScale(20),
    },
    forgotText: {
        color: '#64748b',
        fontSize: moderateScale(14),
        fontWeight: '500',
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(10),
    },
    signupLabel: {
        color: '#94a3b8',
        fontSize: moderateScale(14),
    },
    signupLink: {
        color: '#ef4444',
        fontSize: moderateScale(14),
        fontWeight: 'bold',
    },
    bypassButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#ef4444',
        borderRadius: scale(12),
        paddingVertical: verticalScale(14),
        marginTop: verticalScale(20),
    },
    bypassText: {
        color: '#ef4444',
        marginLeft: scale(12),
        fontSize: moderateScale(15),
        fontWeight: '600',
    },
});

export default LoginOptions;
