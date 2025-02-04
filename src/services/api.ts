import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

interface ProfileUpdateData {
  profile: {
    backgroundColor?: string;
    cardColor?: string;
    textColor?: string;
    cardTextColor?: string;
    displayMode?: 'list' | 'grid';
    cardStyle?: 'rounded' | 'square' | 'pill';
    animation?: 'none' | 'fade' | 'slide' | 'bounce';
    font?: 'default' | 'serif' | 'mono';
    spacing?: number;
    sortMode?: 'custom' | 'date' | 'name' | 'likes';
    likesColor?: string;
  };
  links?: Array<{
    _id: string;
    title: string;
    url: string;
    visible: boolean;
    order: number;
  }>;
}

interface LinkData {
  title: string;
  url: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/api/auth/login', { username, password })
    return response.data
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/api/auth/register', { username, email, password })
    return response.data
  }
}

export const userApi = {
  // Para a página pública do usuário (site.com/@username)
  getPublicProfile: async (username: string) => {
    const response = await api.get(`/api/users/${username}`)
    return response.data
  },

  // Para a página privada do usuário logado (site.com/profile)
  getMyProfile: async () => {
    const response = await api.get('/api/users/profile')
    return response.data
  },

  updateViewMode: async (viewMode: 'list' | 'grid') => {
    const response = await api.put('/users/view-mode', { viewMode })
    return response.data
  },

  updateProfile: async (data: ProfileUpdateData) => {
    console.log('Enviando dados para atualização:', data)
    const response = await api.put('/api/users/profile', data)
    console.log('Resposta da API:', response.data)
    return response.data
  },

  getFollowStatus: async (username: string) => {
    const response = await api.get(`/users/${username}/follow-status`)
    return response.data
  },
  
  getLikedLinks: async (username: string) => {
    const response = await api.get(`/users/${username}/liked-links`)
    return response.data
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await api.post('/api/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export const linkApi = {
  getLinks: async () => {
    const response = await api.get('/api/links')
    return response.data
  },

  createLink: async (linkData: LinkData) => {
    const response = await api.post('/api/links', linkData)
    return response.data
  },

  updateLink: async (id: string, linkData: LinkData) => {
    const response = await api.put(`/api/links/${id}`, linkData)
    return response.data
  },

  deleteLink: async (id: string) => {
    const response = await api.delete(`/api/links/${id}`)
    return response.data
  },

  reorder: async (data: { links: string[] }) => {
    try {
      console.log('Enviando dados para reordenação:', data)
      const response = await api.post('/api/links/reorder', {
        links: data.links.map(id => id.toString())
      })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Erro ao reordenar links:', error)
      return { success: false, error }
    }
  },

  getPublicLinks: async (username: string) => {
    const response = await api.get(`/links/user/${username}`)
    return response.data
  },

  getLinksByUserId: async (userId: string) => {
    const response = await api.get(`/links/user/${userId}`)
    return response.data
  }
}

export default api 