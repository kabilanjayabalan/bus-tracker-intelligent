import React, {useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useTheme} from '../theme/ThemeContext';
import {BusData} from '../types';

interface MapViewSectionProps {
  bus: BusData;
  userLocation?: {latitude: number; longitude: number};
  onClose?: () => void;
}

function generateMapHTML(
  bus: BusData,
  userLat: number,
  userLng: number,
  isDark: boolean,
  mapPxHeight: number,
): string {
  const stopsJSON = JSON.stringify(bus.stops);
  const routeJSON = JSON.stringify(bus.routeCoordinates);

  // Tile layers
  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  const bgColor = isDark ? '#0B0F2E' : '#F0F4F8';
  const accentColor = isDark ? '#00E5A0' : '#00C896';
  const popupBg = isDark ? '#1C2252' : '#ffffff';
  const popupText = isDark ? '#ffffff' : '#1A1D2E';

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { background: ${bgColor}; }
    body { background: ${bgColor}; width: 100%; height: ${mapPxHeight}px; overflow: hidden; }
    #map { width: 100%; height: ${mapPxHeight}px; }

    /* Bus marker with pulse */
    .bus-marker-wrap {
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bus-pulse {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: ${accentColor};
      opacity: 0.3;
      animation: pulse 2s infinite;
    }
    .bus-inner {
      position: relative;
      width: 28px;
      height: 28px;
      background: ${accentColor};
      border: 3px solid #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 0 16px ${accentColor}99;
      z-index: 2;
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.35; }
      70% { transform: scale(2.2); opacity: 0; }
      100% { transform: scale(1); opacity: 0; }
    }

    /* Source marker - green pin */
    .source-marker {
      width: 20px;
      height: 20px;
      background: #10B981;
      border: 3px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 12px #10B98180;
    }

    /* Destination marker - red diamond */
    .dest-marker {
      width: 18px;
      height: 18px;
      background: #EF4444;
      border: 3px solid #fff;
      border-radius: 3px;
      transform: rotate(45deg);
      box-shadow: 0 0 12px #EF444480;
    }

    /* Stop markers */
    .stop-marker {
      width: 10px;
      height: 10px;
      background: #FFAB00;
      border: 2px solid #fff;
      border-radius: 50%;
    }

    /* Popup styles */
    .leaflet-popup-content-wrapper {
      border-radius: 12px;
      background: ${popupBg};
      box-shadow: 0 4px 20px rgba(0,0,0,0.35);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .leaflet-popup-tip { background: ${popupBg}; }
    .leaflet-popup-content { margin: 8px 14px; }
    .popup-text {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: ${popupText};
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    try {
      var stops = ${stopsJSON};
      var routeCoords = ${routeJSON};
      var busLat = ${bus.currentLocation.latitude};
      var busLng = ${bus.currentLocation.longitude};
      var userLat = ${userLat};
      var userLng = ${userLng};

      var map = L.map('map', {
        zoomControl: true,
        attributionControl: false,
        preferCanvas: true
      }).setView([busLat, busLng], 12);

      L.tileLayer('${tileUrl}', {
        maxZoom: 18,
        subdomains: 'abc',
        crossOrigin: true
      }).addTo(map);

      // Route polyline with glow
      var routeLatLngs = routeCoords.map(function(c) { return [c.latitude, c.longitude]; });
      // Shadow line
      L.polyline(routeLatLngs, {
        color: '${accentColor}',
        weight: 8,
        opacity: 0.15
      }).addTo(map);
      // Main line
      L.polyline(routeLatLngs, {
        color: '${accentColor}',
        weight: 3.5,
        opacity: 0.85,
        lineJoin: 'round',
        lineCap: 'round'
      }).addTo(map);

      // Source marker (first stop)
      var srcIcon = L.divIcon({
        html: '<div class="source-marker"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        className: ''
      });
      L.marker([stops[0].latitude, stops[0].longitude], {icon: srcIcon})
        .addTo(map)
        .bindPopup('<div class="popup-text">🟢 ' + stops[0].name + ' (Start)</div>');

      // Destination marker (last stop)
      var destStop = stops[stops.length - 1];
      var destIcon = L.divIcon({
        html: '<div class="dest-marker"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        className: ''
      });
      L.marker([destStop.latitude, destStop.longitude], {icon: destIcon})
        .addTo(map)
        .bindPopup('<div class="popup-text">🔴 ' + destStop.name + ' (End)</div>');

      // Bus marker with pulse animation
      var busIcon = L.divIcon({
        html: '<div class="bus-marker-wrap"><div class="bus-pulse"></div><div class="bus-inner">🚌</div></div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        className: ''
      });
      var busMarker = L.marker([busLat, busLng], {icon: busIcon, zIndexOffset: 1000})
        .addTo(map)
        .bindPopup('<div class="popup-text">🚌 ${bus.busNumber}<br><small>Next: ${bus.nextStop}</small></div>')
        .openPopup();

      // User location marker
      var userIcon = L.divIcon({
        html: '<div style="width:14px;height:14px;background:#6C5CE7;border:3px solid #fff;border-radius:50%;box-shadow:0 0 12px #6C5CE780;"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        className: ''
      });
      L.marker([userLat, userLng], {icon: userIcon})
        .addTo(map)
        .bindPopup('<div class="popup-text">📍 Your Location</div>');

      // Intermediate stop markers (skip first and last)
      for (var i = 1; i < stops.length - 1; i++) {
        var si = L.divIcon({
          html: '<div class="stop-marker"></div>',
          iconSize: [10, 10],
          iconAnchor: [5, 5],
          className: ''
        });
        L.marker([stops[i].latitude, stops[i].longitude], {icon: si})
          .addTo(map)
          .bindPopup('<div class="popup-text">🚏 ' + stops[i].name + '</div>');
      }

      // Fit bounds to show full route
      var allPoints = routeLatLngs.concat([[userLat, userLng]]);
      try {
        map.fitBounds(L.latLngBounds(allPoints), {padding: [40, 40]});
      } catch(e) {
        map.setView([busLat, busLng], 11);
      }

    } catch(err) {
      document.body.innerHTML = '<div style="color:white;padding:20px;font-family:sans-serif;">Map error: ' + err.message + '</div>';
    }
  </script>
</body>
</html>`;
}

export function MapViewSection({bus, userLocation, onClose}: MapViewSectionProps) {
  const {theme} = useTheme();
  const c = theme.colors;
  const userLat = userLocation?.latitude ?? 10.9601;
  const userLng = userLocation?.longitude ?? 78.0766;
  const {height: SCREEN_HEIGHT} = Dimensions.get('window');

  // Map occupies 65% of screen minus the handle bar (~52px)
  const mapPixelHeight = Math.floor(SCREEN_HEIGHT * 0.65 - 52);
  const mapHTML = generateMapHTML(bus, userLat, userLng, theme.isDark, mapPixelHeight);

  const handlePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(handlePulse, {toValue: 0.5, duration: 1200, useNativeDriver: true}),
        Animated.timing(handlePulse, {toValue: 1, duration: 1200, useNativeDriver: true}),
      ]),
    ).start();
  }, [handlePulse]);

  return (
    <View style={[styles.container, {backgroundColor: c.bottomSheetBg}]}>
      {/* Handle bar */}
      <View style={styles.handleRow}>
        <Animated.View style={[styles.handle, {backgroundColor: c.handleColor, opacity: handlePulse}]} />
        {onClose && (
          <TouchableOpacity
            style={[styles.closeButton, {backgroundColor: c.cardBgLight, borderColor: c.border}]}
            onPress={onClose}
            activeOpacity={0.7}>
            <Text style={[styles.closeText, {color: c.textPrimary}]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Map title */}
      <View style={[styles.mapTitleRow, {borderBottomColor: c.border}]}>
        <View style={[styles.statusDot, {backgroundColor: c.running}]} />
        <Text style={[styles.mapTitle, {color: c.textPrimary}]}>
          Live Location — {bus.busNumber}
        </Text>
        <View style={[styles.etaBadge, {backgroundColor: c.accentSubtle, borderColor: c.borderAccent}]}>
          <Text style={[styles.etaText, {color: c.accent}]}>ETA {bus.estimatedArrivalTime}</Text>
        </View>
      </View>

      {/* WebView map */}
      <View style={[styles.mapWrapper, {height: mapPixelHeight}]}>
        <WebView
          source={{html: mapHTML}}
          style={styles.webview}
          scrollEnabled={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          mixedContentMode="compatibility"
          originWhitelist={['*']}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          onError={e => console.warn('WebView error:', e.nativeEvent)}
          renderLoading={() => (
            <View style={[styles.loadingView, {backgroundColor: c.primaryBg}]}>
              <Text style={{color: c.textSecondary, fontSize: 14}}>Loading map…</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {fontSize: 15, fontWeight: '700'},
  mapTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mapTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  etaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  etaText: {fontSize: 12, fontWeight: '700'},
  mapWrapper: {
    width: '100%',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
