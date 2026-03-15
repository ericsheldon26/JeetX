import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, ScrollView, Platform } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import ScreenWrapper from '../../components/ScreenWrapper'; // Linux/NewArch Fix

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Mock Data
const TRANSACTIONS_DATA = [
    {
        id: '1',
        type: 'Contests',
        label: 'Entry Paid:',
        amount: '₹ 50',
        subLabel: 'Entry Refund:',
        subAmount: '₹ 120',
        date: '23 July 2025, 4:15PM',
        status: null, // For contests, status might not be the primary indicator
        icon: 'arrow-right'
    },
    {
        id: '2',
        type: 'Contests',
        label: 'Entry Paid:',
        amount: '₹ 200',
        subLabel: 'Entry Refund:',
        subAmount: '₹ 100',
        date: '20 July 2025, 7:45PM',
        status: null,
        icon: 'arrow-right'
    },
    {
        id: '3',
        type: 'Contests',
        label: 'Entry Paid:',
        amount: '₹ 100',
        subLabel: 'Entry Refund:',
        subAmount: '₹ 100',
        date: '20 July 2025, 7:45PM',
        status: null,
        icon: 'arrow-right'
    },
    {
        id: '4',
        type: 'Withdrawals',
        label: 'Amount:',
        amount: '₹ 200',
        date: '23 July 2025, 4:15PM',
        status: 'Success',
        icon: 'arrow-up'
    },
    {
        id: '5',
        type: 'Withdrawals',
        label: 'Amount:',
        amount: '₹ 500',
        date: '23 July 2025, 4:15PM',
        status: 'In-Process',
        icon: 'clock-o'
    },
    {
        id: '6',
        type: 'Withdrawals',
        label: 'Amount:',
        amount: '₹ 500',
        date: '23 July 2025, 4:15PM',
        status: 'Failed',
        icon: 'arrow-minus' // or appropriate icon
    },
    {
        id: '7',
        type: 'Withdrawals',
        label: 'Amount:',
        amount: '₹ 300',
        date: '23 July 2025, 4:15PM',
        status: 'Refund',
        icon: 'undo'
    },
    {
        id: '8',
        type: 'Deposits',
        label: 'Amount:',
        amount: '₹ 200',
        date: '23 July 2025, 4:15PM',
        status: 'Success',
        icon: 'arrow-down'
    },
    {
        id: '9',
        type: 'Deposits',
        label: 'Amount:',
        amount: '₹ 500',
        date: '23 July 2025, 4:15PM',
        status: 'In-Process',
        icon: 'clock-o'
    },
    {
        id: '10',
        type: 'TDS',
        label: '- ₹ 250',
        amount: '',
        date: '25 July 2025, 5:45 PM',
        subLabel: 'Type: TDS Amount Deduction\nDescription: Deducted on winnings over Rs 10,000',
        status: '',
        icon: 'arrow-left'
    },
];

