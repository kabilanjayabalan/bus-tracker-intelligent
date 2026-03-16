import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../theme/colors';
import {BusCard} from '../components/BusCard';
import {mockBuses} from '../data/mockData';
import type {RootStackParamList, BusData} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BusList'>;

export function BusListScreen({navigation, route}: Props) {
  const {source, destination} = route.params;

  const handleBusPress = (bus: BusData) => {
    navigation.navigate('BusDetails', {bus});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryBg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.routeRow}>
            <Text style={styles.routeCity}>{source}</Text>
            <View style={styles.routeArrowContainer}>
              <View style={styles.routeLine} />
              <Text style={styles.routeArrowIcon}>→</Text>
              <View style={styles.routeLine} />
            </View>
            <Text style={styles.routeCity}>{destination}</Text>
          </View>
          <Text style={styles.busCount}>
            {mockBuses.length} buses available
          </Text>
        </View>
      </View>

      {/* Route Info Banner */}
      <View style={styles.infoBanner}>
        <View style={styles.infoItem}>
          <Text style={styles.infoEmoji}>🕐</Text>
          <Text style={styles.infoText}>Live tracking</Text>
        </View>
        <View style={styles.infoSep} />
        <View style={styles.infoItem}>
          <Text style={styles.infoEmoji}>📍</Text>
          <Text style={styles.infoText}>Real-time ETA</Text>
        </View>
        <View style={styles.infoSep} />
        <View style={styles.infoItem}>
          <Text style={styles.infoEmoji}>💺</Text>
          <Text style={styles.infoText}>Seat info</Text>
        </View>
      </View>

      {/* Bus List */}
      <FlatList
        data={mockBuses}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <BusCard
            bus={item}
            index={index}
            onPress={() => handleBusPress(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
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
    marginRight: 16,
  },
  backArrow: {
    fontSize: 22,
    color: Colors.textPrimary,
    fontWeight: '300',
  },
  headerInfo: {
    flex: 1,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeCity: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  routeArrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  routeLine: {
    width: 12,
    height: 2,
    backgroundColor: Colors.accent,
    borderRadius: 1,
  },
  routeArrowIcon: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '700',
    marginHorizontal: 2,
  },
  busCount: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  infoEmoji: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  infoSep: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
