import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, Dimensions, ActivityIndicator, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Linux/NewArch Fix
import ScreenWrapper from '../../components/ScreenWrapper'; // Linux/NewArch Fix



import RegisterSvg from '../../assets/register2.svg';
import JeetXLogo from '../../assets/Jeetxsmall.svg';
import { loadTokens } from '../../api/config';
const { width, height } = Dimensions.get('window');
const Splash = ({ navigation }: any) => {
    // const fadeAnim = React.useRef(new Animated.Value(0)).current; // Original code
    // const insets = useSafeAreaInsets(); // Linux/NewArch Fix (Previous manual fix)
    const fadeAnim = React.useRef(new Animated.Value(0)).current;




    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        /* <SafeAreaView style={styles.container}> */ // Original code
        /* <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}> */ // Previous manual fix
        <ScreenWrapper style={styles.container}>
            {/* <StatusBar barStyle="light-content" backgroundColor="transparent" translucent /> */}


            {/* Top Illustration Section */}
            <View style={styles.topContainer}>
                {/* Utilising Gradient/Image to match the dark illustration style */}
                <LinearGradient
                    colors={['#0f172a', '#1e293b']}
                    style={styles.illustrationBg}
                >
                    <RegisterSvg
                        width={width}
                        height={height * 0.55}
                        preserveAspectRatio="xMidYMid meet"
                        style={{ transform: [{ scale: 1.10 }] }}
                    />
                </LinearGradient>
            </View>

            {/* Bottom White Card */}
            <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
                <JeetXLogo width={80} height={80} style={styles.logo} />

                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtext}>Play, Compete & Win - Your Journey to Rewards Starts Here!</Text>

                {/* Register Button */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    style={styles.buttonWrapper}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#ff8b26', '#ef3c00']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.gradientBtn}
                    >
                        <Text style={styles.btnText}>REGISTER</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Login Link */}
                <View style={styles.linkRow}>
                    <Text style={styles.linkText}>Already a user? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.linkHighlight}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </ScreenWrapper>
        /* </View> */ // Previous manual fix
        /* </SafeAreaView> */ // Original code
    );

};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a', // Match top bg color
    },
    topContainer: {
        flex: 0.55,
        width: '100%',
    },
    illustrationBg: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    bottomContainer: {
        flex: 0.45,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 30,
        // Overlap effect if needed, but flex ratio handles it cleaner
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1e293b',
        fontFamily: 'Montserrat-Bold',
        marginBottom: 10,
    },
    subtext: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 20,
        paddingHorizontal: 10,
        fontFamily: 'Montserrat-Regular',
    },
    buttonWrapper: {
        width: '100%',
        marginBottom: 20,
        shadowColor: "#ef3c00",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    gradientBtn: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontFamily: 'Montserrat-Bold',
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkText: {
        fontSize: 14,
        color: '#94a3b8',
    },
    linkHighlight: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ef3c00', // Match button gradient end
    },
});

export default Splash;
