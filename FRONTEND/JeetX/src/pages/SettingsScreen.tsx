import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import ScreenWrapper from '../components/ScreenWrapper'; // Linux/NewArch Fix


const SettingsScreen = () => {
    return (
        /* <SafeAreaView style={styles.container}> */ // Original code
        <ScreenWrapper style={styles.container}>
            <Text style={styles.title}>Settings Screen</Text>
        </ScreenWrapper>
        /* </SafeAreaView> */ // Original code
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f8fafc',
    },
});

export default SettingsScreen;
