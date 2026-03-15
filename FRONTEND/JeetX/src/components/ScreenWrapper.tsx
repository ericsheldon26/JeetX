import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBarStyle, StatusBar, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  statusBarColor?: string;
  statusBarStyle?: StatusBarStyle;
  backgroundColor?: string;
  disableTopInset?: boolean;
  disableBottomInset?: boolean;
}


/**
 * ScreenWrapper provides a consistent, production-grade safe area handling
 * that avoids native Yoga layout crashes in React Native New Architecture.
 */
const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  statusBarColor = 'transparent',
  statusBarStyle = 'light-content',
  backgroundColor = '#0f172a', // Default dark theme background
  disableTopInset = false,
  disableBottomInset = false,
}) => {
  const insets = useSafeAreaInsets();


  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarColor}
        translucent
      />
      <View
        style={[
          styles.content,
          {
            paddingTop: disableTopInset ? 0 : insets.top,
            paddingBottom: disableBottomInset ? 0 : insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >

        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenWrapper;
