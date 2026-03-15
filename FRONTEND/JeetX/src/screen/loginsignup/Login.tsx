import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, StatusBar, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ToastAndroid } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import ScreenWrapper from '../../components/ScreenWrapper'; // Linux/NewArch Fix

import JeetxsmallSvg from '../../assets/Jeetxsmall.svg';
import { CONFIG, setTokens, setGoogleUser } from '../../api/config';
import { googleLogin, facebookLogin } from "../../config/authMethods";

const Login = ({ navigation }: any) => {

    // Email / Mobile State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secure, setSecure] = useState(true);

    const [loading, setLoading] = useState(false);

    const showToast = (message: string) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert('', message);
        }
    };
    const handleGoogleLogin = async () => {
        console.log('[Login.tsx] handleGoogleLogin() called');
        try {
            const user = await googleLogin();
            console.log('[Login.tsx] Google Login Success. User:', JSON.stringify(user, null, 2));
            setGoogleUser(user);
            // Send user.uid or token to backend to link with your database
            navigation.navigate('Main'); // navigate to main/home screen
        } catch (err: any) {
            console.error('[Login.tsx] Google Login Failed:', err);
            showToast('Google Login Failed: ' + (err.message || 'Unknown Error'));
        }
    };

    const handleFacebookLogin = async () => {
        console.log('[Login.tsx] handleFacebookLogin() called');
        try {
            const user = await facebookLogin();
            console.log('[Login.tsx] Facebook Login Success. User:', JSON.stringify(user, null, 2));
            navigation.navigate('Main');
        } catch (err: any) {
            console.error('[Login.tsx] Facebook Login Failed:', err);
            showToast('Facebook Login Failed: ' + (err.message || 'Unknown Error'));
        }
    };

    const handleEmailLogin = async () => {
        if (!email || !password) {
            showToast('Please enter email/mobile and password');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${CONFIG.BASE_URL}api/v1/auth/login/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const responseText = await response.text();
            let data;
            try { data = JSON.parse(responseText); } catch (e) {
                console.error('JSON Parse Error:', e);
                showToast('Invalid Server Response');
                setLoading(false);
                return;
            }

            if (data.success) {
                if (data.tokens) {
                    setTokens(data.tokens.access_token, data.tokens.refresh_token);
                }
                showToast('Login Successful');
                navigation.navigate('Main');
            } else {
                showToast(data.message || 'Login Failed');
            }
        } catch (error) {
            console.error(error);
            showToast('Something went wrong');
        } finally {
            setLoading(false);
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
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <JeetxsmallSvg width={80} height={80} style={{ marginBottom: 16 }} />
                        <Text style={styles.title}>Login</Text>
                    </View>

                    <View style={styles.form}>
                        {/* Email / Mobile Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Email / Mobile"
                                placeholderTextColor="#94a3b8"
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#94a3b8"
                                style={styles.input}
                                secureTextEntry={secure}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeIcon}>
                                <FontAwesome name={secure ? "eye-slash" : "eye"} size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.forgotText}>Forgot Password ?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleEmailLogin}
                            style={styles.buttonWrapper}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#ef4444', '#f97316']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={styles.loginButton}
                            >
                                {loading ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.loginBtnText}>LOGIN</Text>}
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.signupRow}>
                            <Text style={styles.signupLabel}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.signupLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.line} />
                        </View>

                        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                            <FontAwesome name="google" size={20} color="#DB4437" />
                            <Text style={styles.socialText}>Login with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
                            <FontAwesome name="facebook" size={20} color="#4267B2" />
                            <Text style={styles.socialText}>Login with Facebook</Text>
                        </TouchableOpacity>

                        {/* BYPASS LOGIN - DEVELOPMENT ONLY */}
                        <TouchableOpacity 
                            style={[styles.socialButton, { marginTop: 20, borderColor: '#ef4444', backgroundColor: '#fef2f2' }]} 
                            onPress={() => {
                                console.log('[Login.tsx] BYPASS LOGIN pressed');
                                showToast('Bypassing Login...');
                                navigation.navigate('Main');
                            }}
                        >
                            <FontAwesome name="shield" size={20} color="#ef4444" />
                            <Text style={[styles.socialText, { color: '#ef4444' }]}>BYPASS LOGIN (DEV)</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
            {/* </SafeAreaView> */} {/* Original code */}
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
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        fontFamily: 'Montserrat-Bold',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 16,
        position: 'relative',
    },
    input: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 15,
        color: '#1e293b',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 18,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#94a3b8',
        fontSize: 14,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingVertical: 14,
        justifyContent: 'center',
        marginBottom: 16,
    },
    socialText: {
        marginLeft: 12,
        fontSize: 15,
        color: '#334155',
        fontWeight: '600',
    },
    forgotBtn: {
        alignItems: 'center',
        marginVertical: 10,
        marginBottom: 20,
    },
    forgotText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '500',
    },
    buttonWrapper: {
        width: '100%',
        marginBottom: 10,
        shadowColor: "#ef3c00",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    loginButton: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    signupLabel: {
        color: '#94a3b8',
        fontSize: 14,
    },
    signupLink: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Login;
