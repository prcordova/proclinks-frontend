'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { userApi } from '@/services/api'
import Cookies from 'js-cookie'

interface User {
  id: string
  username: string
  email: string
  viewMode: 'list' | 'grid'
  isPublic?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User, token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('token')
      if (token) {
        try {
          const userData = await userApi.getProfile()
          setUser(userData)
        } catch (error) {
          Cookies.remove('token')
          setUser(null)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  const login = (userData: User, token: string) => {
    setUser(userData)
    Cookies.set('token', token, { secure: true, sameSite: 'strict' })
  }

  const logout = () => {
    setUser(null)
    Cookies.remove('token')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 