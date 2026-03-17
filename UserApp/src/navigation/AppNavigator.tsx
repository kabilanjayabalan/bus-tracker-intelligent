import React from 'react';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '../screens/LoginScreen';
import {SignupScreen} from '../screens/SignupScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {BusListScreen} from '../screens/BusListScreen';
import {BusDetailsScreen} from '../screens/BusDetailsScreen';
import {useTheme} from '../theme/ThemeContext';
import type {RootStackParamList} from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const {theme} = useTheme();

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

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {backgroundColor: theme.colors.primaryBg},
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BusList" component={BusListScreen} />
        <Stack.Screen name="BusDetails" component={BusDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
