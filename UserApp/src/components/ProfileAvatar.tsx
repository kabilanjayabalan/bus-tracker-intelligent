import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../theme/colors';

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
          },
        ]}>
        <View style={[styles.innerRing, {borderRadius: size / 2}]}>
          <Text style={[styles.initials, {fontSize: size * 0.36}]}>
            {initials}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.accentGlow,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  innerRing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.accent,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
