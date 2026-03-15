import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar, FlatList } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Linux/NewArch Fix
import ScreenWrapper from '../components/ScreenWrapper'; // Linux/NewArch Fix

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Mock Data for Matches
const MATCHES_DATA = [
    {
        id: '1',
        title: 'Maths Quiz Championship',
        category: 'Quiz',
        points: '10,000 P',
        date: 'July 24',
        result: '1st',
        isLoss: false,
        icon: 'calculator',
        iconColor: '#f97316'
    },
    {
        id: '2',
        title: 'Sports Quiz',
        category: 'Quiz',
        points: '12,000 P',
        date: 'July 24',
        result: '1st',
        isLoss: false,
        icon: 'futbol-o',
        iconColor: '#ef4444'
    },
    {
        id: '3',
        title: 'Puzzle Duel',
        category: 'Quiz',
        points: '2,000 P',
        date: 'July 24',
        result: 'LOST',
        isLoss: true,
        icon: 'puzzle-piece',
        iconColor: '#10b981'
    },
    {
        id: '4',
        title: 'Maths Quiz Championship',
        category: 'Quiz',
        points: '10,000 P',
        date: 'July 24',
        result: '1st',
        isLoss: false,
        icon: 'calculator',
        iconColor: '#f97316'
    },
];

