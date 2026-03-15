import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, FlatList, Dimensions, Image } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context'; // Original Windows/Native code
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Linux/NewArch Fix
import ScreenWrapper from '../components/ScreenWrapper'; // Linux/NewArch Fix



import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CONFIG, getAccessToken } from '../api/config';
import { scale, verticalScale } from '../utils/responsive';

import BannerSvg from '../assets/Bannner.svg';
import JeetXLogo from '../assets/Jeetxsmall.svg';

import { getNotifications, getUnreadCount } from '../api/notificationApi';
import { getQuizCategories, QuizCategory } from '../api/quizApi';

const { width } = Dimensions.get('window');

// Data for the Games
const GAMES_DATA = {
    // Quizzes removed - fetched from API
    Ludo: [
        { id: '1', title: 'Cricket Ludo', desc: 'Test your skills and intuition with our Cricket Fantasy Prediction game!', icon: 'circle', color: '#3b82f6' },
        { id: '2', title: 'Football Ludo', desc: 'Build Your Dream Team, Analyze, Predict, Dominate the Game.', icon: 'circle', color: '#10b981' },
        { id: '3', title: 'Kabaddi Ludo', desc: 'See your Kabaddi Knowledge, Raid, Tackle, Predict – Play Like a Pro', icon: 'circle', color: '#f97316' },
        { id: '4', title: 'Esports Ludo', desc: 'Analyze the Plays. Predict the Outcome. Pick Your Champs.', icon: 'gamepad', color: '#8b5cf6' },
        { id: '5', title: 'Stocks Ludo', desc: 'Stocks Made Simple, Fun, and Competitive. Guess the Gains.', icon: 'line-chart', color: '#22c55e' },
    ],
    Puzzles: [
        { id: '1', title: 'Logic Puzzle', desc: 'Challenge your mind and unleash your creativity with Logic Puzzle Adventure.', icon: 'puzzle-piece', color: '#f59e0b' },
        { id: '2', title: 'Number Puzzle', desc: 'Think you can guess? Unravel Mysteries, Anticipate the next number.', icon: 'sort-numeric-asc', color: '#3b82f6' },
        { id: '3', title: 'Word Puzzle', desc: 'Time Clicking away, Find the correct words and win big prizes.', icon: 'font', color: '#ec4899' },
        { id: '4', title: 'Picture Puzzle', desc: 'Images Shifting, Discover the Hidden Scenes and unlock amazing rewards.', icon: 'picture-o', color: '#10b981' },
        { id: '5', title: 'Sequence Puzzle', desc: 'Time is Ticking, Arrange the patterns correctly and Unlock Exciting Rewards.', icon: 'align-left', color: '#8b5cf6' },
    ],
    Chess: [
        { id: '1', title: 'Classic Chess', desc: 'Unleash Your Inner Grandmaster: Dive into the Thrilling World of Classic Chess!', icon: 'shield', color: '#cbd5e1' },
        { id: '2', title: 'Bullet Chess', desc: 'Master Your Moves: Strategize, Capture, and Conquer in Bullet Chess!', icon: 'rocket', color: '#ef4444' },
        { id: '3', title: 'Tournaments', desc: 'Evaluate the Moves. Forecast the Results. Choose Your Players.', icon: 'trophy', color: '#fbbf24' },
    ]
};

const BASE_IMAGES = [
    BannerSvg,
    BannerSvg,
    BannerSvg,
];
// Create a large array to simulate infinite scroll
const PROMO_IMAGES = Array(100).fill(BASE_IMAGES).flat();

