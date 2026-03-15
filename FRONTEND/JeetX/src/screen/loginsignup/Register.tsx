import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, StatusBar, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ToastAndroid, Modal, Keyboard } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import ScreenWrapper from '../../components/ScreenWrapper'; // Linux/NewArch Fix

import RegisterSvg from '../../assets/register2.svg';
import GoogleSvg from '../../assets/google.svg';
import { CONFIG, setTokens } from '../../api/config';
import { getFCMToken } from '../../utils/notificationHelper';
import { registerToken } from '../../api/notificationApi';

import { sendFirebaseOtp } from '../../api/firebaseApi';
import { googleLogin } from "../../config/authMethods";
import { scale, verticalScale, moderateScale, hp, wp } from '../../utils/responsive';


const Register = ({ navigation, route }: any) => {
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [isReferralValidated, setIsReferralValidated] = useState(false);

    useEffect(() => {
        if (route.params?.validatedCode && route.params?.isValid) {
            setReferralCode(route.params.validatedCode);
            setIsReferralValidated(true);
        }
    }, [route.params]);

    const [loading, setLoading] = useState(false);
    const [mobileOtpVisible, setMobileOtpVisible] = useState(false);
    const [emailOtpVisible, setEmailOtpVisible] = useState(false);

    const [mobileOtp, setMobileOtp] = useState('');
    const [emailOtp, setEmailOtp] = useState('');

    const [mobileVerified, setMobileVerified] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationId, setVerificationId] = useState('');
    const [firebaseUid, setFirebaseUid] = useState('');

    // Firebase Auth State
    const [confirm, setConfirm] = useState<any>(null);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // Password Validation State
    const [passwordInfo, setPasswordInfo] = useState('');
    const [passwordBorderColor, setPasswordBorderColor] = useState('transparent');



    const showToast = (message: string) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert('', message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const user = await googleLogin();
            console.log('Google Login Success:', user);
            navigation.navigate('Main');
        } catch (err: any) {
            console.error('Google Login Failed:', err);
            showToast('Google Login Failed');
        }
    };

    /* SSO handlers restored (Facebook removed) */
    const verifyMobileOtp = async () => {
        if (mobileOtp.length !== 6) {
            showToast('Please enter a valid 6-digit OTP');
            return;
        }

        if (!confirm) {
            showToast('Please send OTP first');
            return;
        }

        setLoading(true);
        try {
            const result = await confirm.confirm(mobileOtp);

            console.log('Firebase Phone Auth Success:', result.user);

            // Get ID Token if needed for backend
            const token = await result.user.getIdToken();
            setFirebaseUid(result.user.uid); // Save UID for registration

            showToast('Mobile Verified Successfully');
            setMobileVerified(true);
            setMobileOtpVisible(false);
        } catch (error) {
            console.error('Invalid Code', error);
            showToast('Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const sendMobileOtp = async () => {
        if (timer > 0) {
            showToast(`Please wait ${timer} seconds`);
            return;
        }

        const cleanMobile = mobile.trim();

        if (cleanMobile.length !== 10) {
            showToast('Invalid mobile number');
            return;
        }

        const phoneNumber = `+91${cleanMobile}`;
        setLoading(true);

        try {
            const confirmation = await sendFirebaseOtp(phoneNumber);
            setConfirm(confirmation);
            setMobileOtpVisible(true);
            showToast('OTP sent');
            setTimer(60); // Start 60s timer
        } catch (error: any) {
            console.log(error);
            if (error.code === 'auth/too-many-requests') {
                showToast('Too many requests. Please try again later.');
            } else {
                showToast(error.message);
            }
        } finally {
            setLoading(false);
        }
    };


    const verifyEmailOtp = async () => {
        if (emailOtp.length !== 6) {
            showToast('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${CONFIG.BASE_URL}api/v1/auth/verify-email-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    otp: emailOtp
                })
            });

            const responseText = await response.text();
            console.log('verifyEmailOtp URL:', `${CONFIG.BASE_URL}api/v1/auth/verify-email-otp`);
            console.log('verifyEmailOtp Raw Response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                showToast('Server returned an invalid response');
                return;
            }
            console.log('verifyEmailOtp Parsed Response:', data);

            if (data.success) {
                showToast(data.message || 'Email Verified Successfully');
                setEmailVerified(true);
                setEmailOtpVisible(false);
            } else {
                showToast(data.message || 'Invalid OTP');
            }
        } catch (error) {
            console.error(error);
            showToast('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    const sendEmailOtp = async () => {
        if (!email) {
            showToast('Please enter an email address');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${CONFIG.BASE_URL}api/v1/auth/send-email-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            });

            const responseText = await response.text();
            console.log('sendEmailOtp URL:', `${CONFIG.BASE_URL}api/v1/auth/send-email-otp`);
            console.log('sendEmailOtp Raw Response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                showToast('Server returned an invalid response');
                return;
            }
            console.log('sendEmailOtp Parsed Response:', data);

            if (data.success) {
                showToast(data.message || 'OTP sent successfully to your email');
                setEmailOtpVisible(true);
            } else {
                showToast(data.message || 'Failed to send OTP to email');
            }
        } catch (error) {
            console.error(error);
            showToast('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    const validatePassword = async (text: string) => {
        setPassword(text); // Update state here

        if (text.length === 0) {
            setPasswordInfo('');
            setPasswordBorderColor('transparent');
            return;
        }

        try {
            const response = await fetch(`${CONFIG.BASE_URL}api/v1/auth/validate-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: text
                })
            });

            const data = await response.json();
            // console.log('validatePassword URL:', `${CONFIG.BASE_URL}api/v1/auth/validate-password`);
            // console.log('validatePassword Response:', data);

            if (data.success) {
                if (data.valid === false) {
                    setPasswordBorderColor(data.ui_hint?.border_color === 'RED' ? '#ef4444' : '#10b981');
                    setPasswordInfo(data.ui_hint?.info_message || '');
                } else {
                    setPasswordBorderColor('#10b981');
                    setPasswordInfo('');
                }
            }
        } catch (error) {
            console.error('Password validation error:', error);
        }
    };

    const handleRegister = async () => {
        // Basic Validation
        if (!fullName || !mobile || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match');
            return;
        }
        if (!mobileVerified) {
            showToast('Please verify your mobile number');
            return;
        }
        if (!emailVerified) {
            showToast('Please verify your email');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${CONFIG.BASE_URL}api/v1/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: fullName,
                    mobile: mobile,
                    country_code: "+91",
                    email: email,
                    password: password,
                    confirm_password: confirmPassword,
                    referral_code: isReferralValidated ? referralCode : null, // Only send if validated
                    firebase_uid: firebaseUid
                })
            });

            const responseText = await response.text();
            console.log('handleRegister URL:', `${CONFIG.BASE_URL}api/v1/auth/register`);
            console.log('handleRegister Raw Response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                showToast('Server returned an invalid response');
                return;
            }
            console.log('handleRegister Parsed Response:', data);

            if (data.success) {
                if (data.tokens) {
                    setTokens(data.tokens.access_token, data.tokens.refresh_token);
                }

                // Register FCM Token for Push Notifications
                try {
                    const fcmToken = await getFCMToken();
                    if (fcmToken) {
                        await registerToken(fcmToken, Platform.OS as 'android' | 'ios');
                    }
                } catch (err) {
                    console.error('[Register.tsx] FCM Registration Error:', err);
                }

                showToast('User registered successfully');
                navigation.navigate('Main');
            } else {
                showToast(data.message || 'Unknown error occurred');
            }
        } catch (error) {
            console.error(error);
            showToast('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper 
          style={styles.container}
          statusBarColor="transparent"
          statusBarStyle="light-content"
          backgroundColor="#0f172a"
        >
            {/* <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}> */} {/* Original code */}
            {/* <StatusBar barStyle="light-content" backgroundColor="transparent" translucent /> */} {/* Original code */}



            {/* Top Background Illustration - Dynamic Height */}
            <View style={[styles.topContainer, { height: isKeyboardVisible ? hp(8) : hp(35) }]}>
                <LinearGradient
                    colors={['#0f172a', '#1e293b']}
                    style={styles.illustrationBg}
                >
                    <RegisterSvg
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidXMid meet"
                        style={{ transform: [{ scale: 1.3 }] }}
                    />
                </LinearGradient>
            </View>

            {/* Bottom Form Card */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.bottomCard}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        scrollEnabled={isKeyboardVisible} // Only scroll when keyboard is up or if content overflows (usually true with keyboard)
                        bounces={false}
                    >
                        <Text style={styles.title}>Create Account</Text>

                        {/* Full Name */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Full Name"
                                placeholderTextColor="#94a3b8"
                                style={styles.input}
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>

                        {/* Mobile + Send OTP */}
                        <View style={styles.inputContainerRow}>
                            <TextInput
                                placeholder="Mobile Number"
                                placeholderTextColor="#94a3b8"
                                style={styles.inputFlex}
                                keyboardType="phone-pad"
                                editable={!mobileVerified}
                                value={mobile}
                                onChangeText={setMobile}
                            />

                            {!mobileVerified && (
                                <TouchableOpacity
                                    onPress={sendMobileOtp}
                                    disabled={loading || timer > 0}
                                    style={styles.otpButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#ef4444" />
                                    ) : (
                                        <Text style={styles.otpBtnText}>
                                            {timer > 0 ? `Retry in ${timer}s` : 'Send OTP'}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            )}

                        </View>

                        {/* Mobile OTP Input */}
                        {mobileOtpVisible && (
                            <View>
                                <View style={styles.inputContainerRow}>
                                    <TextInput
                                        placeholder="Enter 6-digit OTP"
                                        placeholderTextColor="#94a3b8"
                                        style={styles.inputFlex}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        value={mobileOtp}
                                        editable={!mobileVerified}
                                        onChangeText={(text) => {
                                            setMobileOtp(text);
                                            if (text.length === 6 && !mobileVerified) verifyMobileOtp();
                                        }}
                                    />
                                    {mobileVerified ? (
                                        <FontAwesome name="check-circle" size={moderateScale(20)} color="#10b981" />
                                    ) : (
                                        mobileOtp.length === 6 && (
                                            <TouchableOpacity onPress={verifyMobileOtp}>
                                                <Text style={styles.otpBtnText}>Verify</Text>
                                            </TouchableOpacity>
                                        )
                                    )}
                                </View>
                                {!mobileVerified && (
                                    <TouchableOpacity onPress={sendMobileOtp} disabled={loading || timer > 0} style={{ alignSelf: 'flex-end', marginTop: 4, marginRight: 4 }}>
                                        <Text style={{ color: timer > 0 ? '#94a3b8' : '#f97316', fontSize: moderateScale(12), fontWeight: '600' }}>
                                            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}


                        {/* Email + Send OTP */}
                        <View style={styles.inputContainerRow}>
                            <TextInput
                                placeholder="Email Address"
                                placeholderTextColor="#94a3b8"
                                style={styles.inputFlex}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!emailVerified}
                                value={email}
                                onChangeText={setEmail}
                            />

                            {!emailVerified && (
                                <TouchableOpacity
                                    onPress={sendEmailOtp}
                                    disabled={loading}
                                    style={styles.otpButton}
                                >
                                    <Text style={styles.otpBtnText}>{loading ? 'Sending...' : 'Send OTP'}</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Email OTP Input */}
                        {emailOtpVisible && (
                            <View>
                                <View style={styles.inputContainerRow}>
                                    <TextInput
                                        placeholder="Enter 6-digit OTP"
                                        placeholderTextColor="#94a3b8"
                                        style={styles.inputFlex}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        value={emailOtp}
                                        editable={!emailVerified}
                                        onChangeText={(text) => {
                                            setEmailOtp(text);
                                            if (text.length === 6 && !emailVerified) verifyEmailOtp();
                                        }}
                                    />
                                    {emailVerified ? (
                                        <FontAwesome name="check-circle" size={moderateScale(20)} color="#10b981" />
                                    ) : (
                                        emailOtp.length === 6 && (
                                            <TouchableOpacity onPress={verifyEmailOtp}>
                                                <Text style={styles.otpBtnText}>Verify</Text>
                                            </TouchableOpacity>
                                        )
                                    )}
                                </View>
                                {!emailVerified && (
                                    <TouchableOpacity onPress={sendEmailOtp} disabled={loading} style={{ alignSelf: 'flex-end', marginTop: 4, marginRight: 4 }}>
                                        <Text style={{ color: '#f97316', fontSize: moderateScale(12), fontWeight: '600' }}>Resend OTP</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        <View style={[styles.inputContainerRow, { borderColor: passwordBorderColor, borderWidth: passwordBorderColor !== 'transparent' ? 1 : 0 }]}>
                            <TextInput
                                placeholder="Create Password"
                                placeholderTextColor="#94a3b8"
                                style={styles.inputFlex}
                                secureTextEntry
                                value={password}
                                onChangeText={validatePassword}
                            />
                            <FontAwesome name="eye-slash" size={moderateScale(20)} color="#94a3b8" />
                        </View>
                        {/* Password Info Message */}
                        {passwordInfo ? (
                            <Text style={{ color: passwordBorderColor, fontSize: moderateScale(12), marginBottom: verticalScale(12), marginLeft: scale(4) }}>
                                {passwordInfo}
                            </Text>
                        ) : null}

                        {/* Confirm Password */}
                        <View style={styles.inputContainerRow}>
                            <TextInput
                                placeholder="Confirm Password"
                                placeholderTextColor="#94a3b8"
                                style={styles.inputFlex}
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <FontAwesome name="eye-slash" size={moderateScale(20)} color="#94a3b8" />
                        </View>

                        {/* Invite Code Link */}
                        {/* Invite Code Link */}
                        <TouchableOpacity
                            style={styles.inviteLink}
                            onPress={() => navigation.navigate('ReferralInput')}
                        >
                            <Text style={styles.inviteText}>
                                {isReferralValidated ? `Referral Code: ${referralCode} (Applied)` : 'Enter Invite Code?'}
                            </Text>
                            {isReferralValidated && <FontAwesome name="check-circle" size={moderateScale(16)} color="#10b981" style={{ marginLeft: scale(8) }} />}
                        </TouchableOpacity>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            onPress={handleRegister}
                            style={styles.buttonWrapper}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#ef4444', '#f97316']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={styles.gradientBtn}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.btnText}>Sign Up</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.loginRow}>
                            <Text style={styles.loginLabel}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Social Options Header */}
                        <Text style={styles.orText}>Or sign up with</Text>

                        {/* Social Row */}
                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialIcon} onPress={handleGoogleLogin}>
                                <GoogleSvg width={scale(24)} height={scale(24)} />
                            </TouchableOpacity>
                        </View>

                        {/* BYPASS REGISTRATION - DEVELOPMENT ONLY */}
                        <TouchableOpacity 
                            style={[styles.socialButton, { marginTop: verticalScale(10), borderColor: '#ef4444', backgroundColor: '#fef2f2', borderWidth: 1, borderRadius: scale(24), paddingVertical: verticalScale(12), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '80%' }]} 
                            onPress={() => {
                                console.log('[Register.tsx] BYPASS REGISTRATION pressed');
                                showToast('Bypassing Registration...');
                                navigation.navigate('Main');
                            }}
                        >
                            <FontAwesome name="shield" size={moderateScale(20)} color="#ef4444" />
                            <Text style={{ color: '#ef4444', marginLeft: scale(12), fontSize: moderateScale(15), fontWeight: '600' }}>BYPASS SIGNUP (DEV)</Text>
                        </TouchableOpacity>
                    </ScrollView>

                </View>
            </KeyboardAvoidingView>
            {/* </SafeAreaView> */} {/* Original code */}
        </ScreenWrapper>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    topContainer: {
        height: hp(35), // Responsive height
        width: '100%',
    },
    illustrationBg: {
        flex: 1,
    },
    illustration: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    bottomCard: {
        flex: 1,
        marginTop: verticalScale(-40),
        backgroundColor: '#ffffff',
        borderTopLeftRadius: scale(32),
        borderTopRightRadius: scale(32),
        overflow: 'hidden',
    },
    scrollContent: {
        paddingHorizontal: wp(8), // Responsive padding
        paddingTop: verticalScale(32),
        paddingBottom: verticalScale(40),
    },
    title: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: verticalScale(24),
        fontFamily: 'Montserrat-Bold',
    },
    inputContainer: {
        marginBottom: verticalScale(16),
        backgroundColor: '#f1f5f9',
        borderRadius: scale(12),
        padding: scale(4),
    },
    inputContainerRow: {
        marginBottom: verticalScale(16),
        backgroundColor: '#f1f5f9',
        borderRadius: scale(12),
        paddingHorizontal: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        height: verticalScale(52),
    },
    input: {
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(14),
        fontSize: moderateScale(14),
        color: '#1e293b',
    },
    inputFlex: {
        flex: 1,
        fontSize: moderateScale(14),
        color: '#1e293b',
        height: '100%',
    },
    otpBtnText: {
        color: '#f97316',
        fontWeight: 'bold',
        fontSize: moderateScale(13),
    },
    otpButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: scale(8),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
    },
    inviteLink: {
        alignSelf: 'center',
        marginBottom: verticalScale(24),
    },
    inviteText: {
        color: '#3b82f6', // Blue color
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    buttonWrapper: {
        width: '100%',
        marginBottom: verticalScale(20),
        shadowColor: "#ef3c00",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    gradientBtn: {
        height: verticalScale(52),
        borderRadius: scale(26),
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: '#ffffff',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginLabel: {
        color: '#94a3b8',
        fontSize: moderateScale(14),
    },
    loginLink: {
        color: '#ef4444',
        fontSize: moderateScale(14),
        fontWeight: 'bold',
    },
    orText: {
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: moderateScale(13),
        marginTop: verticalScale(24),
        marginBottom: verticalScale(16),
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: scale(20),
        marginBottom: verticalScale(30),
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
    socialIcon: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(24),
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: scale(20)
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: scale(24),
        padding: scale(24),
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: verticalScale(8)
    },
    modalSubtitle: {
        fontSize: moderateScale(14),
        color: '#64748b',
        textAlign: 'center',
        marginBottom: verticalScale(24)
    },
    modalInputContainer: {
        width: '100%',
        backgroundColor: '#f1f5f9',
        borderRadius: scale(12),
        paddingHorizontal: scale(16),
        height: verticalScale(52),
        marginBottom: verticalScale(20),
        justifyContent: 'center'
    },
    modalInput: {
        fontSize: moderateScale(16),
        color: '#1e293b',
        fontWeight: '600'
    },
    modalBtnPrimary: {
        width: '100%',
        height: verticalScale(52),
        backgroundColor: '#ef4444',
        borderRadius: scale(26),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(12)
    },
    modalBtnSecondary: {
        padding: verticalScale(12),
    },
    secondaryBtnText: {
        color: '#64748b',
        fontWeight: '600',
        fontSize: moderateScale(14)
    }
});

export default Register;
