import io, { Socket } from 'socket.io-client';
import { BACKEND_URL } from './api';

let socket: Socket | null = null;

interface LocationUpdate {
  busId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export const initializeSocket = (): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(BACKEND_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason: string) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('error', (error: string) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const subscribeToLocationUpdates = (busId: string, callback: (location: LocationUpdate) => void) => {
  if (!socket) return;

  socket.on(`bus_location_${busId}`, (data: LocationUpdate) => {
    callback(data);
  });
};

export const unsubscribeFromLocationUpdates = (busId: string) => {
  if (!socket) return;

  socket.off(`bus_location_${busId}`);
};

export const subscribeToBusUpdates = (callback: (data: any) => void) => {
  if (!socket) return;

  socket.on('bus_updated', callback);
};

export const unsubscribeFromBusUpdates = () => {
  if (!socket) return;

  socket.off('bus_updated');
};

export const emitLocationUpdate = (busId: string, latitude: number, longitude: number) => {
  if (!socket) return;

  socket.emit('update_location', {
    busId,
    latitude,
    longitude,
    timestamp: Date.now(),
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initializeSocket,
  getSocket,
  subscribeToLocationUpdates,
  unsubscribeFromLocationUpdates,
  subscribeToBusUpdates,
  unsubscribeFromBusUpdates,
  emitLocationUpdate,
  disconnectSocket,
};
