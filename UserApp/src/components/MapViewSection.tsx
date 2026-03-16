import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {WebView} from 'react-native-webview';
import {Colors} from '../theme/colors';
import {BusData} from '../types';

interface MapViewSectionProps {
  bus: BusData;
  isVisible: boolean;
  userLocation?: {latitude: number; longitude: number};
}

function generateMapHTML(
  bus: BusData,
  userLat: number,
  userLng: number,
): string {
  const stopsJSON = JSON.stringify(bus.stops);
  const routeJSON = JSON.stringify(bus.routeCoordinates);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0B0F2E; }
    #map { width: 100%; height: 100vh; border-radius: 0; }
    .bus-marker {
      background: #00E5A0;
      border: 3px solid #fff;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      box-shadow: 0 0 16px rgba(0, 229, 160, 0.6);
    }
    .user-marker {
      background: #6C5CE7;
      border: 3px solid #fff;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      box-shadow: 0 0 12px rgba(108, 92, 231, 0.6);
    }
    .stop-marker {
      background: #FFAB00;
      border: 2px solid #fff;
      border-radius: 50%;
      width: 12px;
      height: 12px;
    }
    .bus-popup {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #0B0F2E;
    }
    .leaflet-popup-content-wrapper {
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var stops = ${stopsJSON};
    var routeCoords = ${routeJSON};
    var busLat = ${bus.currentLocation.latitude};
    var busLng = ${bus.currentLocation.longitude};
    var userLat = ${userLat};
    var userLng = ${userLng};

    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([busLat, busLng], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    // Route polyline
    var routeLatLngs = routeCoords.map(function(c) { return [c.latitude, c.longitude]; });
    L.polyline(routeLatLngs, {
      color: '#00E5A0',
      weight: 4,
      opacity: 0.7,
      smoothFactor: 1,
      dashArray: null
    }).addTo(map);

    // Bus marker
    var busIcon = L.divIcon({
      html: '<div class="bus-marker"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      className: ''
    });
    var busMarker = L.marker([busLat, busLng], { icon: busIcon }).addTo(map);
    busMarker.bindPopup('<div class="bus-popup">🚌 ' + '${bus.busNumber}' + '</div>').openPopup();

    // User marker
    var userIcon = L.divIcon({
      html: '<div class="user-marker"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      className: ''
    });
    L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
      .bindPopup('<div class="bus-popup">📍 You</div>');

    // Stop markers
    stops.forEach(function(stop) {
      var stopIcon = L.divIcon({
        html: '<div class="stop-marker"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        className: ''
      });
      L.marker([stop.latitude, stop.longitude], { icon: stopIcon }).addTo(map)
        .bindPopup('<div class="bus-popup">' + stop.name + '</div>');
    });

    // Fit bounds to show route
    var allPoints = routeLatLngs.concat([[userLat, userLng]]);
    map.fitBounds(allPoints, { padding: [30, 30] });
  </script>
</body>
</html>`;
}

export function MapViewSection({bus, isVisible, userLocation}: MapViewSectionProps) {
  const heightAnim = useRef(new Animated.Value(0)).current;

  const userLat = userLocation?.latitude ?? 10.9601;
  const userLng = userLocation?.longitude ?? 78.0766;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isVisible ? 400 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isVisible, heightAnim]);

  const mapHTML = generateMapHTML(bus, userLat, userLng);

  return (
    <Animated.View style={[styles.container, {height: heightAnim}]}>
      {isVisible && (
        <View style={styles.mapWrapper}>
          <WebView
            source={{html: mapHTML}}
            style={styles.webview}
            scrollEnabled={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            mixedContentMode="compatibility"
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  mapWrapper: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
  },
});
