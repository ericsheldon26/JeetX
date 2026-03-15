import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, StatusBar, ScrollView, Platform, Alert, ActivityIndicator, ToastAndroid, KeyboardAvoidingView, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import ScreenWrapper from '../../components/ScreenWrapper'; // Linux/NewArch Fix
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Linux/NewArch Fix

import RegisterSvg from '../../assets/register2.svg';
import { CONFIG, setTokens } from '../../api/config';
import { getFCMToken } from '../../utils/notificationHelper';
import { registerToken } from '../../api/notificationApi';
import { sendFirebaseOtp } from '../../api/firebaseApi';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale, hp } from '../../utils/responsive';

const LoginOTP = ({ navigation }: any) => {

    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [confirm, setConfirm] = useState<any>(null);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    // Countdown Timer for OTP
    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const showToast = (message: string) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert('', message);
        }
    };

    const sendMobileOtp = async () => {
        if (mobile.length !== 10) {
            showToast('Please enter a valid 10-digit mobile number');
            return;
        }
        setLoading(true);
        try {
            const phoneNumber = `+91${mobile}`;
            console.log('[LoginOTP.tsx] Sending OTP to:', phoneNumber);
            const confirmation = await sendFirebaseOtp(phoneNumber);
            setConfirm(confirmation);
            setOtpSent(true);
            setTimer(30);
            showToast('OTP Sent Successfully');
        } catch (error: any) {
            console.error('[LoginOTP.tsx] sendOTP Error:', error);
            if (error.code === 'auth/too-many-requests') {
                showToast('Too many requests. Please try again later.');
            } else {
                showToast(error.message || 'Failed to send OTP');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleMobileLogin = async () => {
        if (!mobile || !otp) {
            showToast('Please enter Mobile and OTP');
            return;
        }

        if (!confirm) {
            showToast('Please send OTP first');
            return;
        }

        setLoading(true);
        try {
            // Verify OTP with Firebase
            console.log('[LoginOTP.tsx] Verifying OTP with Firebase...');
            const result = await confirm.confirm(otp);
            console.log('[LoginOTP.tsx] Firebase Phone Auth Success:', result.user);
            const firebaseUid = result.user.uid;

            // Authenticate with Backend
            console.log('[LoginOTP.tsx] Authenticating with Backend URL:', `${CONFIG.BASE_URL}api/v1/auth/login/mobile`);

            const response = await fetch(`${CONFIG.BASE_URL}api/v1/auth/login/mobile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mobile: mobile,
                    country_code: "+91",
                    firebase_uid: firebaseUid
                })
            });

            const responseText = await response.text();
            console.log('[LoginOTP.tsx] Backend Raw Response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('[LoginOTP.tsx] JSON Parse Error:', e);
                showToast('Invalid Server Response');
                setLoading(false);
                return;
            }

            console.log('[LoginOTP.tsx] Parsed Response:', JSON.stringify(data, null, 2));

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
                    console.error('[LoginOTP.tsx] FCM Registration Error:', err);
                }

                showToast('Login Successful');
                navigation.navigate('Main');
            } else {
                showToast(data.message || 'Login Failed');
            }
        } catch (error) {
            console.error('[LoginOTP.tsx] Login/Verification Error:', error);
            showToast('Invalid OTP or Login Failed');
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
            {/* <View style={styles.container}> */} {/* Original code */}
            {/* <StatusBar translucent backgroundColor="transparent" barStyle="light-content" /> */} {/* Original code */}


            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(100) : 0}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: verticalScale(100) }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Top Header Image */}
                    <View style={[styles.headerImageContainer, { height: isKeyboardVisible ? hp(25) : hp(60) }]}>
                        <RegisterSvg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={styles.headerImage} />
                    </View>

                    {/* Bottom Sheet Content */}
                    <View style={styles.bottomSheet}>
                        <View style={styles.contentContainer}>
                            <View style={styles.sheetHeader}>
                                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                    <FontAwesome name="arrow-left" size={moderateScale(20)} color="#1e293b" />
                                </TouchableOpacity>

                                {!otpSent ? (
                                    <Text style={styles.headerTitle}>Login</Text>
                                ) : (
                                    <Text style={styles.headerTitle}></Text>
                                )}
                            </View>

                            {!otpSent ? (
                                <>
                                    <Text style={styles.screenTitle}>Login with Mobile</Text>

                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            placeholder="Enter Mobile number"
                                            placeholderTextColor="#94a3b8"
                                            style={styles.input}
                                            value={mobile}
                                            onChangeText={setMobile}
                                            keyboardType="phone-pad"
                                            maxLength={10}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        onPress={sendMobileOtp}
                                        style={styles.buttonWrapper}
                                        activeOpacity={0.8}
                                        disabled={loading}
                                    >
                                        <LinearGradient
                                            colors={['#ef4444', '#f97316']}
                                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                            style={styles.gradientButton}
                                        >
                                            {loading ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.btnText}>Send OTP</Text>}
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <View style={styles.signupRow}>
                                        <Text style={styles.signupLabel}>Don't have an account? </Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                            <Text style={styles.signupLink}>Sign Up</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.screenTitle}>Enter OTP</Text>
                                    <Text style={styles.subtitle}>Check your mobile for the OTP</Text>

                                    <View style={styles.otpContainer}>
                                        <TextInput
                                            style={styles.otpInput}
                                            value={otp}
                                            onChangeText={setOtp}
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            autoFocus
                                        />
                                        <View style={styles.otpBoxesContainer} pointerEvents="none">
                                            {[...Array(6)].map((_, i) => (
                                                <View key={i} style={[styles.otpBox, otp.length === i && styles.otpBoxActive]}>
                                                    <Text style={styles.otpText}>{otp[i] || ''}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                    <TextInput
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        style={styles.hiddenInput}
                                        autoFocus
                                    />

                                    <TouchableOpacity
                                        onPress={handleMobileLogin}
                                        style={styles.buttonWrapper}
                                        activeOpacity={0.8}
                                        disabled={loading}
                                    >
                                        <LinearGradient
                                            colors={['#ef4444', '#f97316']}
                                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                            style={styles.gradientButton}
                                        >
                                            {loading ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.btnText}>Send OTP</Text>}
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={timer > 0 ? undefined : sendMobileOtp} disabled={timer > 0} style={{ alignSelf: 'center', marginTop: verticalScale(15) }}>
                                        <Text style={{ color: timer > 0 ? '#94a3b8' : '#ef4444', fontWeight: '600', fontSize: moderateScale(14) }}>
                                            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                                        </Text>
                                    </TouchableOpacity>

                                    <View style={styles.signupRow}>
                                        <Text style={styles.signupLabel}>Don't have an account? </Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                            <Text style={styles.signupLink}>Sign Up</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            {/* </View> */} {/* Original code */}
        </ScreenWrapper>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a', // Dark background for the top part fallback
    },
    headerImageContainer: {
        height: hp(60),
        width: '100%',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        transform: [{ scale: 1.2 }], // Scale up to cover internal padding
    },
    bottomSheet: {
        minHeight: hp(50),
        backgroundColor: '#ffffff',
        borderTopLeftRadius: scale(30),
        borderTopRightRadius: scale(30),
        marginTop: verticalScale(-30), // Overlap effect
        overflow: 'hidden',
    },
    contentContainer: {
        padding: scale(24),
        paddingTop: verticalScale(30),
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    backButton: {
        marginRight: scale(15),
        padding: scale(5),
    },
    headerTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: '#1e293b',
        opacity: 0, // Hidden for now based on mockup which has larger title below
    },
    screenTitle: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: verticalScale(8),
        fontFamily: 'Montserrat-Bold',
    },
    subtitle: {
        fontSize: moderateScale(14),
        color: '#64748b',
        textAlign: 'center',
        marginBottom: verticalScale(30),
    },
    inputWrapper: {
        marginTop: verticalScale(20),
        marginBottom: verticalScale(20),
    },
    input: {
        backgroundColor: '#f1f5f9',
        borderRadius: scale(12),
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(18),
        fontSize: moderateScale(15),
        color: '#1e293b',
    },
    // OTP Styles
    otpContainer: {
        height: verticalScale(60),
        marginBottom: verticalScale(30),
        marginTop: verticalScale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    otpInput: {
        // We hide this input but keep it for layout if needed, but actually we rely on hiddenInput
        width: 0,
        height: 0,
    },
    hiddenInput: {
        position: 'absolute',
        width: '100%',
        height: verticalScale(60),
        opacity: 0,
        zIndex: 2, // Sits on top to receive touches
    },
    otpBoxesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: scale(10),
    },
    otpBox: {
        width: scale(45),
        height: verticalScale(50),
        borderRadius: scale(8),
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    otpBoxActive: {
        borderColor: '#f97316',
        backgroundColor: '#fff',
    },
    otpText: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: '#1e293b',
    },
    buttonWrapper: {
        width: '100%',
        marginTop: verticalScale(10),
        shadowColor: "#f97316",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    gradientButton: {
        height: verticalScale(56),
        borderRadius: scale(28),
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: '#ffffff',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(24),
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

export default LoginOTP;
