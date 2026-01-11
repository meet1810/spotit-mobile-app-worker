import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/theme';

// Import Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import WorkScreen from '../screens/WorkScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TaskOnboardingScreen from '../screens/TaskOnboardingScreen';
import WorkCompletionScreen from '../screens/WorkCompletionScreen';
import SuccessScreen from '../screens/SuccessScreen';
import FailureScreen from '../screens/FailureScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.secondary,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    height: 60,
                    paddingBottom: 5,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="MainApp" component={MainTabs} />
                <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
                <Stack.Screen name="TaskOnboarding" component={TaskOnboardingScreen} />
                <Stack.Screen name="WorkCompletion" component={WorkCompletionScreen} />
                <Stack.Screen name="Success" component={SuccessScreen} />
                <Stack.Screen name="Failure" component={FailureScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
