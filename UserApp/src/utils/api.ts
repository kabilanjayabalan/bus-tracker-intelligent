// API Configuration and HTTP client
import {Alert} from 'react-native';

// Backend URL - Update this to match your backend server
// For Android Emulator: http://10.0.2.2:5000
// For iOS Simulator: http://localhost:5000
// For Physical Device: http://<YOUR_MACHINE_IP>:5000
const BACKEND_URL = 'http://10.0.2.2:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    GOOGLE_LOGIN: '/api/auth/google',
  },
  // Bus endpoints
  BUS: {
    GET_ALL: '/api/bus',
    SEARCH: '/api/bus/search',
    GET_BY_ID: (id: string) => `/api/bus/${id}`,
    UPDATE_LOCATION: '/api/bus/location',
  },
  // Routes endpoints
  ROUTES: {
    GET_ALL: '/api/routes',
    SEARCH: '/api/routes/search',
  },
  // Ticket endpoints
  TICKETS: {
    BOOK: '/api/ticket/book',
    GET_MY_TICKETS: '/api/ticket/my-tickets',
  },
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<ApiResponse<T>> {
  try {
    const url = `${BACKEND_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    // Add auth token if provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'An error occurred',
        message: data.message || 'An error occurred',
      };
    }

    return {
      success: true,
      data,
      message: data.message,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }
}

// ==================== AUTH APIs ====================

export const authAPI = {
  signup: async (name: string, email: string, password: string) => {
    return apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({name, email, password}),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({email, password}),
    });
  },

  googleLogin: async (token: string) => {
    return apiRequest('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({token}),
    });
  },
};

// ==================== BUS APIs ====================

export const busAPI = {
  getAllBuses: async () => {
    return apiRequest('/api/bus', {
      method: 'GET',
    });
  },

  searchBuses: async (source: string, destination: string, date?: string) => {
    const params = new URLSearchParams();
    if (source) params.append('source', source);
    if (destination) params.append('destination', destination);
    if (date) params.append('date', date);

    return apiRequest(`/api/bus/search?${params.toString()}`, {
      method: 'GET',
    });
  },

  getBusById: async (busId: string, token?: string) => {
    return apiRequest(`/api/bus/${busId}`, {
      method: 'GET',
    }, token);
  },

  updateBusLocation: async (busId: string, latitude: number, longitude: number, token?: string) => {
    return apiRequest('/api/bus/location', {
      method: 'PUT',
      body: JSON.stringify({busId, latitude, longitude}),
    }, token);
  },
};

// ==================== ROUTE APIs ====================

export const routeAPI = {
  getAllRoutes: async () => {
    return apiRequest('/api/routes', {
      method: 'GET',
    });
  },

  searchRoutes: async (source: string, destination: string) => {
    const params = new URLSearchParams();
    params.append('source', source);
    params.append('destination', destination);

    return apiRequest(`/api/routes/search?${params.toString()}`, {
      method: 'GET',
    });
  },
};

// ==================== TICKET APIs ====================

export const ticketAPI = {
  bookTicket: async (busId: string, seats: number[], token?: string) => {
    return apiRequest('/api/ticket/book', {
      method: 'POST',
      body: JSON.stringify({busId, seats}),
    }, token);
  },

  getMyTickets: async (token?: string) => {
    return apiRequest('/api/ticket/my-tickets', {
      method: 'GET',
    }, token);
  },
};

export default {
  authAPI,
  busAPI,
  routeAPI,
  ticketAPI,
  BACKEND_URL,
  API_ENDPOINTS,
};
