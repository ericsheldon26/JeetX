import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CategoryCard from '../../components/CategoryCard';
import { DEMO_GAME_CATEGORIES } from '../../api/demoData';
import { mapToStandardGameItems } from '../../utils/dataMapper';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';
import ScreenWrapper from '../../components/ScreenWrapper';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import JeetXLogo from '../../assets/Jeetxsmall.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = ['Quiz', 'Fantasy Prediction', 'Puzzle', 'Chess'];

const GameCategoriesScreen = () => {
  const [activeTab, setActiveTab] = useState('Quiz');
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [walletBalance] = useState('1,999'); // Demo balance
  const [unreadCount] = useState(2); // Demo unread

  const currentData = useMemo(() => {
    const rawData = DEMO_GAME_CATEGORIES[activeTab as keyof typeof DEMO_GAME_CATEGORIES] || [];
    return mapToStandardGameItems(rawData);
  }, [activeTab]);

  const handleCardPress = (item: any) => {
    console.log('Pressed Card:', item.title);
    if (activeTab === 'Quiz') {
      navigation.navigate('QuizEntry', {
        subCategoryId: item.id,
        subCategoryName: item.title
      });
    }
  };

  return (
    <ScreenWrapper
      style={styles.container}
      disableTopInset={true}
      statusBarColor="#02121a"
      statusBarStyle="light-content"
    >
      {/* Brand Header */}
      <LinearGradient colors={['#02121a', '#0d3648']} style={styles.header}>
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
        </View>
      </LinearGradient>

      {/* Navigation Tabs */}
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tabItem}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Area */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentData.map((item) => (
          <CategoryCard
            key={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
            onPress={() => handleCardPress(item)}
          />
        ))}
        
        {currentData.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No games available in this category yet.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F6',
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
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    width: scale(393),
    height: verticalScale(44),
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    marginTop: verticalScale(-10),
    zIndex: 10,
    // Note: React Native doesn't support inset box-shadow natively.
    // Approximating the look with the border and background.
  },
  tabBar: {
    paddingHorizontal: scale(16),
    height: '100%',
    alignItems: 'center',
  },
  tabItem: {
    marginRight: scale(28),
    height: '100%',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: moderateScale(14),
    color: '#718096',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  activeTabText: {
    color: '#008d9d',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: verticalScale(3),
    backgroundColor: '#008d9d',
    borderRadius: scale(2),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(16),
    paddingTop: scale(20),
    paddingBottom: verticalScale(100),
  },
  emptyState: {
    marginTop: verticalScale(60),
    alignItems: 'center',
  },
  emptyText: {
    color: '#A0AEC0',
    fontSize: moderateScale(14),
  },
});

export default GameCategoriesScreen;
