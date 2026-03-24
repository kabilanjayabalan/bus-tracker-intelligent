import { useEffect, useRef } from 'react';
import {
  initializeSocket,
  subscribeToLocationUpdates,
  unsubscribeFromLocationUpdates,
  getSocket,
} from './socketService';

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface UseRealtimeLocationProps {
  busId: string;
  onLocationUpdate: (location: LocationData) => void;
}

export const useRealtimeLocation = ({
  busId,
  onLocationUpdate,
}: UseRealtimeLocationProps) => {
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    // Initialize socket connection
    const socket = initializeSocket();

    // Subscribe to location updates
    subscribeToLocationUpdates(busId, (locationData) => {
      onLocationUpdate({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timestamp: locationData.timestamp,
      });
    });

    isSubscribedRef.current = true;

    // Cleanup on unmount
    return () => {
      if (isSubscribedRef.current) {
        unsubscribeFromLocationUpdates(busId);
        isSubscribedRef.current = false;
      }
    };
  }, [busId, onLocationUpdate]);

  const isConnected = () => {
    const socket = getSocket();
    return socket?.connected ?? false;
  };

  return { isConnected };
};

export default useRealtimeLocation;
