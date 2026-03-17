import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '../theme/ThemeContext';
import {ViewMapButton} from '../components/ViewMapButton';
import {MapViewSection} from '../components/MapViewSection';
import type {RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BusDetails'>;
const {height: SCREEN_HEIGHT} = Dimensions.get('window');
// The bottom sheet takes up 78% of screen including the handle+title bar
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.78;

export function BusDetailsScreen({navigation, route}: Props) {
  const {theme} = useTheme();
  const c = theme.colors;
  const {bus} = route.params;
  const [isMapVisible, setIsMapVisible] = useState(false);

  // Slide from bottom (starts off-screen below)
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showMap = () => {
    setIsMapVisible(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 45,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {toValue: 1, duration: 280, useNativeDriver: true}),
    ]).start();
  };

  const hideMap = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {toValue: SHEET_HEIGHT, duration: 280, useNativeDriver: true}),
      Animated.timing(fadeAnim, {toValue: 0, duration: 200, useNativeDriver: true}),
    ]).start(() => setIsMapVisible(false));
  };

  const currentStopIndex = bus.stops.findIndex(
    stop =>
      Math.abs(stop.latitude - bus.currentLocation.latitude) < 0.01 &&
      Math.abs(stop.longitude - bus.currentLocation.longitude) < 0.01,
  );

  const statusColor =
    bus.status === 'Running' ? c.running : bus.status === 'Arriving' ? c.arriving : c.stopped;
  const statusBg =
    bus.status === 'Running' ? c.runningBg : bus.status === 'Arriving' ? c.arrivingBg : c.stoppedBg;

  return (
    <View style={[styles.container, {backgroundColor: c.primaryBg}]}>
      <StatusBar barStyle={c.statusBarStyle} backgroundColor={c.primaryBg} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, {backgroundColor: c.cardBg, borderColor: c.border}]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Text style={[styles.backArrow, {color: c.textPrimary}]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: c.textPrimary}]}>Bus Details</Text>
          <View style={styles.backButton} />
        </View>

        {/* ── Main Bus Card ── */}
        <View
          style={[
            styles.mainCard,
            {backgroundColor: c.cardBg, borderColor: c.border, shadowColor: c.shadowColor},
          ]}>
          <View style={styles.busHeader}>
            <View style={[styles.busIconLarge, {backgroundColor: c.accentSubtle, borderColor: c.borderAccent}]}>
              <Text style={{fontSize: 28}}>🚌</Text>
            </View>
            <View style={styles.busMainInfo}>
              <Text style={[styles.busNumber, {color: c.textPrimary}]}>{bus.busNumber}</Text>
              <Text style={[styles.routeName, {color: c.textSecondary}]}>{bus.routeName}</Text>
            </View>
            <View style={[styles.statusBadge, {backgroundColor: statusBg}]}>
              <View style={[styles.statusDot, {backgroundColor: statusColor}]} />
              <Text style={[styles.statusText, {color: statusColor}]}>{bus.status}</Text>
            </View>
          </View>
        </View>

        {/* ── Stats Row ── */}
        <View style={styles.statsRow}>
          {/* Seats */}
          <View style={[styles.statCard, {backgroundColor: c.cardBg, borderColor: c.border}]}>
            <Text style={styles.statEmoji}>💺</Text>
            <Text style={[styles.statValue, {color: c.textPrimary}]}>{bus.availableSeats}</Text>
            <Text style={[styles.statLabel, {color: c.textSecondary}]}>Available</Text>
            <Text style={[styles.statSub, {color: c.textMuted}]}>of {bus.totalSeats} seats</Text>
          </View>
          {/* ETA */}
          <View style={[styles.statCard, {backgroundColor: c.accentSubtle, borderColor: c.borderAccent}]}>
            <Text style={styles.statEmoji}>⏱</Text>
            <Text style={[styles.statValue, {color: c.accent}]}>{bus.estimatedArrivalTime}</Text>
            <Text style={[styles.statLabel, {color: c.textSecondary}]}>ETA</Text>
            <Text style={[styles.statSub, {color: c.textMuted}]}>to your stop</Text>
          </View>
          {/* Next Stop */}
          <View style={[styles.statCard, {backgroundColor: c.cardBg, borderColor: c.border}]}>
            <Text style={styles.statEmoji}>📍</Text>
            <Text style={[styles.statValue, {color: c.textPrimary}]} numberOfLines={1}>
              {bus.nextStop}
            </Text>
            <Text style={[styles.statLabel, {color: c.textSecondary}]}>Next Stop</Text>
            <Text style={[styles.statSub, {color: c.textMuted}]}>upcoming</Text>
          </View>
        </View>

        {/* ── Seat availability bar ── */}
        <View style={[styles.seatBarCard, {backgroundColor: c.cardBg, borderColor: c.border}]}>
          <View style={styles.seatBarHeader}>
            <Text style={[styles.seatBarLabel, {color: c.textSecondary}]}>Seat Availability</Text>
            <Text style={[styles.seatBarCount, {color: c.accent}]}>
              {bus.availableSeats}/{bus.totalSeats}
            </Text>
          </View>
          <View style={[styles.seatBarBg, {backgroundColor: c.borderLight}]}>
            <View
              style={[
                styles.seatBarFill,
                {
                  width: `${(bus.availableSeats / bus.totalSeats) * 100}%` as any,
                  backgroundColor:
                    bus.availableSeats <= 5 ? c.stopped
                    : bus.availableSeats <= 15 ? c.arriving
                    : c.running,
                },
              ]}
            />
          </View>
        </View>

        {/* ── Route Progress ── */}
        <View style={[styles.routeSection, {backgroundColor: c.cardBg, borderColor: c.border}]}>
          <Text style={[styles.sectionTitle, {color: c.textPrimary}]}>Route Progress</Text>
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
                      {backgroundColor: c.cardBgLight, borderColor: c.borderLight},
                      isPassed && {backgroundColor: c.accentGlow, borderColor: c.accent},
                      isCurrent && [styles.timelineDotCurrent, {shadowColor: c.accent}],
                    ]}>
                    {isCurrent && <Text style={{fontSize: 12}}>🚌</Text>}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        {backgroundColor: c.borderLight},
                        isPassed && {backgroundColor: c.accent},
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineInfo}>
                  <Text
                    style={[
                      styles.timelineStopName,
                      {color: c.textMuted},
                      isPassed && {color: c.textSecondary},
                      isCurrent && {color: c.accent, fontWeight: '700', fontSize: 16},
                    ]}>
                    {stop.name}
                  </Text>
                  {isCurrent && (
                    <Text style={[styles.currentLabel, {color: c.accent}]}>🔵 Bus is here</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* ── View Map Button ── */}
        <ViewMapButton onPress={showMap} />
        <View style={{height: 30}} />
      </ScrollView>

      {/* ── Map Bottom Sheet ── */}
      {isMapVisible && (
        <View
          style={[StyleSheet.absoluteFill, {justifyContent: 'flex-end'}]}
          pointerEvents="box-none">
          {/* Backdrop */}
          <Animated.View style={[styles.backdrop, {opacity: fadeAnim}]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={hideMap}
              activeOpacity={1}
            />
          </Animated.View>

          {/* Sheet — fixed height, slides from below */}
          <Animated.View
            style={[
              styles.bottomSheet,
              {transform: [{translateY: slideAnim}]},
            ]}>
            <MapViewSection bus={bus} onClose={hideMap} />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollView: {flex: 1},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {fontSize: 22, fontWeight: '300'},
  headerTitle: {fontSize: 18, fontWeight: '700'},

  mainCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 14,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  busHeader: {flexDirection: 'row', alignItems: 'center'},
  busIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  busMainInfo: {flex: 1},
  busNumber: {fontSize: 22, fontWeight: '800', letterSpacing: 0.5},
  routeName: {fontSize: 14, marginTop: 3},
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {width: 8, height: 8, borderRadius: 4, marginRight: 6},
  statusText: {fontSize: 13, fontWeight: '700'},

  statsRow: {flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 14},
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statEmoji: {fontSize: 20, marginBottom: 6},
  statValue: {fontSize: 17, fontWeight: '800', marginTop: 2, textAlign: 'center'},
  statLabel: {fontSize: 11, fontWeight: '600', marginTop: 4, letterSpacing: 0.3},
  statSub: {fontSize: 10, marginTop: 2},

  // Seat bar
  seatBarCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  seatBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seatBarLabel: {fontSize: 13, fontWeight: '600'},
  seatBarCount: {fontSize: 13, fontWeight: '700'},
  seatBarBg: {height: 8, borderRadius: 4, overflow: 'hidden'},
  seatBarFill: {height: '100%', borderRadius: 4},

  routeSection: {
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {fontSize: 16, fontWeight: '700', marginBottom: 20},
  timelineItem: {flexDirection: 'row', alignItems: 'flex-start'},
  timelineDotCol: {alignItems: 'center', width: 32, marginRight: 14},
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotCurrent: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  timelineLine: {width: 3, height: 32, borderRadius: 1.5},
  timelineInfo: {flex: 1, paddingBottom: 24},
  timelineStopName: {fontSize: 15, fontWeight: '500'},
  currentLabel: {fontSize: 12, fontWeight: '600', marginTop: 3},

  // Bottom sheet
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  bottomSheet: {
    height: SHEET_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -6},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
});
