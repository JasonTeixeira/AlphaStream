"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: "free" | "pro" | "enterprise"
  emailVerified: boolean
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user for frontend simulation
const DEMO_USER: User = {
  id: "usr_demo123",
  name: "Alex Thompson",
  email: "alex@example.com",
  plan: "pro",
  emailVerified: true,
  createdAt: new Date("2024-01-15"),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = () => {
      const savedSession = localStorage.getItem("alphastream_session")
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession)
          setUser({ ...DEMO_USER, ...parsed })
        } catch {
          localStorage.removeItem("alphastream_session")
        }
      }
      setIsLoading(false)
    }
    checkSession()
  }, [])

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Demo validation
    if (password.length < 6) {
      setIsLoading(false)
      throw new Error("Invalid credentials")
    }
    
    const userData = { ...DEMO_USER, email }
    setUser(userData)
    
    if (rememberMe) {
      localStorage.setItem("alphastream_session", JSON.stringify(userData))
    } else {
      sessionStorage.setItem("alphastream_session", JSON.stringify(userData))
    }
    
    setIsLoading(false)
    router.push("/dashboard")
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    if (password.length < 8) {
      setIsLoading(false)
      throw new Error("Password must be at least 8 characters")
    }
    
    const userData: User = {
      ...DEMO_USER,
      name,
      email,
      emailVerified: false,
      plan: "free",
      createdAt: new Date(),
    }
    
    setUser(userData)
    localStorage.setItem("alphastream_session", JSON.stringify(userData))
    setIsLoading(false)
    router.push("/auth/verify-email")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("alphastream_session")
    sessionStorage.removeItem("alphastream_session")
    router.push("/")
  }

  const forgotPassword = async (email: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // In production, this would send an email
  }

  const resetPassword = async (token: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters")
    }
    // In production, this would validate token and update password
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data }
      setUser(updated)
      localStorage.setItem("alphastream_session", JSON.stringify(updated))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
