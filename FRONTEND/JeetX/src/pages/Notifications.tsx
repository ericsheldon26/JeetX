import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import ScreenWrapper from '../components/ScreenWrapper'; // Linux/NewArch Fix

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../api/notificationApi';
import { scale, verticalScale, moderateScale, hp, wp } from '../utils/responsive';


interface NotificationItem {
    id: string;
    title: string;
    message: string;
    category: 'SYSTEM' | 'GAME' | 'OFFER' | 'REMINDER' | 'INFO';
    created_at: string;
    is_read: boolean;
}

const CATEGORIES = [
    { label: 'All', value: 'All' },
    { label: 'System', value: 'SYSTEM' },
    { label: 'Game', value: 'GAME' },
    { label: 'Offers', value: 'OFFER' },
    { label: 'Reminder', value: 'REMINDER' },
    { label: 'Info', value: 'INFO' },
];

const Notifications = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState('All');
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response: any = await getNotifications();
            console.log('[Notifications.tsx] API Response:', JSON.stringify(response, null, 2));
            if (response.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const handleMarkAsRead = async (id: string, currentlyRead: boolean) => {
        if (currentlyRead) return;

        try {
            const response: any = await markAsRead(id);
            if (response.success) {
                setNotifications(prev =>
                    prev.map(n => n.id === id ? { ...n, is_read: true } : n)
                );
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const response: any = await markAllAsRead();
            if (response.success) {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            }
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            const response: any = await deleteNotification(id);
            if (response.success) {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const getIconDetails = (category: string) => {
        switch (category) {
            case 'OFFER':
                return { name: 'gift', color: '#008d9d', bgColor: '#e0f2f1' };
            case 'GAME':
                return { name: 'trophy', color: '#d97706', bgColor: '#fef3c7' };
            case 'REMINDER':
                return { name: 'bell', color: '#8b5cf6', bgColor: '#f5f3ff' };
            case 'SYSTEM':
            case 'INFO':
            default:
                return { name: 'info-circle', color: '#ef4444', bgColor: '#fee2e2' };
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d`;
    };

    const filteredNotifications = activeTab === 'All'
        ? notifications
        : notifications.filter(n => n.category === activeTab);

    console.log(`📋 [Notifications.tsx] Current Tab: ${activeTab}, Displaying ${filteredNotifications.length} items`);

    const renderItem = ({ item }: { item: NotificationItem }) => {
        const { name, color, bgColor } = getIconDetails(item.category);

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => handleMarkAsRead(item.id, item.is_read)}
            >
                <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
                    <FontAwesome name={name} size={22} color={color} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.cardTitle, !item.is_read && styles.unreadText]}>{item.title}</Text>
                    <Text style={styles.cardSubtitle} numberOfLines={2}>{item.message}</Text>
                </View>
                <View style={styles.rightActions}>
                    <Text style={styles.timeText}>{formatTime(item.created_at)}</Text>
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDeleteNotification(item.id)}
                    >
                        <FontAwesome name="trash-o" size={16} color="#94a3b8" />
                    </TouchableOpacity>
                </View>
                {!item.is_read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        );
    };

    return (
        <ScreenWrapper 
          style={styles.container} 
          backgroundColor="#02121a" 
          statusBarColor="#02121a" 
          statusBarStyle="light-content"
          disableBottomInset={true}
        >
            {/* <View style={styles.container}> */} {/* Original code */}
            {/* <StatusBar barStyle="light-content" backgroundColor="#02121a" /> */} {/* Original code */}
            {/* <SafeAreaView edges={['top']} style={styles.headerSafeArea}> */} {/* Original code */}


            <View style={styles.headerSafeArea}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
                        <FontAwesome name="arrow-left" size={20} color="#ffffff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notification</Text>
                    <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllButton}>
                        <Text style={styles.markAllText}>Mark all read</Text>
                    </TouchableOpacity>
                </View>

                {/* Categories Tabs */}
                <View>
                    <FlatList
                        data={CATEGORIES}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabsScrollContent}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.tabItem}
                                onPress={() => setActiveTab(item.value)}
                            >
                                <Text style={[
                                    styles.tabText,
                                    activeTab === item.value ? styles.activeTabText : styles.inactiveTabText
                                ]}>
                                    {item.label}
                                </Text>
                                {activeTab === item.value && <View style={styles.activeTabIndicator} />}
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.value}
                    />
                </View>
            </View>
            {/* </SafeAreaView> */} {/* Original code */}




            {/* Content Body */}
            <View style={styles.contentBody}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#02121a" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredNotifications}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <FontAwesome name="bell-o" size={60} color="#cbd5e1" />
                                <Text style={styles.emptyText}>No notifications found</Text>
                            </View>
                        }
                    />
                )}
            </View>
            {/* </View> */} {/* Original code */}
        </ScreenWrapper>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerSafeArea: {
        backgroundColor: '#02121a',
        paddingBottom: 0,
    },
    header: {
        height: verticalScale(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(5),
        marginBottom: verticalScale(5),
    },
    backButton: {
        padding: scale(8),
        marginLeft: -scale(8),
    },
    headerTitle: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: '#ffffff',
        fontFamily: 'Montserrat-Bold',
    },
    markAllButton: {
        paddingVertical: verticalScale(4),
        paddingHorizontal: wp(2),
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: scale(6),
    },
    markAllText: {
        fontSize: moderateScale(11),
        color: '#ffffff',
        fontWeight: '600',
        fontFamily: 'OpenSans-SemiBold',
    },
    tabsScrollContent: {
        paddingHorizontal: wp(4),
        gap: scale(20),
    },
    tabItem: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: wp(1.5),
        alignItems: 'center',
    },
    tabText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        fontFamily: 'OpenSans-SemiBold',
    },
    activeTabText: {
        color: '#ffffff',
        fontWeight: '700',
        marginBottom: verticalScale(6),
    },
    inactiveTabText: {
        color: '#94a3b8',
        marginBottom: verticalScale(6),
    },
    activeTabIndicator: {
        width: '100%',
        height: verticalScale(4),
        backgroundColor: '#ffffff',
        borderTopLeftRadius: scale(4),
        borderTopRightRadius: scale(4),
        position: 'absolute',
        bottom: 0,
    },
    contentBody: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    listContent: {
        padding: wp(5),
        paddingBottom: verticalScale(40),
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: scale(12),
        padding: scale(12),
        marginBottom: verticalScale(16),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    iconContainer: {
        width: scale(50),
        height: scale(50),
        borderRadius: scale(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(14),
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    rightActions: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: verticalScale(45),
    },
    cardTitle: {
        fontSize: moderateScale(14),
        fontWeight: '500',
        color: '#64748b',
        fontFamily: 'Roboto-Bold',
        marginBottom: verticalScale(4),
    },
    unreadText: {
        fontWeight: '700',
        color: '#1e293b',
    },
    cardSubtitle: {
        fontSize: moderateScale(12),
        color: '#64748b',
        fontFamily: 'OpenSans-Regular',
    },
    timeText: {
        fontSize: moderateScale(10),
        color: '#94a3b8',
        fontFamily: 'OpenSans-SemiBold',
    },
    deleteBtn: {
        padding: scale(4),
    },
    unreadDot: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: '#ef4444',
        position: 'absolute',
        top: scale(10),
        right: scale(10),
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(100),
    },
    emptyText: {
        marginTop: verticalScale(16),
        fontSize: moderateScale(16),
        color: '#64748b',
        fontFamily: 'OpenSans-SemiBold',
    },
});


export default Notifications;
