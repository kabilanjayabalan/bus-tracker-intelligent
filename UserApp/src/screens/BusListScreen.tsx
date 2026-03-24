import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '../theme/ThemeContext';
import {BusCard} from '../components/BusCard';
import {busAPI} from '../utils/api';
import type {RootStackParamList, BusData} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BusList'>;

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton() {
  const {theme} = useTheme();
  const c = theme.colors;
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {toValue: 1, duration: 750, useNativeDriver: true}),
        Animated.timing(pulseAnim, {toValue: 0.4, duration: 750, useNativeDriver: true}),
      ]),
    ).start();
  }, [pulseAnim]);

  return (
    <View style={{paddingHorizontal: 20}}>
      {[1, 2, 3].map(i => (
        <Animated.View
          key={i}
          style={[
            skeletonStyles.card,
            {backgroundColor: c.cardBg, borderColor: c.border, opacity: pulseAnim},
          ]}>
          {/* icon placeholder */}
          <View style={[skeletonStyles.iconBox, {backgroundColor: c.borderLight}]} />
          <View style={{flex: 1, gap: 8}}>
            <View style={[skeletonStyles.line, {width: '55%', backgroundColor: c.borderLight}]} />
            <View style={[skeletonStyles.line, {width: '38%', backgroundColor: c.borderLight}]} />
            <View style={[skeletonStyles.line, {width: '72%', backgroundColor: c.borderLight, marginTop: 10}]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
    gap: 14,
  },
  iconBox: {width: 46, height: 46, borderRadius: 14},
  line: {height: 14, borderRadius: 7},
});

// ─────────────────────────────────────────────────────────────────────────────

export function BusListScreen({navigation, route}: Props) {
  const {theme} = useTheme();
  const c = theme.colors;
  const {source, destination} = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [buses, setBuses] = useState<BusData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Header fade-in
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {toValue: 1, duration: 400, useNativeDriver: true}).start();
    fetchBuses();
  }, [source, destination]);

  const fetchBuses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Search buses from backend
      const response = await busAPI.searchBuses(source, destination);

      if (response.success && response.data) {
        // Format backend response to match BusData type
        const formattedBuses = Array.isArray(response.data) ? response.data : [];
        setBuses(formattedBuses);
      } else {
        setError(response.error || 'Failed to fetch buses');
        Alert.alert('Error', response.error || 'Failed to fetch buses');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusPress = (bus: BusData) => navigation.navigate('BusDetails', {bus});

  return (
    <View style={[styles.container, {backgroundColor: c.primaryBg}]}>
      <StatusBar barStyle={c.statusBarStyle} backgroundColor={c.primaryBg} />

      {/* ── Header ── */}
      <Animated.View style={[styles.header, {opacity: headerAnim}]}>
        <TouchableOpacity
          style={[styles.backButton, {backgroundColor: c.cardBg, borderColor: c.border}]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={[styles.backArrow, {color: c.textPrimary}]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.routeRow}>
            {/* Source chip */}
            <View style={[styles.cityChip, {backgroundColor: c.cardBg, borderColor: c.border}]}>
              <Text style={[styles.cityDot, {color: '#10B981'}]}>●</Text>
              <Text style={[styles.routeCity, {color: c.textPrimary}]}>{source}</Text>
            </View>
            <View style={[styles.arrowLine, {backgroundColor: c.accent}]} />
            <Text style={[styles.arrowIcon, {color: c.accent}]}>›</Text>
            <View style={[styles.arrowLine, {backgroundColor: c.accent}]} />
            {/* Dest chip */}
            <View style={[styles.cityChip, {backgroundColor: c.cardBg, borderColor: c.border}]}>
              <Text style={[styles.cityDot, {color: '#EF4444'}]}>◆</Text>
              <Text style={[styles.routeCity, {color: c.textPrimary}]}>{destination}</Text>
            </View>
          </View>
          <Text style={[styles.busCount, {color: c.textSecondary}]}>
            {isLoading ? '⌛ Searching for buses…' : `${buses.length} buses available`}
          </Text>
        </View>
      </Animated.View>

      {/* ── Info banner ── */}
      <View style={[styles.infoBanner, {backgroundColor: c.cardBg, borderColor: c.border}]}>
        {[
          {icon: '🕐', label: 'Live tracking'},
          {icon: '📍', label: 'Real-time ETA'},
          {icon: '💺', label: 'Seat info'},
        ].map((info, i, arr) => (
          <React.Fragment key={i}>
            <View style={styles.infoItem}>
              <Text style={styles.infoEmoji}>{info.icon}</Text>
              <Text style={[styles.infoText, {color: c.textSecondary}]}>{info.label}</Text>
            </View>
            {i < arr.length - 1 && (
              <View style={[styles.infoSep, {backgroundColor: c.border}]} />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* ── Content ── */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : buses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🚌</Text>
          <Text style={[styles.emptyTitle, {color: c.textPrimary}]}>No buses found</Text>
          <Text style={[styles.emptySubtitle, {color: c.textSecondary}]}>
            No buses are available for{'\n'}
            <Text style={{fontWeight: '700'}}>{source} → {destination}</Text>
            {'\n'}right now. Try a different route or check back later.
          </Text>
          <TouchableOpacity
            style={[styles.tryAgainBtn, {backgroundColor: c.accentSubtle, borderColor: c.borderAccent}]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Text style={[styles.tryAgainText, {color: c.accent}]}>← Try another route</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={buses}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <BusCard bus={item} index={index} onPress={() => handleBusPress(item)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  backArrow: {fontSize: 22, fontWeight: '300'},
  headerInfo: {flex: 1},

  routeRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  cityDot: {fontSize: 10},
  routeCity: {fontSize: 14, fontWeight: '700'},
  arrowLine: {width: 10, height: 2, borderRadius: 1},
  arrowIcon: {fontSize: 16, fontWeight: '700'},
  busCount: {fontSize: 13, marginTop: 6},

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  infoItem: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5},
  infoEmoji: {fontSize: 14},
  infoText: {fontSize: 12, fontWeight: '600'},
  infoSep: {width: 1, height: 20},

  listContent: {paddingHorizontal: 16, paddingBottom: 20},

  emptyState: {alignItems: 'center', paddingTop: 70, paddingHorizontal: 40},
  emptyEmoji: {fontSize: 70, marginBottom: 18},
  emptyTitle: {fontSize: 22, fontWeight: '800', marginBottom: 10},
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  tryAgainBtn: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  tryAgainText: {fontSize: 14, fontWeight: '700'},
});
