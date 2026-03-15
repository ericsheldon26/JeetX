import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import ScreenWrapper from '../../components/ScreenWrapper'; // Linux/NewArch Fix


const MyTransactionsContests = () => {
    return (
        <ScreenWrapper 
          style={styles.container}
          backgroundColor="#0f172a"
          statusBarColor="#0f172a"
          statusBarStyle="light-content"
        >
            {/* <SafeAreaView style={styles.container}> */} {/* Original code */}
            <Text style={styles.title}>My Transactions Contests</Text>
            {/* </SafeAreaView> */} {/* Original code */}
        </ScreenWrapper>
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

export default MyTransactionsContests;