const RecentlyPlayed = () => {
    const navigation = useNavigation() as any;
    const insets = useSafeAreaInsets(); // Linux/NewArch Fix


    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <FontAwesome name="arrow-left" size={20} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Recently Played</Text>
            <View style={{ width: 24 }} />
        </View>
    );

    const renderUserCard = () => (
        <View style={styles.userCardContainer}>
            <LinearGradient
                colors={['#ffffff', '#fff7ed']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.userCard}
            >
                <View style={styles.userInfoRow}>
                    <View style={styles.avatarContainer}>
                        {/* Placeholder for the Hooded Avatar */}
                        <View style={styles.avatarPlaceholder}>
                            <FontAwesome name="user-secret" size={30} color="#000" />
                        </View>
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>Rajvardhan Singh Rajput</Text>
                        <Text style={styles.prizeText}>
                            Total Prize Won <Text style={styles.prizeAmount}>₹18,000</Text>
                        </Text>

                        {/* Progress Bar Section */}
                        <View style={styles.progressSection}>
                            <View style={styles.progressBarBackground}>
                                <LinearGradient
                                    colors={['#f59e0b', '#d97706']}
                                    style={[styles.progressBarFill, { width: '70%' }]}
                                />
                            </View>
                            <View style={styles.rankIconContainer}>
                                <FontAwesome name="trophy" size={12} color="#b45309" />
                            </View>
                            <Text style={styles.pointsText}>10,000 P</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
            {/* Gradient Border Line effect at bottom of card if needed, or shadow handles it */}
        </View>
    );

    const renderMatchItem = ({ item }: { item: any }) => (
        <View style={styles.matchCard}>
            <View style={[styles.iconBox, { backgroundColor: item.iconColor + '15' }]}>
                <FontAwesome name={item.icon} size={20} color={item.iconColor} />
            </View>
            <View style={styles.matchContent}>
                <Text style={styles.matchTitle}>{item.title}</Text>
                <Text style={styles.matchCategory}>Category <Text style={{ fontWeight: '600', color: '#1e293b' }}>{item.category}</Text></Text>
                <View style={styles.pointsRow}>
                    <FontAwesome name="fire" size={12} color="#f97316" />
                    <Text style={styles.matchPoints}>{item.points}</Text>
                </View>
            </View>
            <View style={styles.matchRightSide}>
                <Text style={[styles.resultText, item.isLoss ? styles.lossText : styles.winText]}>
                    {item.result}
                </Text>
                <View style={styles.dateShareRow}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <TouchableOpacity style={styles.shareButton}>
                        <FontAwesome name="share-alt" size={14} color="#94a3b8" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <ScreenWrapper 
          style={styles.container} 
          disableTopInset={true}
          statusBarColor="#02121a"
          statusBarStyle="light-content"
        >
            {/* <View style={styles.container}> */} {/* Original code */}
            {/* <StatusBar barStyle="light-content" backgroundColor="#02121a" /> */} {/* Original code */}


            {/* Dark Header Background */}
            <View style={styles.darkHeaderBg}>
                {/* <SafeAreaView edges={['top']}> */} {/* Original code */}
                <View style={{ paddingTop: insets.top }}>


                    {renderHeader()}
                </View>
                {/* </SafeAreaView> */}

                {/* Extra space for the floating card overlap */}
                <View style={{ height: 60 }} />
            </View>

            <View style={styles.contentContainer}>
                {/* Floating User Card */}
                <View style={styles.floatingCardWrapper}>
                    {renderUserCard()}
                </View>

                <View style={styles.listHeaderRow}>
                    <Text style={styles.listTitle}>Matches Played</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={MATCHES_DATA}
                    renderItem={renderMatchItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>KEEP IT UP !</Text>
                            <Text style={styles.footerSubText}>NEW CHALLENGES AWAIT</Text>
                        </View>
                    }
                />
            </View>
            {/* </View> */} {/* Original code */}
        </ScreenWrapper>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    darkHeaderBg: {
        backgroundColor: '#02121a',
        paddingBottom: 20,
        zIndex: 1,
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
        fontFamily: 'Montserrat-Bold',
    },
    contentContainer: {
        flex: 1,
        marginTop: -60, // Pull up to overlap header
        zIndex: 2,
    },
    floatingCardWrapper: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    userCardContainer: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: '#ffffff', // Required for shadow
    },
    userCard: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#fff7ed',
    },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatarPlaceholder: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#f59e0b',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
        fontFamily: 'Montserrat-Bold',
    },
    prizeText: {
        fontSize: 11,
        color: '#64748b',
        marginBottom: 8,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    prizeAmount: {
        color: '#d97706',
        fontWeight: '700',
        fontStyle: 'normal',
    },
    progressSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarBackground: {
        flex: 1,
        height: 6,
        backgroundColor: '#e2e8f0', // Lighter bg for contrast
        borderRadius: 3,
        marginRight: 8,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    rankIconContainer: {
        position: 'absolute',
        left: 0,
        top: -12,
        display: 'none',
    },
    pointsText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#ea580c',
    },
    listHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        fontFamily: 'Montserrat-Bold',
    },
    viewAllText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    matchCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    matchContent: {
        flex: 1,
    },
    matchTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
        fontFamily: 'OpenSans-Bold',
    },
    matchCategory: {
        fontSize: 11,
        color: '#94a3b8',
        marginBottom: 4,
    },
    pointsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    matchPoints: {
        fontSize: 11,
        color: '#f97316',
        fontWeight: '700',
        marginLeft: 4,
    },
    matchRightSide: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 48,
    },
    resultText: {
        fontSize: 14,
        fontWeight: '800',
        fontStyle: 'italic',
        fontFamily: 'Montserrat-ExtraBold',
    },
    winText: {
        color: '#f59e0b', // Gold/Orange
    },
    lossText: {
        color: '#dc2626', // Red
        fontSize: 12, // Slightly smaller 'LOST'
    },
    dateShareRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 10,
        color: '#94a3b8',
        marginRight: 8,
    },
    shareButton: {
        padding: 4,
    },
    footer: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 40,
    },
    footerText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#cbd5e1',
        letterSpacing: 1,
        fontFamily: 'Montserrat-ExtraBold',
    },
    footerSubText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#cbd5e1',
        letterSpacing: 1,
        marginTop: 2,
        fontStyle: 'italic',
        fontFamily: 'Montserrat-ExtraBoldItalic',
    },
});

export default RecentlyPlayed;
