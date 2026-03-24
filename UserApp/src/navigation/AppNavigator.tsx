import React from 'react';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ActivityIndicator, View} from 'react-native';
import {LoginScreen} from '../screens/LoginScreen';
import {SignupScreen} from '../screens/SignupScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {BusListScreen} from '../screens/BusListScreen';
import {BusDetailsScreen} from '../screens/BusDetailsScreen';
import {useTheme} from '../theme/ThemeContext';
import {useAuth} from '../utils/AuthContext';
import type {RootStackParamList} from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Auth Stack - for unauthenticated users
function AuthStack() {
  const {theme} = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {backgroundColor: theme.colors.primaryBg},
      }}>
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{animationEnabled: false}}
      />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

// App Stack - for authenticated users
function AppStack() {
  const {theme} = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {backgroundColor: theme.colors.primaryBg},
      }}>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{animationEnabled: false}}
      />
      <Stack.Screen name="BusList" component={BusListScreen} />
      <Stack.Screen name="BusDetails" component={BusDetailsScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const {theme} = useTheme();
  const {isSignedIn, isLoading} = useAuth();

  const navigationTheme = {
    ...(theme.isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.primaryBg,
      card: theme.colors.cardBg,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      primary: theme.colors.accent,
    },
  };

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.primaryBg,
        }}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {isSignedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
