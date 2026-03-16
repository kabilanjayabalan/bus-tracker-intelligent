export interface BusStop {
  name: string;
  latitude: number;
  longitude: number;
}

export interface BusData {
  id: string;
  busNumber: string;
  routeName: string;
  totalSeats: number;
  availableSeats: number;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  estimatedArrivalTime: string;
  nextStop: string;
  departureTime: string;
  status: 'Running' | 'Arriving' | 'Stopped';
  stops: BusStop[];
  routeCoordinates: Array<{ latitude: number; longitude: number }>;
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  BusList: { source: string; destination: string };
  BusDetails: { bus: BusData };
};