const MyTransactionsDeposits = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Contests');

    // Filter Logic (Simple placeholder)
    const getFilteredData = () => {
        return TRANSACTIONS_DATA.filter(item => item.type === activeTab);
    };

    const getStatusColor = (status: string | null) => {
        if (!status) return '#000';
        switch (status) {
            case 'Success': return '#22c55e';
            case 'In-Process': return '#f59e0b';
            case 'Failed': return '#ef4444';
            case 'Refund': return '#3b82f6';
            default: return '#64748b';
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardIconContainer}>
                <FontAwesome
                    name={item.icon}
                    size={14}
                    color="#64748b"
                />
            </View>
            <View style={styles.cardContent}>
                {item.type === 'TDS' ? (
                    <>
                        <View style={styles.rowBetween}>
                            <Text style={styles.tdsTitle}>TDS Amount Deduction</Text>
                            <Text style={styles.tdsAmount}>{item.label}</Text>
                        </View>
                        <Text style={styles.dateText}>{item.date}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.tdsDesc}>Type: TDS Amount Deduction</Text>
                        <Text style={styles.tdsDesc}>Description: Deducted on winnings over Rs 10,000</Text>
                    </>
                ) : (
                    <>
                        <View style={styles.rowBetween}>
                            <Text style={styles.dateText}>{item.date}</Text>
                            {item.status && <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>}
                        </View>
                        <View style={styles.rowBetween}>
                            <Text style={styles.labelText}>{item.label}</Text>
                            <Text style={styles.amountText}>{item.amount}</Text>
                        </View>
                        {item.subLabel && (
                            <View style={styles.rowBetween}>
                                <Text style={styles.labelText}>{item.subLabel}</Text>
                                <Text style={styles.amountText}>{item.subAmount}</Text>
                            </View>
                        )}
                    </>
                )}
            </View>
        </View>
    );

    const renderFilterPills = () => {
        let pills: string[] = [];
        if (activeTab === 'Contests') pills = ['Entry Paid', 'Entry Refund', 'Winnings'];
        else if (activeTab === 'Withdrawals') pills = ['Refund', 'Success', 'In-process', 'Failed'];
        else if (activeTab === 'Deposits') pills = ['Success', 'In-process', 'Failed'];
        else if (activeTab === 'TDS') pills = ['TDS Amount Deduction', 'Year-End TDS'];

        if (pills.length === 0) return null;

        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsContainer}>
                {pills.map((pill) => (
                    <TouchableOpacity key={pill} style={styles.pill}>
                        <Text style={styles.pillText}>{pill}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    return (
        <ScreenWrapper 
          style={styles.container}
          statusBarColor="#02121a"
          statusBarStyle="light-content"
          backgroundColor="#f1f5f9"
        >
            {/* <StatusBar barStyle="light-content" backgroundColor="#02121a" /> */} {/* Original code */}

            {/* <SafeAreaView edges={['top']} style={styles.headerSafeArea}> */} {/* Original code */}
                <View style={[styles.header, styles.headerSafeArea]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <FontAwesome name="arrow-left" size={20} color="#ffffff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Transactions</Text>
                    <View style={{ width: 20 }} />
                </View>
            {/* </SafeAreaView> */} {/* Original code */}


            {/* Tabs - Now on White BG */}
            <View style={styles.tabsContainer}>
                {['Contests', 'Withdrawals', 'Deposits', 'TDS'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={styles.tabItem}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text
                            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {tab}
                        </Text>
                        {activeTab === tab && <View style={styles.activeTabIndicator} />}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Filter Pills */}
            <View style={styles.whiteSection}>
                {renderFilterPills()}
                <Text style={styles.infoText}>Transactions may take 15min to reflect here.</Text>
            </View>

            {/* List */}
            <FlatList
                data={getFilteredData()}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </ScreenWrapper>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    headerSafeArea: {
        backgroundColor: '#02121a',
    },

    header: {
        height: 56, // Standard height
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: '#02121a',
    },
    backButton: { padding: 8, marginLeft: -8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', fontFamily: 'Montserrat-Bold' },

    // Tabs Container (White bg)
    tabsContainer: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
        fontFamily: 'OpenSans-SemiBold',
    },
    activeTabText: {
        color: '#008d9d', // Teal Active
        fontWeight: '700',
    },
    activeTabIndicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        width: '100%',
        backgroundColor: '#008d9d',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },

    whiteSection: {
        backgroundColor: '#ffffff',
        paddingBottom: 10,
    },
    pillsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 10,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginRight: 8,
    },
    pillText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '600',
    },
    infoText: {
        fontSize: 11,
        color: '#94a3b8',
        marginHorizontal: 20,
        marginTop: 4,
        marginBottom: 10,
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    cardIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    dateText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    labelText: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '500',
    },
    amountText: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '700',
    },
    tdsTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
    },
    tdsAmount: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 8,
    },
    tdsDesc: {
        fontSize: 11,
        color: '#64748b',
        marginTop: 2,
    }
});

export default MyTransactionsDeposits;
