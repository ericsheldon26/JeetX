import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

interface CategoryCardProps {
  title: string;
  description: string;
  icon?: string | number | null; // URI or require()
  onPress?: () => void;
  onHelpPress?: () => void;
  style?: StyleProp<ViewStyle>;
  iconBackgroundColor?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon,
  onPress,
  onHelpPress,
  style,
  iconBackgroundColor = 'rgba(174, 189, 189, 0.2)',
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.container, style]}
    >
      {/* Icon Section */}
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        {icon ? (
          typeof icon === 'string' ? (
            <Image source={{ uri: icon }} style={styles.icon} resizeMode="contain" />
          ) : (
            <Image source={icon} style={styles.icon} resizeMode="contain" />
          )
        ) : (
          <FontAwesome name="image" size={moderateScale(30)} color="#ccc" />
        )}
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
      </View>

      {/* Right Action Icons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onHelpPress} style={styles.helpIcon}>
          <FontAwesome name="question-circle" size={moderateScale(18)} color="#A0AEC0" />
        </TouchableOpacity>
        
        <View style={styles.arrowContainer}>
          <FontAwesome name="arrow-up" size={moderateScale(14)} color="#008d9d" style={{ transform: [{ rotate: '45deg' }] }} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: scale(361),
    height: verticalScale(92),
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    marginBottom: verticalScale(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignSelf: 'center',
    // shadow matching 0px 2px 4px 0px #0000000F
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.058, // #0F is approx 15/255 = 0.058
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  icon: {
    width: scale(40),
    height: scale(40),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#1e293b',
    fontFamily: 'Montserrat-Bold',
    marginBottom: verticalScale(4),
  },
  description: {
    fontSize: moderateScale(12),
    color: '#64748b',
    lineHeight: moderateScale(16),
    fontFamily: 'OpenSans-Regular',
  },
  actions: {
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: verticalScale(2),
  },
  helpIcon: {
    padding: scale(4),
  },
  arrowContainer: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: '#E6F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
});

export default CategoryCard;
