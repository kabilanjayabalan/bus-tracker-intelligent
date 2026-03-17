import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../theme/ThemeContext';

interface ProfileAvatarProps {
  name?: string;
  size?: number;
  onPress?: () => void;
}

export function ProfileAvatar({
  name = 'Vignesh',
  size = 44,
  onPress,
}: ProfileAvatarProps) {
  const {theme} = useTheme();
  const c = theme.colors;
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: c.accentGlow,
            borderColor: c.accent,
          },
        ]}>
        <Text style={[styles.initials, {fontSize: size * 0.36, color: c.accent}]}>
          {initials}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E5A0',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  initials: {
    fontWeight: '700',
    letterSpacing: 1,
  },
});
