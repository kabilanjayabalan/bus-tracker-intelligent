import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../theme/colors';
import {ProfileAvatar} from '../components/ProfileAvatar';
import {SourceDestinationInput} from '../components/SourceDestinationInput';
import {popularRoutes} from '../data/mockData';
import type {RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good Morning';
  }
  if (hour < 17) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
}

export function HomeScreen({navigation}: Props) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  const handleSearch = () => {
    if (!source.trim() || !destination.trim()) {
      Alert.alert('Missing Info', 'Please enter both source and destination.');
      return;
    }
    navigation.navigate('BusList', {source: source.trim(), destination: destination.trim()});
  };

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  const handleQuickRoute = (src: string, dest: string) => {
    setSource(src);
    setDestination(dest);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryBg} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.subtitle}>Where are you headed?</Text>
          </View>
          <ProfileAvatar onPress={() => {}} />
        </View>

        {/* Source/Destination Input */}
        <View style={styles.inputSection}>
          <SourceDestinationInput
            source={source}
            destination={destination}
            onSourceChange={setSource}
            onDestinationChange={setDestination}
            onSwap={handleSwap}
          />
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          activeOpacity={0.85}>
          <Text style={styles.searchEmoji}>🔍</Text>
          <Text style={styles.searchButtonText}>SEARCH BUSES</Text>
        </TouchableOpacity>

        {/* Popular Routes */}
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Popular Routes</Text>
          <View style={styles.routeGrid}>
            {popularRoutes.map((route, index) => (
              <TouchableOpacity
                key={index}
                style={styles.routeCard}
                onPress={() => handleQuickRoute(route.source, route.destination)}
                activeOpacity={0.7}>
                <Text style={styles.routeIcon}>🚌</Text>
                <Text style={styles.routeSource}>{route.source}</Text>
                <Text style={styles.routeArrow}>→</Text>
                <Text style={styles.routeDest}>{route.destination}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statValue}>150+</Text>
            <Text style={styles.statLabel}>Active Buses</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPurple]}>
            <Text style={styles.statEmoji}>🛣</Text>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Routes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏙</Text>
            <Text style={styles.statValue}>28</Text>
            <Text style={styles.statLabel}>Cities</Text>
          </View>
        </View>
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
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 10,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    height: 58,
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  searchEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryBg,
    letterSpacing: 1.5,
  },
  popularSection: {
    marginTop: 36,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  routeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  routeIcon: {
    fontSize: 14,
  },
  routeSource: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  routeArrow: {
    fontSize: 12,
    color: Colors.accent,
  },
  routeDest: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.accentSubtle,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    padding: 16,
    alignItems: 'center',
  },
  statCardPurple: {
    backgroundColor: Colors.purpleSubtle,
    borderColor: 'rgba(108, 92, 231, 0.3)',
  },
  statEmoji: {
    fontSize: 22,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
