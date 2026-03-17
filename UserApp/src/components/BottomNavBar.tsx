import React, {useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import {useTheme} from '../theme/ThemeContext';

interface BottomNavBarProps {
  activeTab: 'today' | 'search' | 'history';
  onTabPress: (tab: 'today' | 'search' | 'history') => void;
  onSearchPress: () => void;
}

function NavTab({
  icon,
  label,
  isActive,
  onPress,
  activeColor,
  mutedColor,
}: {
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
  activeColor: string;
  mutedColor: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {toValue: 0.88, duration: 80, useNativeDriver: true}),
      Animated.spring(scaleAnim, {toValue: 1, tension: 200, friction: 8, useNativeDriver: true}),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={[styles.tab, {transform: [{scale: scaleAnim}]}]}>
      <TouchableOpacity
        style={styles.tabInner}
        onPress={handlePress}
        activeOpacity={1}>
        {isActive && (
          <View style={[styles.activeIndicator, {backgroundColor: activeColor}]} />
        )}
        <Text style={[styles.tabIcon, {opacity: isActive ? 1 : 0.55}]}>{icon}</Text>
        <Text style={[styles.tabLabel, {color: isActive ? activeColor : mutedColor}]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function BottomNavBar({
  activeTab,
  onTabPress,
  onSearchPress,
}: BottomNavBarProps) {
  const {theme} = useTheme();
  const c = theme.colors;
  const fabScale = useRef(new Animated.Value(1)).current;

  const handleFabPressIn = () => {
    Animated.spring(fabScale, {toValue: 0.9, tension: 200, friction: 8, useNativeDriver: true}).start();
  };
  const handleFabPressOut = () => {
    Animated.spring(fabScale, {toValue: 1, tension: 200, friction: 8, useNativeDriver: true}).start();
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: c.bottomNavBg, borderTopColor: c.border},
      ]}>
      {/* Today's History */}
      <NavTab
        icon="🕐"
        label="Today"
        isActive={activeTab === 'today'}
        onPress={() => onTabPress('today')}
        activeColor={c.accent}
        mutedColor={c.textMuted}
      />

      {/* Search FAB */}
      <View style={styles.fabContainer}>
        <Animated.View style={{transform: [{scale: fabScale}]}}>
          <TouchableOpacity
            style={[
              styles.fab,
              {
                backgroundColor: c.accent,
                shadowColor: c.accent,
              },
            ]}
            onPress={onSearchPress}
            onPressIn={handleFabPressIn}
            onPressOut={handleFabPressOut}
            activeOpacity={1}>
            <Text style={styles.fabIcon}>🔍</Text>
          </TouchableOpacity>
        </Animated.View>
        <Text style={[styles.fabLabel, {color: c.textMuted}]}>Search</Text>
      </View>

      {/* Total History */}
      <NavTab
        icon="📋"
        label="History"
        isActive={activeTab === 'history'}
        onPress={() => onTabPress('history')}
        activeColor={c.accent}
        mutedColor={c.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
  },
  tab: {flex: 1},
  tabInner: {
    alignItems: 'center',
    paddingVertical: 6,
    position: 'relative',
  },
  tabIcon: {fontSize: 22, marginBottom: 4},
  tabLabel: {fontSize: 11, fontWeight: '600', letterSpacing: 0.2},
  activeIndicator: {
    position: 'absolute',
    top: -10,
    width: 24,
    height: 3,
    borderRadius: 1.5,
  },
  fabContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: -32,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
    marginBottom: 4,
  },
  fabIcon: {fontSize: 24},
  fabLabel: {fontSize: 11, fontWeight: '600', letterSpacing: 0.2},
});
