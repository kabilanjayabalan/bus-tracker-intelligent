import React, {useEffect, useRef} from 'react';
import {TouchableOpacity, Text, StyleSheet, Animated, View} from 'react-native';
import {Colors} from '../theme/colors';

interface ViewMapButtonProps {
  onPress: () => void;
  isMapVisible: boolean;
}

export function ViewMapButton({onPress, isMapVisible}: ViewMapButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isMapVisible) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isMapVisible, pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        !isMapVisible && {transform: [{scale: pulseAnim}]},
      ]}>
      <TouchableOpacity
        style={[styles.button, isMapVisible && styles.buttonActive]}
        onPress={onPress}
        activeOpacity={0.8}>
        <View style={styles.content}>
          <Text style={styles.mapEmoji}>{isMapVisible ? '✕' : '🗺'}</Text>
          <Text style={styles.text}>
            {isMapVisible ? 'HIDE MAP' : 'VIEW IN MAP'}
          </Text>
        </View>
        {!isMapVisible && <View style={styles.glow} />}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  buttonActive: {
    backgroundColor: Colors.cardBgLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowOpacity: 0,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  mapEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryBg,
    letterSpacing: 1.5,
  },
  glow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
