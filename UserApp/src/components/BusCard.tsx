import React, {useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {Colors} from '../theme/colors';
import {BusData} from '../types';

interface BusCardProps {
  bus: BusData;
  onPress: () => void;
  index: number;
}

export function BusCard({bus, onPress, index}: BusCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const statusColor =
    bus.status === 'Running'
      ? Colors.running
      : bus.status === 'Arriving'
      ? Colors.arriving
      : Colors.stopped;

  const statusBg =
    bus.status === 'Running'
      ? Colors.runningBg
      : bus.status === 'Arriving'
      ? Colors.arrivingBg
      : Colors.stoppedBg;

  const seatsColor =
    bus.availableSeats <= 5
      ? Colors.stopped
      : bus.availableSeats <= 15
      ? Colors.arriving
      : Colors.running;

  return (
    <Animated.View
      style={{opacity: fadeAnim, transform: [{translateY: slideAnim}]}}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.75}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.busIconContainer}>
            <Text style={styles.busIcon}>🚌</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.busNumber}>{bus.busNumber}</Text>
            <Text style={styles.routeName}>{bus.routeName}</Text>
          </View>
          <View style={[styles.statusBadge, {backgroundColor: statusBg}]}>
            <View
              style={[styles.statusDot, {backgroundColor: statusColor}]}
            />
            <Text style={[styles.statusText, {color: statusColor}]}>
              {bus.status}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Details Row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>DEPARTURE</Text>
            <Text style={styles.detailValue}>{bus.departureTime}</Text>
          </View>
          <View style={styles.detailSep} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>ETA</Text>
            <Text style={styles.detailValue}>{bus.estimatedArrivalTime}</Text>
          </View>
          <View style={styles.detailSep} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>SEATS</Text>
            <Text style={[styles.detailValue, {color: seatsColor}]}>
              {bus.availableSeats}/{bus.totalSeats}
            </Text>
          </View>
        </View>

        {/* Next Stop */}
        <View style={styles.nextStopRow}>
          <Text style={styles.nextStopLabel}>Next Stop: </Text>
          <Text style={styles.nextStopValue}>{bus.nextStop}</Text>
          <Text style={styles.arrowHint}> →</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
    marginBottom: 14,
    shadowColor: Colors.shadowColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  busIcon: {
    fontSize: 22,
  },
  headerInfo: {
    flex: 1,
  },
  busNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  routeName: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  detailSep: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  nextStopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: Colors.accentSubtle,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  nextStopLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  nextStopValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
  },
  arrowHint: {
    fontSize: 14,
    color: Colors.textMuted,
    marginLeft: 'auto',
  },
});
