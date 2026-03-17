import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {allLocations} from '../data/mockData';

interface SourceDestinationInputProps {
  source: string;
  destination: string;
  onSourceChange: (text: string) => void;
  onDestinationChange: (text: string) => void;
  onSwap?: () => void;
  onGpsPress?: () => void;
}

export function SourceDestinationInput({
  source,
  destination,
  onSourceChange,
  onDestinationChange,
  onSwap,
  onGpsPress,
}: SourceDestinationInputProps) {
  const {theme} = useTheme();
  const c = theme.colors;
  const [focusedField, setFocusedField] = useState<'source' | 'dest' | null>(null);
  const sourceBorderAnim = useRef(new Animated.Value(0)).current;
  const destBorderAnim = useRef(new Animated.Value(0)).current;

  const animateFocus = (anim: Animated.Value, val: number) => {
    Animated.timing(anim, {toValue: val, duration: 200, useNativeDriver: false}).start();
  };

  const getSuggestions = (query: string) => {
    if (query.length < 1) {return [];}
    return allLocations
      .filter(
        loc =>
          loc.toLowerCase().startsWith(query.toLowerCase()) &&
          loc.toLowerCase() !== query.toLowerCase(),
      )
      .slice(0, 5);
  };

  const sourceSuggestions = focusedField === 'source' ? getSuggestions(source) : [];
  const destSuggestions = focusedField === 'dest' ? getSuggestions(destination) : [];

  const sourceBorderColor = sourceBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [c.border, c.accent],
  });
  const destBorderColor = destBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [c.border, c.accent],
  });

  return (
    <View style={styles.outerContainer}>
      {/* Source Field */}
      <Animated.View
        style={[
          styles.fieldCard,
          {
            backgroundColor: c.cardBg,
            borderColor: sourceBorderColor,
          },
        ]}>
        <View style={styles.iconBox}>
          <View style={[styles.greenDot]} />
        </View>
        <View style={styles.fieldDivider} />
        <View style={styles.textSection}>
          <Text style={[styles.fieldLabel, {color: c.textMuted}]}>FROM</Text>
          <TextInput
            style={[styles.fieldInput, {color: c.textPrimary}]}
            placeholder="Enter source location"
            placeholderTextColor={c.textMuted}
            value={source}
            onChangeText={onSourceChange}
            onFocus={() => {
              setFocusedField('source');
              animateFocus(sourceBorderAnim, 1);
            }}
            onBlur={() => {
              setTimeout(() => setFocusedField(null), 200);
              animateFocus(sourceBorderAnim, 0);
            }}
          />
        </View>
        {onGpsPress && (
          <TouchableOpacity
            style={[styles.gpsBtn, {backgroundColor: c.accentSubtle, borderColor: c.borderAccent}]}
            onPress={onGpsPress}
            activeOpacity={0.7}>
            <Text style={styles.gpsBtnIcon}>📌</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Source Suggestions */}
      {sourceSuggestions.length > 0 && (
        <View
          style={[
            styles.suggestBox,
            {backgroundColor: c.cardBgLight, borderColor: c.border},
          ]}>
          {sourceSuggestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.suggestItem,
                {borderBottomColor: c.border},
                index === sourceSuggestions.length - 1 && {borderBottomWidth: 0},
              ]}
              onPress={() => {
                onSourceChange(item);
                setFocusedField(null);
              }}>
              <Text style={[styles.suggestIcon, {color: c.textMuted}]}>📍</Text>
              <Text style={[styles.suggestText, {color: c.textPrimary}]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Connector line + Swap button */}
      <View style={styles.connectorRow}>
        <View style={styles.connectorLeft}>
          <View style={[styles.connectorLine, {backgroundColor: c.borderLight}]} />
        </View>
        <TouchableOpacity
          style={[styles.swapBtn, {backgroundColor: c.cardBg, borderColor: c.borderLight}]}
          onPress={onSwap}
          activeOpacity={0.7}>
          <Text style={[styles.swapIcon, {color: c.accent}]}>⇅</Text>
        </TouchableOpacity>
      </View>

      {/* Destination Field */}
      <Animated.View
        style={[
          styles.fieldCard,
          {
            backgroundColor: c.cardBg,
            borderColor: destBorderColor,
          },
        ]}>
        <View style={styles.iconBox}>
          <View style={[styles.redDot]} />
        </View>
        <View style={styles.fieldDivider} />
        <View style={styles.textSection}>
          <Text style={[styles.fieldLabel, {color: c.textMuted}]}>TO</Text>
          <TextInput
            style={[styles.fieldInput, {color: c.textPrimary}]}
            placeholder="Enter destination"
            placeholderTextColor={c.textMuted}
            value={destination}
            onChangeText={onDestinationChange}
            onFocus={() => {
              setFocusedField('dest');
              animateFocus(destBorderAnim, 1);
            }}
            onBlur={() => {
              setTimeout(() => setFocusedField(null), 200);
              animateFocus(destBorderAnim, 0);
            }}
          />
        </View>
      </Animated.View>

      {/* Destination Suggestions */}
      {destSuggestions.length > 0 && (
        <View
          style={[
            styles.suggestBox,
            {backgroundColor: c.cardBgLight, borderColor: c.border},
          ]}>
          {destSuggestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.suggestItem,
                {borderBottomColor: c.border},
                index === destSuggestions.length - 1 && {borderBottomWidth: 0},
              ]}
              onPress={() => {
                onDestinationChange(item);
                setFocusedField(null);
              }}>
              <Text style={[styles.suggestIcon, {color: c.textMuted}]}>📍</Text>
              <Text style={[styles.suggestText, {color: c.textPrimary}]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    gap: 0,
  },
  fieldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  greenDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },
  redDot: {
    width: 16,
    height: 16,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
    transform: [{rotate: '45deg'}],
  },
  fieldDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'transparent',
    marginHorizontal: 12,
    opacity: 0,
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  fieldInput: {
    fontSize: 16,
    fontWeight: '500',
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },
  gpsBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    flexShrink: 0,
  },
  gpsBtnIcon: {
    fontSize: 15,
  },
  connectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    paddingHorizontal: 0,
  },
  connectorLeft: {
    flex: 1,
    paddingLeft: 24,
  },
  connectorLine: {
    height: 1,
    flex: 1,
  },
  swapBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  swapIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
  suggestBox: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  suggestIcon: {
    fontSize: 14,
  },
  suggestText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
