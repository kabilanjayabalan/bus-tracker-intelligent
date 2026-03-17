import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '../theme/ThemeContext';
import {ThemeToggle} from '../components/ThemeToggle';
import {ProfileAvatar} from '../components/ProfileAvatar';
import {SourceDestinationInput} from '../components/SourceDestinationInput';
import {BottomNavBar} from '../components/BottomNavBar';
import {popularRoutes, searchHistory} from '../data/mockData';
import type {RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) {return 'Good Morning';}
  if (h < 17) {return 'Good Afternoon';}
  return 'Good Evening';
}

export function HomeScreen({navigation}: Props) {
  const {theme} = useTheme();
  const c = theme.colors;
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [activeTab, setActiveTab] = useState<'today' | 'search' | 'history'>('search');

  // Entrance animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  // Search button scale
  const searchScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {toValue: 1, duration: 500, useNativeDriver: true}),
      Animated.spring(slideAnim, {toValue: 0, tension: 50, friction: 10, useNativeDriver: true}),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const onSearchPressIn = () => {
    Animated.spring(searchScale, {toValue: 0.95, tension: 200, friction: 8, useNativeDriver: true}).start();
  };
  const onSearchPressOut = () => {
    Animated.spring(searchScale, {toValue: 1, tension: 200, friction: 8, useNativeDriver: true}).start();
  };

  const handleSearch = () => {
    if (activeTab !== 'search') {
      setActiveTab('search');
      return;
    }
    if (!source.trim() || !destination.trim()) {
      Alert.alert('Missing Info', 'Please enter both source and destination.');
      return;
    }
    navigation.navigate('BusList', {source: source.trim(), destination: destination.trim()});
  };

  const handleSwap = () => {setSource(destination); setDestination(source);};
  const handleGps = () => setSource('Current Location');
  const handleQuickRoute = (src: string, dest: string) => {
    setSource(src);
    setDestination(dest);
    setActiveTab('search');
  };

  const todayHistory = searchHistory.filter(s => s.date === '2026-03-16');

  const renderSearchContent = () => (
    <Animated.View style={{opacity: fadeAnim, transform: [{translateY: slideAnim}]}}>
      {/* Input card */}
      <View style={[styles.inputCard, {backgroundColor: c.cardBg, borderColor: c.border}]}>
        <SourceDestinationInput
          source={source}
          destination={destination}
          onSourceChange={setSource}
          onDestinationChange={setDestination}
          onSwap={handleSwap}
          onGpsPress={handleGps}
        />
      </View>

      {/* Search button */}
      <Animated.View style={{transform: [{scale: searchScale}]}}>
        <TouchableOpacity
          style={[styles.searchButton, {backgroundColor: c.accent, shadowColor: c.accent}]}
          onPress={handleSearch}
          onPressIn={onSearchPressIn}
          onPressOut={onSearchPressOut}
          activeOpacity={1}>
          <Text style={styles.searchBtnIcon}>🔍</Text>
          <Text style={[styles.searchBtnText, {color: theme.isDark ? '#0B0F2E' : '#FFFFFF'}]}>
            SEARCH BUSES
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Popular routes */}
      <View style={styles.popularSection}>
        <Text style={[styles.sectionTitle, {color: c.textPrimary}]}>Popular Routes</Text>
        <View style={styles.routeGrid}>
          {popularRoutes.map((route, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.routeChip, {backgroundColor: c.cardBg, borderColor: c.border}]}
              onPress={() => handleQuickRoute(route.source, route.destination)}
              activeOpacity={0.7}>
              <Text style={styles.routeChipIcon}>🚌</Text>
              <Text style={[styles.routeChipFrom, {color: c.textPrimary}]}>{route.source}</Text>
              <Text style={[styles.routeChipArrow, {color: c.accent}]}>→</Text>
              <Text style={[styles.routeChipTo, {color: c.accent}]}>{route.destination}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        {[
          {emoji: '🚌', value: '150+', label: 'Active Buses', bg: c.accentSubtle, border: c.borderAccent},
          {emoji: '🛣', value: '45', label: 'Routes', bg: c.purpleSubtle, border: 'rgba(108,92,231,0.25)'},
          {emoji: '🏙', value: '28', label: 'Cities', bg: c.accentSubtle, border: c.borderAccent},
        ].map((stat, i) => (
          <View
            key={i}
            style={[styles.statCard, {backgroundColor: stat.bg, borderColor: stat.border}]}>
            <Text style={styles.statEmoji}>{stat.emoji}</Text>
            <Text style={[styles.statValue, {color: c.textPrimary}]}>{stat.value}</Text>
            <Text style={[styles.statLabel, {color: c.textSecondary}]}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderHistoryList = (data: typeof searchHistory) => (
    <View style={styles.historySection}>
      {data.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={[styles.emptyTitle, {color: c.textPrimary}]}>No history yet</Text>
          <Text style={[styles.emptyText, {color: c.textSecondary}]}>
            Your recent bus searches will appear here.
          </Text>
        </View>
      ) : (
        data.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.historyCard, {backgroundColor: c.cardBg, borderColor: c.border}]}
            onPress={() => handleQuickRoute(item.source, item.destination)}
            activeOpacity={0.7}>
            <View style={[styles.historyIconBox, {backgroundColor: c.accentSubtle}]}>
              <Text style={{fontSize: 20}}>🚌</Text>
            </View>
            <View style={styles.historyInfo}>
              <Text style={[styles.historyRoute, {color: c.textPrimary}]}>
                {item.source} → {item.destination}
              </Text>
              <Text style={[styles.historyMeta, {color: c.textMuted}]}>
                {item.date} · {item.busesFound} buses found
              </Text>
            </View>
            <Text style={[styles.historyArrow, {color: c.textMuted}]}>›</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: c.primaryBg}]}>
      <StatusBar barStyle={c.statusBarStyle} backgroundColor={c.primaryBg} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* ───── TOP BAR ───── */}
        <View style={styles.topBar}>
          {/* Logo + Toggle */}
          <View style={styles.topLeft}>
            <View style={[styles.logoBox, {backgroundColor: c.accentSubtle, borderColor: c.borderAccent}]}>
              <Text style={styles.logoEmoji}>🚌</Text>
            </View>
            <View style={styles.logoTextCol}>
              <Text style={[styles.appName, {color: c.accent}]}>ROUTO</Text>
              <Text style={[styles.appTagline, {color: c.textMuted}]}>Live Tracking</Text>
            </View>
            <ThemeToggle />
          </View>

          {/* Profile */}
          <ProfileAvatar onPress={() => {}} />
        </View>

        {/* ───── GREETING ───── */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greeting, {color: c.textPrimary}]}>{getGreeting()} 👋</Text>
          <Text style={[styles.subtitle, {color: c.textSecondary}]}>
            {activeTab === 'search'
              ? 'Where are you headed today?'
              : activeTab === 'today'
              ? "Today's searches"
              : 'All search history'}
          </Text>
        </View>

        {/* ───── TAB CONTENT ───── */}
        <View style={styles.contentSection}>
          {activeTab === 'search' && renderSearchContent()}
          {activeTab === 'today' && renderHistoryList(todayHistory)}
          {activeTab === 'history' && renderHistoryList(searchHistory)}
        </View>
      </ScrollView>

      {/* ───── BOTTOM NAV ───── */}
      <BottomNavBar
        activeTab={activeTab}
        onTabPress={setActiveTab}
        onSearchPress={handleSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollView: {flex: 1},
  scrollContent: {paddingBottom: 24},

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 8,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {fontSize: 22},
  logoTextCol: {marginRight: 4},
  appName: {fontSize: 16, fontWeight: '900', letterSpacing: 3},
  appTagline: {fontSize: 10, fontWeight: '500', letterSpacing: 0.5, marginTop: -1},

  // Greeting
  greetingSection: {paddingHorizontal: 22, paddingTop: 18, paddingBottom: 4},
  greeting: {fontSize: 26, fontWeight: '800', letterSpacing: -0.5},
  subtitle: {fontSize: 14, marginTop: 5, fontWeight: '400'},

  // Content
  contentSection: {paddingHorizontal: 20, marginTop: 18},

  // Input card wrapper
  inputCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // Search button
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    height: 56,
    marginBottom: 28,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    gap: 10,
  },
  searchBtnIcon: {fontSize: 20},
  searchBtnText: {fontSize: 16, fontWeight: '800', letterSpacing: 1.5},

  // Popular routes
  popularSection: {marginTop: 4},
  sectionTitle: {fontSize: 17, fontWeight: '700', marginBottom: 12, letterSpacing: -0.2},
  routeGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  routeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 5,
  },
  routeChipIcon: {fontSize: 13},
  routeChipFrom: {fontSize: 13, fontWeight: '600'},
  routeChipArrow: {fontSize: 11},
  routeChipTo: {fontSize: 13, fontWeight: '600'},

  // Stats
  statsSection: {flexDirection: 'row', marginTop: 22, gap: 10},
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
  },
  statEmoji: {fontSize: 20, marginBottom: 6},
  statValue: {fontSize: 20, fontWeight: '800'},
  statLabel: {fontSize: 11, marginTop: 4, fontWeight: '600', letterSpacing: 0.3},

  // History
  historySection: {paddingTop: 4},
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  historyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  historyInfo: {flex: 1},
  historyRoute: {fontSize: 15, fontWeight: '600'},
  historyMeta: {fontSize: 12, marginTop: 3},
  historyArrow: {fontSize: 22, fontWeight: '300'},

  // Empty state
  emptyState: {alignItems: 'center', paddingVertical: 60},
  emptyEmoji: {fontSize: 52, marginBottom: 14},
  emptyTitle: {fontSize: 18, fontWeight: '700', marginBottom: 6},
  emptyText: {fontSize: 14, textAlign: 'center', lineHeight: 20},
});
