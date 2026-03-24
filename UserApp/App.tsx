/**
 * Routo - Public Transport Live Location Passenger App
 */

import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/theme/ThemeContext';
import {AuthProvider} from './src/utils/AuthContext';
import {AppNavigator} from './src/navigation/AppNavigator';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
