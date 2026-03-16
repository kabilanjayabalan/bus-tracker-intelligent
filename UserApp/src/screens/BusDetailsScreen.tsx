import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../theme/colors';
import {ViewMapButton} from '../components/ViewMapButton';
import {MapViewSection} from '../components/MapViewSection';
import type {RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BusDetails'>;

export function BusDetailsScreen({navigation, route}: Props) {
  const {bus} = route.params;
  const [isMapVisible, setIsMapVisible] = useState(false);

  const toggleMap = () => {
    setIsMapVisible(!isMapVisible);
  };

  // Determine current stop index for the progress indicator
  const currentStopIndex = bus.stops.findIndex(
    stop =>
      Math.abs(stop.latitude - bus.currentLocation.latitude) < 0.01 &&
      Math.abs(stop.longitude - bus.currentLocation.longitude) < 0.01,
  );

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryBg} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bus Details</Text>
          <View style={styles.backButton} />
        </View>

        {/* Bus Number & Route Card */}
        <View style={styles.mainCard}>
          <View style={styles.busHeader}>
            <View style={styles.busIconLarge}>
              <Text style={styles.busEmoji}>🚌</Text>
            </View>
            <View style={styles.busMainInfo}>
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
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💺</Text>
            <Text style={styles.statValue}>{bus.availableSeats}</Text>
            <Text style={styles.statLabel}>Available</Text>
            <Text style={styles.statSub}>of {bus.totalSeats} seats</Text>
          </View>
          <View style={[styles.statCard, styles.statCardAccent]}>
            <Text style={styles.statEmoji}>⏱</Text>
            <Text style={[styles.statValue, {color: Colors.accent}]}>
              {bus.estimatedArrivalTime}
            </Text>
            <Text style={styles.statLabel}>ETA</Text>
            <Text style={styles.statSub}>to your stop</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📍</Text>
            <Text style={styles.statValue} numberOfLines={1}>
              {bus.nextStop}
            </Text>
            <Text style={styles.statLabel}>Next Stop</Text>
            <Text style={styles.statSub}>upcoming</Text>
          </View>
        </View>

        {/* Route Progress */}
        <View style={styles.routeSection}>
          <Text style={styles.sectionTitle}>Route Progress</Text>
          <View style={styles.routeTimeline}>
            {bus.stops.map((stop, index) => {
              const isPassed = index <= currentStopIndex;
              const isCurrent = index === currentStopIndex;
              const isLast = index === bus.stops.length - 1;

              return (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineDotCol}>
                    <View
                      style={[
                        styles.timelineDot,
                        isPassed && styles.timelineDotPassed,
                        isCurrent && styles.timelineDotCurrent,
                      ]}>
                      {isCurrent && (
                        <Text style={styles.busDotEmoji}>🚌</Text>
                      )}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          isPassed && styles.timelineLinePassed,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineInfo}>
                    <Text
                      style={[
                        styles.timelineStopName,
                        isPassed && styles.timelineStopNamePassed,
                        isCurrent && styles.timelineStopNameCurrent,
                      ]}>
                      {stop.name}
                    </Text>
                    {isCurrent && (
                      <Text style={styles.currentLabel}>Bus is here</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* View Map Button */}
        <ViewMapButton onPress={toggleMap} isMapVisible={isMapVisible} />

        {/* Map Section */}
        <MapViewSection bus={bus} isVisible={isMapVisible} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: Colors.textPrimary,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  mainCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  busHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.accentSubtle,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  busEmoji: {
    fontSize: 28,
  },
  busMainInfo: {
    flex: 1,
  },
  busNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  routeName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    alignItems: 'center',
  },
  statCardAccent: {
    borderColor: Colors.borderAccent,
    backgroundColor: Colors.accentSubtle,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  statSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  routeSection: {
    marginHorizontal: 20,
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  routeTimeline: {},
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDotCol: {
    alignItems: 'center',
    width: 32,
    marginRight: 14,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.cardBgLight,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotPassed: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accent,
  },
  timelineDotCurrent: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accent,
    borderWidth: 3,
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  busDotEmoji: {
    fontSize: 12,
  },
  timelineLine: {
    width: 3,
    height: 32,
    backgroundColor: Colors.borderLight,
    borderRadius: 1.5,
  },
  timelineLinePassed: {
    backgroundColor: Colors.accent,
  },
  timelineInfo: {
    flex: 1,
    paddingBottom: 24,
    paddingTop: 0,
  },
  timelineStopName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  timelineStopNamePassed: {
    color: Colors.textSecondary,
  },
  timelineStopNameCurrent: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 16,
  },
  currentLabel: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  bottomSpacer: {
    height: 30,
  },
});
