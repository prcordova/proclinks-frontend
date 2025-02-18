import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true // Importante para cookies de autenticação
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

  register: (data: {
    username: string
    email: string
    password: string
 
    phone: string
  }) => {
     return api.post('/api/auth/register', data)
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
     const response = await api.put('/api/users/profile', data)
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
  },

  listUsers: (params: { 
    page: number
    limit: number
    filter: string
    search?: string 
  }) => {
    return api.get('/api/users', { params })
  },

  followUser: async (userId: string) => {
     if (!userId) throw new Error('UserId is required')
    const response = await api.post(`/api/users/${userId}/follow`)
    return response.data
  },

  unfollowUser: async (userId: string) => {
     if (!userId) throw new Error('UserId is required')
    const response = await api.delete(`/api/users/${userId}/follow`)
    return response.data
  },

  getFollowStats: async (userId: string) => {
    const response = await api.get(`/users/${userId}/follow-stats`)
    return response.data
  },

  getFollowersFromUser: async (username: string) => {
    try {
      const response = await api.get(`/api/users/${username}/followers`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar seguidores:', error)
      throw error
    }
  },

  getFollowingFromUser: async (userId: string) => {
    try {
      const response = await api.get(`/api/users/${userId}/following`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar usuários seguidos:', error)
      throw error
    }
  },

  getHeaderInfo: async () => {
    const response = await api.get('/api/users/header-info')
    return response.data
  },

  listFriends: () => api.get('/api/friendships/friends'),
  listPendingRequests: () => api.get('/api/friendships/requests'),
  acceptFriendRequest: (requesterId: string) => api.post(`/api/friendships/accept/${requesterId}`),
  rejectFriendRequest: (friendshipId: string) => api.delete(`/api/friendships/${friendshipId}`),
  sendFriendRequest: (data: { recipientId: string }) => api.post('/api/friendships/request', data),
  listSuggestions: () => api.get('/api/friendships/suggestions')
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

export const paymentApi = {
  createCheckoutSession: async (planName: string) => {
    try {
      const response = await api.post('/api/payments/create-checkout', {
        plano: planName.toUpperCase() // BRONZE, SILVER, GOLD
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      throw error;
    }
  },

  cancelSubscription: async () => {
    try {
      const response = await api.post('/api/payments/cancel-subscription');
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw error;
    }
  }
};

export default api 