const HomeScreen = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState('Quizzes');

    // Carousel Logic
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const insets = useSafeAreaInsets(); // Linux/NewArch Fix
    const [walletBalance, setWalletBalance] = useState('1,999');

    const [unreadCount, setUnreadCount] = useState(0);
    const [quizCategories, setQuizCategories] = useState<QuizCategory[]>([]);
    const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getAccessToken();
                if (!token) return;

                // Fetch Wallet Balance
                const walletResponse = await fetch(`${CONFIG.BASE_URL}api/v1/referral/wallet`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const walletData: any = await walletResponse.json();
                if (walletData.success && walletData.data) {
                    setWalletBalance(walletData.data.coin_balance?.toLocaleString() || '0');
                }

                // Fetch Unread Count
                const unreadData: any = await getUnreadCount();
                if (unreadData.success) {
                    setUnreadCount(unreadData.data.unread_count);
                }

                // Fetch Quiz Categories
                setIsLoadingQuizzes(true);
                const quizData = await getQuizCategories();
                if (quizData && quizData.success && quizData.data) {
                    setQuizCategories(quizData.data);
                }
                setIsLoadingQuizzes(false);
            } catch (error) {
                console.error('Failed to fetch home data:', error);
                setIsLoadingQuizzes(false);
            }
        };

        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = currentIndex + 1;
            // Reset if reached end (rare with large array)
            if (nextIndex >= PROMO_IMAGES.length) {
                nextIndex = 0;
                flatListRef.current?.scrollToIndex({ index: 0, animated: false });
            } else {
                flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            }
            setCurrentIndex(nextIndex);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const renderPromoItem = useCallback(({ item: SvgComponent }: any) => (
        <View style={{ width: width, paddingHorizontal: scale(20) }}>
            <View style={{ width: '100%', height: verticalScale(85), borderRadius: scale(16), overflow: 'hidden' }}>
                <SvgComponent width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ transform: [{ scale: 1.0 }] }} />
            </View>
        </View>
    ), []);

    const getItemLayout = useCallback((data: any, index: number) => ({
        length: width,
        offset: width * index,
        index,
    }), []);

    const renderGameItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.gameCard} onPress={() => {
            if (activeTab === 'Quizzes') {
                // Handle sub-category selection (Step 3)
                // Navigation or opening entry modal will be handled here
                console.log('Selected sub-category:', item.id);
                // For now, let's navigate to a placeholder or open modal
                // Step 4 & 5 will happen in the next screen/modal
                if (item.id === '1' && !item.isApiData) {
                    navigation.navigate('QuizzGamePlay');
                } else if (item.isApiData) {
                    // This is real API data
                    // We will navigate to a new screen or show modal
                    // I will create a QuizEntryScreen later
                }
            }
        }}>
            <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                    <FontAwesome name={item.icon} size={24} color={item.color} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
                </View>
                <TouchableOpacity style={styles.getInButton}>
                    <Text style={styles.getInText}>Get IN</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderQuizCategory = ({ item }: { item: QuizCategory }) => (
        <TouchableOpacity
            style={styles.gameCard}
            onPress={() => {
                // Step 4: Call GET /api/v1/quiz/:sub_category_id/entry
                // We'll navigate to a contest selection screen or open a modal
                navigation.navigate('QuizEntry', { subCategoryId: item.id, subCategoryName: item.name });
            }}
        >
            <View style={styles.cardContent}>
                {item.icon_url ? (
                    <View style={[styles.iconContainer, { backgroundColor: '#0284c720' }]}>
                        <Image source={{ uri: item.icon_url }} style={styles.apiIcon} />
                    </View>
                ) : null}
                <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                    {/* Assuming active_tournaments might not be on the category object directly based on new API, 
                        but if it is, we can use it. The interface has total_tournaments currently. 
                        Let's verify interface. The user said 'total_tournaments' in the list.
                        And 'active_tournaments' in the single get. 
                        Let's stick to simple display for now. */}
                </View>
                <TouchableOpacity style={styles.getInButton}>
                    <Text style={styles.getInText}>Get IN</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const TABS = ['Quizzes', 'Ludo', 'Puzzles', 'Chess'];
    const contentRef = useRef<FlatList>(null);

    const onTabPress = (tab: string, index: number) => {
        setActiveTab(tab);
        contentRef.current?.scrollToIndex({ index, animated: true });
    };

    const renderGameList = ({ item: tab }: { item: string }) => {
        if (tab === 'Quizzes') {
            if (isLoadingQuizzes) {
                return (
                    <View style={{ width: width, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#aaa' }}>Loading quizzes...</Text>
                    </View>
                );
            }

            if (quizCategories.length === 0) {
                return (
                    <View style={{ width: width, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#aaa' }}>No quizzes available at the moment.</Text>
                    </View>
                );
            }

            return (
                <ScrollView
                    style={{ width: width, flex: 1 }}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                >
                    {quizCategories.map((category) => (
                        <React.Fragment key={category.id}>
                            {renderQuizCategory({ item: category })}
                        </React.Fragment>
                    ))}
                </ScrollView>
            );
        }

        return (
            <View style={{ width: width, flex: 1 }}>
                <FlatList
                    data={GAMES_DATA[tab as keyof typeof GAMES_DATA] || []}
                    renderItem={renderGameItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    };

    return (
        <ScreenWrapper
            style={styles.container}
            disableTopInset={true}
            statusBarColor="#02121a"
            statusBarStyle="light-content"
        >
            {/* <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}> */} {/* Original code */}
            {/* <StatusBar barStyle="light-content" backgroundColor="#02121a" /> */} {/* Original code */}




            {/* Header + Banner Area */}
            <LinearGradient colors={['#02121a', '#0d3648']} style={styles.header}>
                <View>
                    {/* <SafeAreaView edges={['top']}> */} {/* Original code */}
                    {/* We'll apply top padding manually here to keep it inside the gradient */}
                    <View style={{ paddingTop: insets.top }}>


                        <View style={styles.headerTop}>
                            <View style={styles.userInfo}>
                                <View style={styles.avatarContainer}>
                                    <JeetXLogo width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                                </View>
                                <Text style={styles.logoText}>JeetX</Text>
                            </View>

                            <View style={styles.headerRight}>
                                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
                                    <FontAwesome name="bell-o" size={22} color="#fff" />
                                    {unreadCount > 0 && (
                                        <View style={styles.notificationBadge}>
                                            <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.walletButton}>
                                    <FontAwesome name="google-wallet" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                                    <Text style={styles.walletText}>₹{walletBalance}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ marginVertical: 10 }}>
                            <FlatList
                                ref={flatListRef}
                                data={PROMO_IMAGES}
                                renderItem={renderPromoItem}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(_, index) => index.toString()}
                                getItemLayout={getItemLayout}
                                initialNumToRender={1}
                                maxToRenderPerBatch={1}
                                windowSize={3}
                                removeClippedSubviews={true}
                                onScroll={(e) => {
                                    const x = e.nativeEvent.contentOffset.x;
                                    const index = Math.round(x / width);
                                    if (index !== currentIndex) {
                                        setCurrentIndex(index);
                                    }
                                }}
                            />
                        </View>

                        {/* Tabs overlapping the gradient or just below */}
                        <View style={styles.tabsContainer}>
                            <View style={styles.tabsRow}>
                                {TABS.map((tab, index) => (
                                    <TouchableOpacity
                                        key={tab}
                                        style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                                        onPress={() => onTabPress(tab, index)}
                                    >
                                        <Text
                                            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
                                            numberOfLines={1}
                                            adjustsFontSizeToFit
                                        >
                                            {tab}
                                        </Text>
                                        {activeTab === tab && <View style={styles.activeIndicator} />}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    {/* </SafeAreaView> */}
                    </View>
                </View>
            </LinearGradient>





            {/* Swipeable List Content */}
            <View style={styles.listContainer}>
                <FlatList
                    ref={contentRef}
                    data={TABS}
                    renderItem={renderGameList}
                    keyExtractor={item => item}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => {
                        const x = e.nativeEvent.contentOffset.x;
                        const index = Math.round(x / width);
                        if (index >= 0 && index < TABS.length) {
                            setActiveTab(TABS[index]);
                        }
                    }}
                />
            </View>
            {/* </SafeAreaView> */}
        </ScreenWrapper>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        paddingBottom: verticalScale(10),
        borderBottomLeftRadius: scale(24),
        borderBottomRightRadius: scale(24),
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: scale(8),
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: '#fff',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    logoText: {
        color: '#fff',
        fontSize: scale(20),
        fontWeight: 'bold',
        fontFamily: 'Montserrat-Bold',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(16),
    },
    walletButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        borderRadius: scale(20),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    walletText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: scale(14),
    },
    iconButton: {
        position: 'relative',
        padding: scale(4),
    },
    notificationBadge: {
        position: 'absolute',
        top: scale(-2),
        right: scale(-2),
        minWidth: scale(14),
        height: scale(14),
        borderRadius: scale(7),
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(2),
        borderWidth: 1,
        borderColor: '#02121a',
    },
    badgeText: {
        color: '#ffffff',
        fontSize: scale(8),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    promoBanner: {
        marginHorizontal: scale(20),
        borderRadius: scale(16),
        padding: scale(16),
        marginVertical: verticalScale(10),
    },
    promoContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    promoLabel: {
        color: '#fbbf24',
        fontSize: scale(10),
        fontWeight: 'bold',
        marginBottom: verticalScale(4),
    },
    promoTitle: {
        color: '#fff',
        fontSize: scale(18),
        fontWeight: 'bold',
        marginBottom: verticalScale(8),
    },
    promoStats: {
        flexDirection: 'row',
        gap: scale(8),
    },
    promoStatText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: scale(12),
    },
    promoIcon: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: scale(8),
        borderRadius: scale(50),
        marginLeft: scale(10),
    },
    tabsContainer: {
        marginTop: verticalScale(5),
        borderBottomWidth: 0,
    },
    tabsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: scale(20),
        gap: scale(8),
    },
    tabButton: {
        paddingVertical: verticalScale(10),
        alignItems: 'center',
        flex: 1,
    },
    activeTabButton: {
        // No background change, just text
    },
    tabText: {
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
        fontSize: scale(13),
        marginBottom: verticalScale(4),
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    activeIndicator: {
        width: '80%', // Slightly smaller than full width look better
        height: verticalScale(3),
        backgroundColor: '#10b981', // Green indicator
        borderRadius: scale(2),
        position: 'absolute',
        bottom: 0,
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        padding: scale(20),
        paddingBottom: verticalScale(100),
    },
    gameCard: {
        backgroundColor: '#fff',
        borderRadius: scale(16),
        padding: scale(16),
        marginBottom: verticalScale(16),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.05,
        shadowRadius: scale(5),
        elevation: 2,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(12),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(16),
    },
    textContainer: {
        flex: 1,
        marginRight: scale(12),
    },
    cardTitle: {
        fontSize: scale(15),
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: verticalScale(4),
    },
    cardDesc: {
        fontSize: scale(11),
        color: '#64748b',
        lineHeight: scale(15),
    },
    getInButton: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(8),
        borderRadius: scale(20),
    },
    getInText: {
        color: '#0284c7',
        fontSize: scale(12),
        fontWeight: '800',
    },
    apiIcon: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(8),
    },
    categorySection: {
        marginBottom: verticalScale(20),
    },
    sectionHeader: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: verticalScale(12),
        fontFamily: 'Montserrat-Bold',
    },
    tournamentBadge: {
        fontSize: scale(10),
        color: '#10b981',
        fontWeight: '600',
        marginTop: verticalScale(4),
    }
});

export default HomeScreen;
