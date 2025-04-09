import api from "./api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
    balance: number
  }
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

export const auth = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/auth/register", data)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }
    return response.data
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/auth/login", data)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }
    return response.data
  },

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  },

  getUser() {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  getToken() {
    return localStorage.getItem("token")
  },

  isAuthenticated() {
    return !!this.getToken()
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const response = await api.post("/api/auth/change-password", {
      currentPassword,
      newPassword
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      return { success: false, error: axiosError.response?.data?.error || 'Failed to change password' };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
} 