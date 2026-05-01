"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: "free" | "starter" | "pro" | "premium"
  emailVerified: boolean
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  accessToken: string | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapSupabaseUser(supaUser: SupabaseUser): User {
  return {
    id: supaUser.id,
    name: supaUser.user_metadata?.name || supaUser.email?.split("@")[0] || "",
    email: supaUser.email || "",
    avatar: supaUser.user_metadata?.avatar_url,
    plan: "free",
    emailVerified: !!supaUser.email_confirmed_at,
    createdAt: new Date(supaUser.created_at),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  useEffect(() => {
    // Check current session
    const getSession = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(mapSupabaseUser(session.user))
          setAccessToken(session.access_token)

          // Fetch plan from profiles table
          const { data: profile } = await createClient()
            .from("profiles")
            .select("plan")
            .eq("id", session.user.id)
            .single()
          if (profile?.plan) {
            setUser(prev => prev ? { ...prev, plan: profile.plan } : prev)
          }
        }
      } catch (e) {
        console.error("Session check failed:", e)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = createClient().auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user))
          setAccessToken(session.access_token)
        } else {
          setUser(null)
          setAccessToken(null)
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    if (error) {
      setIsLoading(false)
      throw new Error(error.message)
    }
    router.push("/dashboard")
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    const { error } = await createClient().auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) {
      setIsLoading(false)
      throw new Error(error.message)
    }
    router.push("/auth/verify-email")
  }

  const logout = async () => {
    await createClient().auth.signOut()
    setUser(null)
    setAccessToken(null)
    router.push("/")
  }

  const forgotPassword = async (email: string) => {
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) throw new Error(error.message)
  }

  const resetPassword = async (_token: string, password: string) => {
    const { error } = await createClient().auth.updateUser({ password })
    if (error) throw new Error(error.message)
    router.push("/auth/login")
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        accessToken,
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
