import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import ScreenWrapper from '../components/ScreenWrapper'; // Linux/NewArch Fix

import { useNavigation } from '@react-navigation/native';
import { getFCMToken } from '../utils/notificationHelper';
import { removeToken } from '../api/notificationApi';

const ProfileScreen = () => {
    const navigation = useNavigation<any>();

    const menuItems = [
        {
            icon: 'history',
            title: 'Transaction History (Deposits)',
            color: '#3b82f6',
            onPress: () => navigation.navigate('MyTransactionsDeposits')
        },
        {
            icon: 'gamepad',
            title: 'Recently Played',
            color: '#f59e0b',
            onPress: () => navigation.navigate('RecentlyPlayed')
        },
        {
            icon: 'bar-chart',
            title: 'Your Skill Score',
            color: '#10b981',
            onPress: () => navigation.navigate('YourSkillScore')
        },
        {
            icon: 'pencil',
            title: 'Edit Profile',
            color: '#8b5cf6',
            onPress: () => { }
        },
        {
            icon: 'shield',
            title: 'Privacy & Security',
            color: '#f97316',
            onPress: () => { }
        },
        {
            icon: 'sign-out',
            title: 'Logout',
            color: '#ef4444',
            onPress: async () => {
                try {
                    const fcmToken = await getFCMToken();
                    if (fcmToken) {
                        await removeToken(fcmToken);
                    }
                } catch (err) {
                    console.error('[ProfileScreen.tsx] FCM Removal Error:', err);
                }

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }
        },
    ];

    return (
        /* <SafeAreaView style={styles.container}> */ // Original code
        /* <StatusBar barStyle="light-content" backgroundColor="#0f172a" /> */ // Original code
        <ScreenWrapper style={styles.container} statusBarColor="#0f172a" statusBarStyle="light-content">


            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <FontAwesome name="user-circle" size={80} color="#cbd5e1" />
                        <View style={styles.editBadge}>
                            <FontAwesome name="camera" size={12} color="#ffffff" />
                        </View>
                    </View>
                    <Text style={styles.userName}>John Doe</Text>
                    <Text style={styles.userHandle}>@johndoe123</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>150</Text>
                        <Text style={styles.statLabel}>Games</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>89</Text>
                        <Text style={styles.statLabel}>Won</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>₹5.2k</Text>
                        <Text style={styles.statLabel}>Earned</Text>
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={item.onPress}
                        >
                            <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                                <FontAwesome name={item.icon} size={18} color={item.color} />
                            </View>
                            <Text style={styles.menuTitle}>{item.title}</Text>
                            <FontAwesome name="angle-right" size={16} color="#64748b" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ScreenWrapper>
        /* </SafeAreaView> */ // Original code
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    avatarContainer: {
        marginBottom: 16,
        position: 'relative',
    },
    editBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#f97316',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#0f172a',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f8fafc',
    },
    userHandle: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#1e293b',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f8fafc',
    },
    statLabel: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 4,
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#334155',
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuTitle: {
        flex: 1,
        fontSize: 16,
        color: '#94a3b8',
    },
});

export default ProfileScreen;
