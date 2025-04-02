import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorData = error.response.data;
      
      // Silently handle specific endpoints
      const silentEndpoints = [
        '/api/users/me',
        '/api/bets/user',
        '/api/football/live',
        '/api/football/upcoming'
      ];
      
      if (silentEndpoints.includes(error.config.url)) {
        return Promise.resolve({ data: [] });
      }

      // Handle different error response formats
      let errorMessage = 'An unexpected error occurred';
      
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.title) {
        errorMessage = errorData.title;
      }

      // Create an error object with additional context
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).status = error.response.status;
      (enhancedError as any).data = errorData;
      
      return Promise.reject(enhancedError);
    } else if (error.request) {
      // The request was made but no response was received
      // Silently handle network errors for specific endpoints
      const silentEndpoints = [
        '/api/users/me',
        '/api/bets/user',
        '/api/football/live',
        '/api/football/upcoming'
      ];
      
      if (silentEndpoints.includes(error.config.url)) {
        return Promise.resolve({ data: [] });
      }
      
      return Promise.reject(new Error('Network error - please check your connection'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new Error('Request failed - please try again'));
    }
  }
);

// Types
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  balance: number;
  createdAt: string;
}

export interface FavoriteTeam {
  id: string;
  name: string;
  logo: string;
  league: string;
  leagueLogo: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface LoginResponse {
  token: string;
}

export interface LiveMatch {
  id: string;
  tournament: string;
  tournamentLogo: string;
  region: string;
  time: string;
  team1: {
    id: string;
    name: string;
    logo: string;
    score: number;
  };
  team2: {
    id: string;
    name: string;
    logo: string;
    score: number;
  };
  minute: number;
  odds: {
    team1Win: number;
    draw: number;
    team2Win: number;
  };
}

export interface BetData {
  id: string;
  userId: string;
  matchId: string;
  selection: string;
  stake: number;
  odds: number;
  potentialWin: number;
  status: string;
  cashoutAmount?: number;
  createdAt: string;
  settledAt?: string;
  matchName: string;
  matchDate: string;
  isLive: boolean;
}

export interface TransactionData {
  id: string;
  userId: string;
  amount: number;
  type: string;
  betId?: string;
  status: string;
  balanceAfter: number;
  createdAt: string;
  description: string;
}

export interface UpcomingMatch {
  id: string;
  tournament: string;
  tournamentLogo: string;
  region: string;
  date: string;
  time: string;
  team1: {
    id: string;
    name: string;
    logo: string;
  };
  team2: {
    id: string;
    name: string;
    logo: string;
  };
  odds: {
    team1Win: number;
    draw: number;
    team2Win: number;
  };
}

// Auth methods
export const register = async (email: string, username: string, password: string) => {
  const response = await api.post<AuthResponse>('/api/auth/register', {
    email,
    username,
    password,
  });
  return response.data.user;
};

export const login = async (email: string, password: string, rememberMe: boolean = false) => {
  const response = await api.post<AuthResponse>('/api/auth/login', {
    email,
    password,
  });
  
  if (!response.data.token) {
    throw new Error('No token received from server');
  }
  
  // Store token in localStorage or sessionStorage based on rememberMe
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('token', response.data.token);
  
  return response.data.user;
};

export const logout = () => {
  // Clear token from both storages
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

// User methods
export const getCurrentUser = async () => {
  const response = await api.get<UserProfile>('/api/users/me');
  return response.data;
};

// Match methods
export const getLiveMatches = async (): Promise<LiveMatch[]> => {
  const response = await api.get<LiveMatch[]>('/api/football/live');
  return response.data;
};

export const getUpcomingMatches = async (date: string = 'today'): Promise<UpcomingMatch[]> => {
  const response = await api.get<UpcomingMatch[]>(`/api/football/upcoming?date=${date}`);
  return response.data;
};

export const getAvailableTeams = async () => {
  const response = await api.get<FavoriteTeam[]>('/api/football/teams');
  return response.data;
};

// Betting methods
export const placeBet = async (matchId: string, selection: string, stake: number) => {
  const response = await api.post<BetData>('/api/bets', {
    matchId,
    selection,
    stake,
  });
  return response.data;
};

export const getUserBets = async () => {
  try {
    const response = await api.get<BetData[]>('/api/bets/user');
    return response.data;
  } catch (error) {
    // Silently return empty array on error
    return [];
  }
};

export const cashoutBet = async (betId: string) => {
  const response = await api.post<{bet: BetData, user: UserProfile}>(`/api/bets/${betId}/cashout`);
  
  // Update the stored user data with the new balance
  const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
  storage.setItem('user', JSON.stringify(response.data.user));
  
  return response.data.bet;
};

// Transaction methods
export const getUserTransactions = async () => {
  const response = await api.get<TransactionData[]>('/api/transactions/user');
  return response.data;
};

// Favorites methods
export const getFavoriteTeams = async () => {
  try {
    const response = await api.get<FavoriteTeam[]>('/api/users/favorites');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const addFavoriteTeam = async (teamId: string) => {
  const response = await api.post<FavoriteTeam>('/api/users/favorites', { teamId });
  return response.data;
};

export const removeFavoriteTeam = async (teamId: string) => {
  await api.delete(`/api/users/favorites/${teamId}`);
};

export default api; 