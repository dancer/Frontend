"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentUser, login as apiLogin, register as apiRegister, logout as apiLogout } from "@/services/api"

type User = {
  id: string
  username: string
  email: string
  balance: number
  createdAt: string
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper function to get cached user data
const getCachedUser = (): User => {
  if (typeof window === 'undefined') return null
  try {
    const cachedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
    return cachedUser ? JSON.parse(cachedUser) : null
  } catch {
    return null
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize with null to prevent hydration mismatch
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize auth state on mount (client-side only)
  useEffect(() => {
    const initializeAuth = async () => {
      // First set the cached user data
      const cachedUser = getCachedUser()
      setUser(cachedUser)

      try {
        // Then try to get fresh data from the server
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (token) {
          const userData = await getCurrentUser()
          if (userData) {
            setUser(userData)
            const storage = localStorage.getItem('token') ? localStorage : sessionStorage
            storage.setItem('user', JSON.stringify(userData))
          } else {
            handleLogout()
          }
        }
      } catch (error) {
        console.error("Failed to refresh user data:", error)
        // Only logout if we don't have cached data
        if (!getCachedUser()) {
          handleLogout()
        }
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [])

  // Refresh user data periodically (every 30 seconds)
  useEffect(() => {
    if (!user || !isInitialized) return

    const refreshData = async () => {
      try {
        const userData = await getCurrentUser()
        if (userData) {
          setUser(userData)
          const storage = localStorage.getItem('token') ? localStorage : sessionStorage
          storage.setItem('user', JSON.stringify(userData))
        } else {
          handleLogout()
        }
      } catch (error) {
        console.error("Failed to refresh user data:", error)
        // Only logout if we don't have cached data
        if (!getCachedUser()) {
          handleLogout()
        }
      }
    }

    const intervalId = setInterval(refreshData, 30000)
    return () => clearInterval(intervalId)
  }, [user, isInitialized])

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true)
    try {
      const userData = await apiLogin(email, password, rememberMe)
      setUser(userData)
      // Store user data in the appropriate storage
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      await apiRegister(email, username, password)
      // Don't set user or store data after registration
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    apiLogout()
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser()
      if (userData) {
        setUser(userData)
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage
        storage.setItem('user', JSON.stringify(userData))
      } else {
        handleLogout()
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error)
      // Only logout if we don't have cached data
      if (!getCachedUser()) {
        handleLogout()
      }
    }
  }

  // Don't render children until we've initialized on the client
  if (!isInitialized) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout: handleLogout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

