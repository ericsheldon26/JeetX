
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Image,
    Modal,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { getLeaderboard, LeaderboardEntry } from '../../api/leaderboardApi';
import { getQuizCategories, QuizCategory } from '../../api/quizApi';

const { width } = Dimensions.get('window');

const FilterModal = ({
    visible,
    onClose,
    categories,
    onSave,
    selectedCategoryId
}: {
    visible: boolean;
    onClose: () => void;
    categories: QuizCategory[];
    onSave: (categoryId: string | undefined) => void;
    selectedCategoryId: string | undefined;
}) => {
    const [tempSelectedId, setTempSelectedId] = useState<string | undefined>(selectedCategoryId);
    const [activeMainCategory, setActiveMainCategory] = useState<'ALL_GAMES' | 'QUIZ'>(
        selectedCategoryId ? 'QUIZ' : 'ALL_GAMES'
    );

    useEffect(() => {
        setTempSelectedId(selectedCategoryId);
        setActiveMainCategory(selectedCategoryId ? 'QUIZ' : 'ALL_GAMES');
    }, [selectedCategoryId, visible]);

    const handleMainCategoryPress = (category: 'ALL_GAMES' | 'QUIZ') => {
        setActiveMainCategory(category);
        if (category === 'ALL_GAMES') {
            setTempSelectedId(undefined);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filter</Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome name="times" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.filterContainer}>
                        <View style={styles.categoriesList}>
                            <TouchableOpacity
                                style={[
                                    styles.categoryItem,
                                    activeMainCategory === 'ALL_GAMES' && styles.selectedCategoryItem
                                ]}
                                onPress={() => handleMainCategoryPress('ALL_GAMES')}
                            >
                                <View style={[
                                    styles.categoryActiveBar,
                                    activeMainCategory === 'ALL_GAMES' ? { backgroundColor: '#00A8A8' } : { backgroundColor: 'transparent' }
                                ]} />
                                <Text style={[
                                    styles.categoryText,
                                    activeMainCategory === 'ALL_GAMES' && styles.selectedCategoryText
                                ]}>All Games</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.categoryItem,
                                    activeMainCategory === 'QUIZ' && styles.selectedCategoryItem
                                ]}
                                onPress={() => handleMainCategoryPress('QUIZ')}
                            >
                                <View style={[
                                    styles.categoryActiveBar,
                                    activeMainCategory === 'QUIZ' ? { backgroundColor: '#00A8A8' } : { backgroundColor: 'transparent' }
                                ]} />
                                <Text style={[
                                    styles.categoryText,
                                    activeMainCategory === 'QUIZ' && styles.selectedCategoryText
                                ]}>Quiz</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.subCategoriesList}>
                            <Text style={styles.subCategoryTitle}>
                                {activeMainCategory === 'QUIZ' ? 'Choose Quiz Category' : 'Overall Rankings'}
                            </Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {activeMainCategory === 'ALL_GAMES' ? (
                                    <TouchableOpacity
                                        style={styles.subCategoryItem}
                                        onPress={() => setTempSelectedId(undefined)}
                                    >
                                        <View style={styles.radioButton}>
                                            {!tempSelectedId && <View style={styles.radioButtonInner} />}
                                        </View>
                                        <Text style={styles.subCategoryText}>All Games</Text>
                                    </TouchableOpacity>
                                ) : (
                                    categories.map((cat) => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={styles.subCategoryItem}
                                            onPress={() => setTempSelectedId(cat.id)}
                                        >
                                            <View style={styles.radioButton}>
                                                {tempSelectedId === cat.id && <View style={styles.radioButtonInner} />}
                                            </View>
                                            <Text style={styles.subCategoryText}>{cat.name}</Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {
                            onSave(tempSelectedId);
                            onClose();
                        }}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    <SafeAreaView edges={['bottom']} />
                </View>
            </View>
        </Modal>
    );
};

