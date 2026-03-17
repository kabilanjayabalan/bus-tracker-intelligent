/**
 * Routo - Public Transport Live Location Passenger App
 */

import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/theme/ThemeContext';
import {AppNavigator} from './src/navigation/AppNavigator';

function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
