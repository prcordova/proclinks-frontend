'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, userApi } from '@/services/api'

interface PlanFeatures {
  maxLinks: number
  customization: boolean
  analytics: boolean
  priority: boolean
  support: 'basic' | 'priority' | 'vip'
}

interface User {
  id: string
  username: string
  email: string
  plan?: {
    type: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
    status: string
    features: PlanFeatures
  }
  avatar?: string
  following: string[]
}

interface RegisterUserData {
  username: string
  email: string
  password: string
 
  phone: string
  confirmPassword?: string
  fullName: string
  birthDate: string
  
  termsAccepted: boolean
}


interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface AuthResponse {
  token: string
  user: {
    _id: string
    username: string
    email: string
    avatar?: string
    following: string[]
    plan?: {
      type: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
      status: string
      features: PlanFeatures
    }
  }
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (userData: RegisterUserData) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        const response = await userApi.getMyProfile()
        if (response.success) {
           setUser({
            id: response.data._id || response.data.id,
            username: response.data.username,
            email: response.data.email,
            avatar: response.data.avatar,
            following: response.data.following,
            plan: response.data.plan
          })
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password)
      if (response.success) {
        localStorage.setItem('token', response.data.token)
        setUser({
          id: response.data.user._id || response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          avatar: response.data.user.avatar,
          following: response.data.user.following,
          plan: response.data.user.plan
        })
        router.push(`/user/${response.data.user.username}`)
      }
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  const register = async (userData: RegisterUserData) => {
    try {
      const response = await authApi.register(userData)
      const data = response.data as ApiResponse<AuthResponse>
      if (data.success) {
        localStorage.setItem('token', data.data.token)
        setUser({
          id: data.data.user._id,
          username: data.data.user.username,
          email: data.data.user.email,
          avatar: data.data.user.avatar,
          following: data.data.user.following,
          plan: data.data.user.plan
        })
        router.push('/profile/edit')
      }
    } catch (error) {
      console.error('Erro no registro:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 