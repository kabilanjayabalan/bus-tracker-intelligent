import React from 'react';
import {View, TextInput, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Colors} from '../theme/colors';

interface SourceDestinationInputProps {
  source: string;
  destination: string;
  onSourceChange: (text: string) => void;
  onDestinationChange: (text: string) => void;
  onSwap?: () => void;
}

export function SourceDestinationInput({
  source,
  destination,
  onSourceChange,
  onDestinationChange,
  onSwap,
}: SourceDestinationInputProps) {
  return (
    <View style={styles.container}>
      {/* Source Input */}
      <View style={styles.inputRow}>
        <View style={styles.dotContainer}>
          <View style={styles.sourceDot} />
          <View style={styles.dottedLine} />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>FROM</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter source location"
            placeholderTextColor={Colors.textMuted}
            value={source}
            onChangeText={onSourceChange}
          />
        </View>
      </View>

      {/* Swap Button */}
      <TouchableOpacity
        style={styles.swapButton}
        onPress={onSwap}
        activeOpacity={0.7}>
        <Text style={styles.swapIcon}>⇅</Text>
      </TouchableOpacity>

      {/* Destination Input */}
      <View style={styles.inputRow}>
        <View style={styles.dotContainer}>
          <View style={styles.destDot} />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>TO</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            placeholderTextColor={Colors.textMuted}
            value={destination}
            onChangeText={onDestinationChange}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    position: 'relative',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 14,
  },
  sourceDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  dottedLine: {
    width: 2,
    height: 40,
    backgroundColor: Colors.borderLight,
    marginTop: 6,
    borderRadius: 1,
  },
  destDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.purple,
    shadowColor: Colors.purple,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  inputWrapper: {
    flex: 1,
    paddingVertical: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  swapButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.purpleSubtle,
    borderWidth: 1,
    borderColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  swapIcon: {
    fontSize: 18,
    color: Colors.purple,
    fontWeight: '700',
  },
});
