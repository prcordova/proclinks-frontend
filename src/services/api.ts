import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },
  
  loginWithProvider: async (provider: string, token: string) => {
    const response = await api.post(`/auth/${provider}`, { token })
    return response.data
  },
  
  register: async (userData: {
    username: string
    email: string
    password: string
  }) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  }
} 