const Leaderboard = () => {
    const [activeTab, setActiveTab] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME'>('WEEKLY');
    const [filterVisible, setFilterVisible] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [top3, setTop3] = useState<LeaderboardEntry[]>([]);
    const [userRanking, setUserRanking] = useState<LeaderboardEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [categories, setCategories] = useState<QuizCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);

    const fetchCategories = async () => {
        try {
            const res = await getQuizCategories();
            if (res.success) {
                setCategories(res.data);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchLeaderboardData = async () => {
        setLoading(true);
        try {
            const res = await getLeaderboard(activeTab, selectedCategoryId);
            if (res.success) {
                setTop3(res.data.top_3 || []);
                setLeaderboardData(res.data.rankings || []);
                setUserRanking(res.data.user_ranking || null);
            }
        } catch (err) {
            console.error('Error fetching leaderboard data:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchLeaderboardData();
    }, [activeTab, selectedCategoryId]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeaderboardData();
    };

    const renderLeaderboardItem = ({ item }: { item: LeaderboardEntry }) => {
        let bgColors = ['#ffffff', '#ffffff'];
        let badgeText = '#fbbf24';
        let badgeBorder = 'transparent';

        if (item.rank === 1) {
            bgColors = ['#FFFACD', '#FCD34D'];
            badgeText = '#FCD34D';
            badgeBorder = '#FCD34D';
        } else if (item.rank === 2) {
            bgColors = ['#F3F4F6', '#D1D5DB'];
            badgeText = '#FFFFFF';
            badgeBorder = '#E5E7EB';
        } else if (item.rank === 3) {
            bgColors = ['#FFF5E1', '#FFB74D'];
            badgeText = '#FDBA74';
            badgeBorder = '#FDBA74';
        }

        const isTop3 = item.rank <= 3;

        return (
            <LinearGradient
                colors={bgColors}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.card}
            >
                <View style={styles.leftSection}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatarPlaceholder, { backgroundColor: isTop3 ? '#1f2937' : '#e2e8f0' }]}>
                            {item.profile_url ? (
                                <Image source={{ uri: item.profile_url }} style={styles.avatarImage} />
                            ) : (
                                <FontAwesome name="user" size={24} color={isTop3 ? "#fff" : "#94a3b8"} />
                            )}
                        </View>
                        {isTop3 && (
                            <View style={[styles.rankBadge, { borderColor: badgeBorder }]}>
                                <Text style={[styles.rankBadgeText, { color: badgeText }]}>
                                    {item.rank === 1 ? '1st' : item.rank === 2 ? '2nd' : '3rd'}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.infoWrapper}>
                    <View style={styles.columnName}>
                        <Text style={styles.nameText} numberOfLines={1}>{item.full_name}</Text>
                        <Text style={styles.rankText}>#{item.rank}</Text>
                    </View>

                    <View style={styles.columnPoints}>
                        <Text style={styles.labelStats}>Points</Text>
                        <Text style={styles.valueStats}>{item.points}</Text>
                    </View>

                    <View style={styles.columnPrize}>
                        <Text style={styles.labelStats}>Total Prize Won</Text>
                        <Text style={styles.valueStats}>₹{item.total_prize_won.toLocaleString()}</Text>
                    </View>
                </View>
            </LinearGradient>
        );
    };

    const Top3Section = () => {
        if (!top3 || top3.length === 0) return null;

        return (
            <View style={styles.top3Container}>
                <LinearGradient
                    colors={['#FFFFFF', '#FFF3D6']}
                    style={styles.top3Gradient}
                >
                    <View style={styles.top3Avatars}>
                        {/* Rank 2 */}
                        {top3[1] && (
                            <View style={styles.rank2Container}>
                                <View style={[styles.avatarLarge, { backgroundColor: '#F472B6', borderColor: '#fff', borderWidth: 2 }]}>
                                    {top3[1].profile_url ? (
                                        <Image source={{ uri: top3[1].profile_url }} style={styles.avatarImageLarge} />
                                    ) : (
                                        <FontAwesome name="user" size={30} color="#fff" />
                                    )}
                                </View>
                                <View style={styles.rankBadgeTop3}>
                                    <Text style={styles.rankBadgeTextTop3}>2nd</Text>
                                </View>
                                <Text style={styles.top3Name} numberOfLines={1}>{top3[1].full_name}</Text>
                                <Text style={styles.top3Points}>{top3[1].points} P</Text>
                            </View>
                        )}

                        {/* Rank 1 */}
                        {top3[0] && (
                            <View style={styles.rank1Container}>
                                <View style={[styles.avatarExtraLarge, { backgroundColor: '#1F2937', borderColor: '#FFD700', borderWidth: 3 }]}>
                                    {top3[0].profile_url ? (
                                        <Image source={{ uri: top3[0].profile_url }} style={styles.avatarImageExtraLarge} />
                                    ) : (
                                        <FontAwesome name="user-secret" size={40} color="#fff" />
                                    )}
                                </View>
                                <View style={[styles.rankBadgeTop3, styles.rank1Badge]}>
                                    <Text style={styles.rankBadgeTextTop3}>1st</Text>
                                </View>
                                <Text style={[styles.top3Name, { fontWeight: 'bold' }]} numberOfLines={1}>{top3[0].full_name}</Text>
                                <Text style={[styles.top3Points, { color: '#FF8C00' }]}>{top3[0].points} P</Text>
                            </View>
                        )}

                        {/* Rank 3 */}
                        {top3[2] && (
                            <View style={styles.rank3Container}>
                                <View style={[styles.avatarLarge, { backgroundColor: '#92400E', borderColor: '#fff', borderWidth: 2 }]}>
                                    {top3[2].profile_url ? (
                                        <Image source={{ uri: top3[2].profile_url }} style={styles.avatarImageLarge} />
                                    ) : (
                                        <FontAwesome name="user-ninja" size={30} color="#fff" />
                                    )}
                                </View>
                                <View style={styles.rankBadgeTop3}>
                                    <Text style={styles.rankBadgeTextTop3}>3rd</Text>
                                </View>
                                <Text style={styles.top3Name} numberOfLines={1}>{top3[2].full_name}</Text>
                                <Text style={styles.top3Points}>{top3[2].points} P</Text>
                            </View>
                        )}
                    </View>
                </LinearGradient>
            </View>
        );
    };

    const UserStatsSticky = () => {
        if (!userRanking) return null;
        return (
            <View style={styles.userStatsStickyWrapper}>
                <View style={styles.userStatsCard}>
                    <View style={styles.userStatItem}>
                        <Text style={styles.userStatLabel}>My Rank</Text>
                        <Text style={styles.userStatValue}>#{userRanking.rank}</Text>
                    </View>
                    <View style={styles.userStatDivider} />
                    <View style={styles.userStatItem}>
                        <Text style={styles.userStatLabel}>Wins</Text>
                        <Text style={styles.userStatValue}>{userRanking.wins}</Text>
                    </View>
                    <View style={styles.userStatDivider} />
                    <View style={styles.userStatItem}>
                        <Text style={styles.userStatLabel}>Points</Text>
                        <Text style={styles.userStatValue}>{userRanking.points}</Text>
                    </View>
                    <View style={styles.userStatDivider} />
                    <View style={styles.userStatItem}>
                        <Text style={styles.userStatLabel}>Prize</Text>
                        <Text style={styles.userStatValue}>₹{userRanking.total_prize_won.toLocaleString()}</Text>
                    </View>
                </View>
                <SafeAreaView edges={['bottom']} />
            </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#02121a" />

            <View style={styles.headerContainer}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.tabsContainer}>
                        {[
                            { label: 'Daily', value: 'DAILY' },
                            { label: 'Weekly', value: 'WEEKLY' },
                            { label: 'Monthly', value: 'MONTHLY' },
                            { label: 'All Time', value: 'ALL_TIME' }
                        ].map((tab) => (
                            <TouchableOpacity
                                key={tab.value}
                                style={styles.tabButton}
                                onPress={() => setActiveTab(tab.value as any)}
                            >
                                <Text style={[
                                    styles.tabText,
                                    activeTab === tab.value ? styles.activeTabText : styles.inactiveTabText
                                ]}>
                                    {tab.label}
                                </Text>
                                {activeTab === tab.value && <View style={styles.activeTabIndicator} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </SafeAreaView>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.filterRow}>
                    <View style={styles.rankingTitleContainer}>
                        <FontAwesome name="trophy" size={18} color="#fbbf24" style={{ marginRight: 8 }} />
                        <Text style={styles.playersRankingTitle}>
                            {activeTab.charAt(0) + activeTab.slice(1).toLowerCase().replace('_', ' ')} Ranking
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
                        <FontAwesome name="filter" size={14} color="#334155" style={{ marginRight: 6 }} />
                        <Text style={styles.filterBtnText}>Filter</Text>
                    </TouchableOpacity>
                </View>

                {loading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#008080" />
                    </View>
                ) : (
                    <FlatList
                        ListHeaderComponent={Top3Section}
                        data={leaderboardData}
                        renderItem={renderLeaderboardItem}
                        keyExtractor={item => `${item.rank}-${item.user_id}`}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#008080']} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No rankings available for this period.</Text>
                            </View>
                        }
                    />
                )}
            </View>

            <UserStatsSticky />

            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                categories={categories}
                onSave={(id) => setSelectedCategoryId(id)}
                selectedCategoryId={selectedCategoryId}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    headerContainer: {
        backgroundColor: '#02121a',
        paddingBottom: 0,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        zIndex: 10,
    },
    safeArea: {
        backgroundColor: '#02121a',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 0,
    },
    tabButton: {
        paddingVertical: 12,
        paddingHorizontal: 4,
        alignItems: 'center',
        flex: 1,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    activeTabText: {
        color: '#ffffff',
        marginBottom: 6,
    },
    inactiveTabText: {
        color: '#94a3b8',
        marginBottom: 6,
    },
    activeTabIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '80%',
        height: 6,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    rankingTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playersRankingTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        elevation: 1,
    },
    filterBtnText: {
        fontWeight: '600',
        color: '#334155',
        fontSize: 14,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 120,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
    },
    leftSection: {
        marginRight: 14,
    },
    avatarContainer: {
        width: 54,
        height: 54,
        position: 'relative',
    },
    avatarPlaceholder: {
        width: 54,
        height: 54,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    rankBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        backgroundColor: '#000000',
    },
    rankBadgeText: {
        fontSize: 10,
        fontWeight: '800',
    },
    infoWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    columnName: {
        flex: 1.5,
        justifyContent: 'center',
        paddingRight: 4,
    },
    nameText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
    },
    rankText: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '700',
    },
    columnPoints: {
        flex: 1,
        alignItems: 'center',
    },
    columnPrize: {
        flex: 1.3,
        alignItems: 'flex-end',
    },
    labelStats: {
        fontSize: 10,
        color: '#64748b',
        fontWeight: '500',
        marginBottom: 2,
        fontStyle: 'italic',
    },
    valueStats: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
    },
    top3Container: {
        marginBottom: 20,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 4,
    },
    top3Gradient: {
        padding: 20,
        paddingTop: 30,
    },
    top3Avatars: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        paddingBottom: 10,
    },
    rank1Container: {
        alignItems: 'center',
        zIndex: 1,
    },
    rank2Container: {
        alignItems: 'center',
    },
    rank3Container: {
        alignItems: 'center',
    },
    avatarLarge: {
        width: 66,
        height: 66,
        borderRadius: 33,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarExtraLarge: {
        width: 86,
        height: 86,
        borderRadius: 43,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        overflow: 'hidden',
    },
    avatarImageLarge: {
        width: '100%',
        height: '100%',
    },
    avatarImageExtraLarge: {
        width: '100%',
        height: '100%',
    },
    rankBadgeTop3: {
        position: 'absolute',
        top: -12,
        backgroundColor: '#000',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    rank1Badge: {
        top: -15,
        backgroundColor: '#000',
    },
    rankBadgeTextTop3: {
        color: '#FFD700',
        fontSize: 10,
        fontWeight: '900',
    },
    top3Name: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1e293b',
        marginTop: 8,
        textAlign: 'center',
        width: 80,
    },
    top3Points: {
        fontSize: 12,
        color: '#FF8C00',
        fontWeight: '800',
    },
    userStatsStickyWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    userStatsCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    userStatItem: {
        alignItems: 'center',
        flex: 1,
    },
    userStatLabel: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    userStatValue: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1e293b',
    },
    userStatDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#e2e8f0',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 14,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingTop: 25,
        height: '65%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1e293b',
    },
    filterContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    categoriesList: {
        flex: 1.3,
        backgroundColor: '#f1f5f9',
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 15,
    },
    categoryActiveBar: {
        width: 5,
        height: 24,
        borderRadius: 3,
        marginRight: 10,
    },
    selectedCategoryItem: {
        backgroundColor: '#fff',
    },
    categoryText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
    },
    selectedCategoryText: {
        color: '#00A8A8',
        fontWeight: '900',
    },
    subCategoriesList: {
        flex: 2,
        paddingHorizontal: 25,
        paddingTop: 10,
    },
    subCategoryTitle: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: 'bold',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    subCategoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#cbd5e1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#00A8A8',
    },
    subCategoryText: {
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#008080',
        margin: 25,
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
});

export default Leaderboard;
