'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, userApi } from '@/services/api'

interface User {
  id: string
  username: string
  email: string
  plan?: {
    type: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
    status: string
    features?: any
  }
  avatar?: string
  following: string[]
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
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
            id: response.data.id,
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
          id: response.data.user._id,
          username: response.data.user.username,
          email: response.data.user.email,
          avatar: response.data.user.avatar,
          following: response.data.user.following,
          plan: response.data.user.plan
        })
        router.push('/profile')
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

  const register = async (userData: any) => {
    try {
      const response = await authApi.register(userData)
      if (response.success) {
        localStorage.setItem('token', response.data.token)
        setUser({
          id: response.data.user._id,
          username: response.data.user.username,
          email: response.data.user.email,
          avatar: response.data.user.avatar,
          following: response.data.user.following,
          plan: response.data.user.plan
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