import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import XSvg from '../assets/X.svg';

// Screens
import HomeScreen from '../pages/HomeScreen';
import Leaderboard from '../screen/leaderboard/Leaderboard';
import MyEvents from '../screen/events/MyEvents';
import ReferEarn from '../screen/money/ReferEarn';
import ProfileScreen from '../pages/ProfileScreen';
import Notifications from '../pages/Notifications';
import AddMoney from '../screen/money/AddMoney';
import QuizzGamePlay from '../screen/home/QuizzGamePlay';
import MyTransactionsDeposits from '../screen/money/MyTransactionsDeposits';
import Withdraw from '../pages/Withdraw';
import WalletPreviousScreen from '../screen/money/WalletPreviousScreen';
import RecentlyPlayed from '../pages/RecentlyPlayed';
import YourSkillScore from '../pages/YourSkillScore';
import QuizEntryScreen from '../screen/home/QuizEntryScreen';
import PracticeMode from '../screen/home/PracticeMode';
import QuizResultScreen from '../screen/home/QuizResultScreen';

// Auth Screens
import Splash from '../screen/loginsignup/Splash';
import LoginOptions from '../screen/loginsignup/LoginOptions';
import LoginPassword from '../screen/loginsignup/LoginPassword';
import LoginOTP from '../screen/loginsignup/LoginOTP';
import Register from '../screen/loginsignup/Register';
import ForgotPassword1 from '../screen/loginsignup/ForgotPassword1';
import ForgotPassword2 from '../screen/loginsignup/ForgotPassword2';
import ForgotPassword3 from '../screen/loginsignup/ForgotPassword3';
import ReferralInput from '../screen/loginsignup/ReferralInput';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomTabBarButton = ({ children, onPress }: any) => (
    <TouchableOpacity
        style={{
            top: 12,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow
        }}
        onPress={onPress}
    >
        {children}
    </TouchableOpacity>
);

const RotatingLogo = ({ focused }: { focused: boolean }) => {
    const spinValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        animation.start();

        return () => {
            animation.stop();
        };
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const AnimatedX = Animated.createAnimatedComponent(XSvg);

    return (
        <AnimatedX
            width={85}
            height={100}
            style={{
                transform: [{ rotate: spin }],
            }}
        />
    );
};

const TabNavigator = () => (
    <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
            tabBarShowLabel: true,
            tabBarStyle: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                borderTopColor: '#e2e8f0',
                height: 80,
                paddingBottom: 10,
                paddingTop: 10,
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
            },
            tabBarActiveTintColor: '#008d9d',
            tabBarInactiveTintColor: '#94a3b8',
            headerShown: false,
        }}
    >

        <Tab.Screen
            name="Leaderboard"
            component={Leaderboard}
            options={{
                tabBarIcon: ({ focused }) => (
                    <FontAwesome name="bar-chart" color={focused ? '#008d9d' : '#94a3b8'} size={focused ? 28 : 24} />
                ),
                tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 4 }
            }}
        />
        <Tab.Screen
            name="Events"
            component={MyEvents}
            options={{
                tabBarIcon: ({ focused }) => (
                    <FontAwesome name="gamepad" color={focused ? '#008d9d' : '#94a3b8'} size={focused ? 28 : 24} />
                ),
                tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 4 }
            }}
        />
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
                tabBarIcon: ({ focused }) => (
                    <RotatingLogo focused={focused} />
                ),
                tabBarButton: (props) => (
                    <CustomTabBarButton {...props} />
                ),
                tabBarLabel: () => null
            }}
        />
        <Tab.Screen
            name="Referrals"
            component={ReferEarn}
            options={{
                tabBarIcon: ({ focused }) => (
                    <FontAwesome name="gift" color={focused ? '#008d9d' : '#94a3b8'} size={focused ? 28 : 24} />
                ),
                tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 4 }
            }}
        />
        <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
                tabBarIcon: ({ focused }) => (
                    <FontAwesome name="user" color={focused ? '#008d9d' : '#94a3b8'} size={focused ? 28 : 24} />
                ),
                tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 4 }
            }}
        />
    </Tab.Navigator >
);

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Login" component={LoginOptions} />
            <Stack.Screen name="LoginPassword" component={LoginPassword} />
            <Stack.Screen name="LoginOTP" component={LoginOTP} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword1} />
            <Stack.Screen name="ForgotPassword2" component={ForgotPassword2} />
            <Stack.Screen name="ForgotPassword3" component={ForgotPassword3} />
            <Stack.Screen name="ReferralInput" component={ReferralInput} options={{ presentation: 'transparentModal' }} />

            <Stack.Screen name="Main" component={TabNavigator} />

            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="AddMoney" component={AddMoney} />
            <Stack.Screen name="QuizzGamePlay" component={QuizzGamePlay} />
            <Stack.Screen name="QuizEntry" component={QuizEntryScreen} />
            <Stack.Screen name="PracticeMode" component={PracticeMode} />
            <Stack.Screen name="MyTransactionsDeposits" component={MyTransactionsDeposits} />
            <Stack.Screen name="Withdraw" component={Withdraw} />
            <Stack.Screen name="WalletPreviousScreen" component={WalletPreviousScreen} />
            <Stack.Screen name="RecentlyPlayed" component={RecentlyPlayed} />
            <Stack.Screen name="YourSkillScore" component={YourSkillScore} />
            <Stack.Screen name="QuizResult" component={QuizResultScreen} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#eab308',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
});

export default AppNavigator;
