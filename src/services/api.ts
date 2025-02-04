import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  register: async (data: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  login: async (data: { username: string; password: string }) => {
    const response = await api.post('/auth/login', data)
    return response.data
  }
}

export const linkApi = {
  create: async (data: { title: string; url: string; visible: boolean }) => {
    const response = await api.post('/links', data)
    return response.data
  },

  list: async () => {
    const response = await api.get('/links')
    return response.data
  },

  update: async (id: string, data: { title: string; url: string; visible: boolean }) => {
    const response = await api.put(`/links/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    console.log('Chamando API para deletar link:', id)
    await api.delete(`/links/${id}`)
  },

  reorder: async (links: { id: string; order: number }[]) => {
    const response = await api.post('/links/reorder', { links })
    return response.data
  },

  getPublicLinks: async (username: string) => {
    const response = await api.get(`/links/user/${username}`)
    return response.data
  },

  updateOrder: async (links: { id: string; order: number }[]) => {
    const response = await api.put('/links/order', { links })
    return response.data
  },

  getLinksByUserId: async (userId: string) => {
    const response = await api.get(`/links/user/${userId}`)
    return response.data
  }
}

export const userApi = {
  getProfile: async (username: string) => {
    const response = await api.get(`/users/${username}`)
    return response.data
  },

  updateViewMode: async (viewMode: 'list' | 'grid') => {
    const response = await api.put('/users/view-mode', { viewMode })
    return response.data
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/users/profile', data)
    return response.data
  },

  getFollowStatus: async (username: string) => {
    const response = await api.get(`/users/${username}/follow-status`)
    return response.data
  },
  
  getLikedLinks: async (username: string) => {
    const response = await api.get(`/users/${username}/liked-links`)
    return response.data
  }
}

export default api 