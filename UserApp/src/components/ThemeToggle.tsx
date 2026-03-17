import React, {useRef, useEffect} from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Animated} from 'react-native';
import {useTheme} from '../theme/ThemeContext';

export function ThemeToggle() {
  const {isDark, toggleTheme, theme} = useTheme();
  const slideAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isDark ? 1 : 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isDark, slideAnim]);

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.08)',
          borderColor: theme.colors.border,
        },
      ]}>
      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: theme.colors.accent,
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, 24],
                }),
              },
            ],
          },
        ]}
      />
      <View style={styles.icons}>
        <Text style={styles.icon}>☀️</Text>
        <Text style={styles.icon}>🌙</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 54,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 2,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
    zIndex: 1,
  },
  icon: {
    fontSize: 13,
  },
});
