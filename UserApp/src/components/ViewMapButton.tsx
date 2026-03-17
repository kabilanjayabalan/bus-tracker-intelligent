import React, {useRef} from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Animated} from 'react-native';
import {useTheme} from '../theme/ThemeContext';

interface ViewMapButtonProps {
  onPress: () => void;
}

export function ViewMapButton({onPress}: ViewMapButtonProps) {
  const {theme} = useTheme();
  const c = theme.colors;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {toValue: 0.96, tension: 200, friction: 8, useNativeDriver: true}).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {toValue: 1, tension: 200, friction: 8, useNativeDriver: true}).start();
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: c.accent, shadowColor: c.accent}]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}>
          {/* Glow shimmer */}
          <View style={styles.glow} />
          <View style={styles.content}>
            <Text style={styles.mapEmoji}>🗺️</Text>
            <Text style={[styles.text, {color: theme.isDark ? '#0B0F2E' : '#FFFFFF'}]}>
              VIEW IN MAP
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {marginHorizontal: 20, marginVertical: 16},
  button: {
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  content: {flexDirection: 'row', alignItems: 'center', zIndex: 2, gap: 10},
  mapEmoji: {fontSize: 22},
  text: {fontSize: 16, fontWeight: '800', letterSpacing: 1.5},
});
