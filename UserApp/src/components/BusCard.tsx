import React, {useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {BusData} from '../types';

interface BusCardProps {
  bus: BusData;
  onPress: () => void;
  index: number;
}

export function BusCard({bus, onPress, index}: BusCardProps) {
  const {theme} = useTheme();
  const c = theme.colors;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {toValue: 1, duration: 400, delay: index * 100, useNativeDriver: true}),
      Animated.timing(slideAnim, {toValue: 0, duration: 400, delay: index * 100, useNativeDriver: true}),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const statusColor = bus.status === 'Running' ? c.running : bus.status === 'Arriving' ? c.arriving : c.stopped;
  const statusBg = bus.status === 'Running' ? c.runningBg : bus.status === 'Arriving' ? c.arrivingBg : c.stoppedBg;
  const seatsColor = bus.availableSeats <= 5 ? c.stopped : bus.availableSeats <= 15 ? c.arriving : c.running;

  return (
    <Animated.View style={{opacity: fadeAnim, transform: [{translateY: slideAnim}]}}>
      <TouchableOpacity
        style={[styles.card, {backgroundColor: c.cardBg, borderColor: c.border, shadowColor: c.shadowColor}]}
        onPress={onPress}
        activeOpacity={0.75}>
        <View style={styles.header}>
          <View style={[styles.busIconContainer, {backgroundColor: c.accentSubtle}]}>
            <Text style={styles.busIcon}>🚌</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.busNumber, {color: c.textPrimary}]}>{bus.busNumber}</Text>
            <Text style={[styles.routeName, {color: c.textSecondary}]}>{bus.routeName}</Text>
          </View>
          <View style={[styles.statusBadge, {backgroundColor: statusBg}]}>
            <View style={[styles.statusDot, {backgroundColor: statusColor}]} />
            <Text style={[styles.statusText, {color: statusColor}]}>{bus.status}</Text>
          </View>
        </View>

        <View style={[styles.divider, {backgroundColor: c.border}]} />

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, {color: c.textMuted}]}>DEPARTURE</Text>
            <Text style={[styles.detailValue, {color: c.textPrimary}]}>{bus.departureTime}</Text>
          </View>
          <View style={[styles.detailSep, {backgroundColor: c.border}]} />
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, {color: c.textMuted}]}>ETA</Text>
            <Text style={[styles.detailValue, {color: c.textPrimary}]}>{bus.estimatedArrivalTime}</Text>
          </View>
          <View style={[styles.detailSep, {backgroundColor: c.border}]} />
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, {color: c.textMuted}]}>SEATS</Text>
            <Text style={[styles.detailValue, {color: seatsColor}]}>{bus.availableSeats}/{bus.totalSeats}</Text>
          </View>
        </View>

        <View style={[styles.nextStopRow, {backgroundColor: c.accentSubtle}]}>
          <Text style={[styles.nextStopLabel, {color: c.textSecondary}]}>Next Stop: </Text>
          <Text style={[styles.nextStopValue, {color: c.accent}]}>{bus.nextStop}</Text>
          <Text style={[styles.arrowHint, {color: c.textMuted}]}> →</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 14, shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5},
  header: {flexDirection: 'row', alignItems: 'center'},
  busIconContainer: {width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14},
  busIcon: {fontSize: 22},
  headerInfo: {flex: 1},
  busNumber: {fontSize: 17, fontWeight: '700', letterSpacing: 0.3},
  routeName: {fontSize: 13, marginTop: 2},
  statusBadge: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20},
  statusDot: {width: 7, height: 7, borderRadius: 3.5, marginRight: 6},
  statusText: {fontSize: 12, fontWeight: '700', letterSpacing: 0.3},
  divider: {height: 1, marginVertical: 14},
  detailsRow: {flexDirection: 'row', alignItems: 'center'},
  detailItem: {flex: 1, alignItems: 'center'},
  detailLabel: {fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4},
  detailValue: {fontSize: 15, fontWeight: '600'},
  detailSep: {width: 1, height: 30},
  nextStopRow: {flexDirection: 'row', alignItems: 'center', marginTop: 14, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10},
  nextStopLabel: {fontSize: 13},
  nextStopValue: {fontSize: 13, fontWeight: '600'},
  arrowHint: {fontSize: 14, marginLeft: 'auto'},
});
