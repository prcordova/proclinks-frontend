'use client'

import { useState, useCallback, useEffect } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { UserCard } from '@/components/user-card'
import { ContainerCards } from '@/components/ContainerCard/container-cards'
import { useLoading } from '@/contexts/loading-context'
import { userApi } from '@/services/api'
import { toast } from 'react-hot-toast'

interface Friend {
  id: string;
  username: string;
  bio: string;
  avatar?: string;
  friendshipId: string;
  since: string;
  followers?: string[];
  following?: string[];
}

interface User {
  _id: string
  username: string
  avatar?: string
  bio?: string
  plan: {
    type: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
  }
  followers: number
  following: number
  friendshipStatus?: 'NONE' | 'PENDING' | 'FRIENDLY'
}

interface PendingRequest {
  id: string
  status: 'NONE' | 'PENDING' | 'FRIENDLY'
  user: {
    _id: string
    username: string
    bio: string
    avatar?: string
    followers: number
    following: number
  }
  createdAt: string
}

interface UserWithFriendship extends User {
  friendshipId?: string;
}

interface FriendsProps {
  initialTab?: number
}

interface FriendResponse {
  _id: string
  username: string
  bio: string
  avatar?: string
  friendshipId: string
  createdAt: string
  followers: string[]
  following: string[]
}

export function Friends({ initialTab = 0 }: FriendsProps) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([])
  const [receivedRequests, setReceivedRequests] = useState<PendingRequest[]>([])
  const [suggestions, setSuggestions] = useState<UserWithFriendship[]>([])
  const [tabValue, setTabValue] = useState(initialTab)
  const { isLoading, setIsLoading } = useLoading()

  const fetchFriends = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await userApi.friendships.list()
      setFriends(response.data.data.map((friend: FriendResponse) => ({
        id: friend._id,
        username: friend.username,
        bio: friend.bio || '',
        avatar: friend.avatar,
        friendshipId: friend.friendshipId,
        since: friend.createdAt,
        followers: friend.followers,
        following: friend.following
      })))
    } catch (error) {
      console.error('Erro ao carregar amigos:', error)
      toast.error('Erro ao carregar amigos')
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading])

  const fetchPendingRequests = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await userApi.friendships.pending()
      setPendingRequests(response.data.data)
    } catch (error) {
      console.error('Erro ao carregar solicitações enviadas:', error)
      toast.error('Erro ao carregar solicitações enviadas')
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading])

  const fetchReceivedRequests = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await userApi.friendships.received()
      setReceivedRequests(response.data.data)
    } catch (error) {
      console.error('Erro ao carregar solicitações recebidas:', error)
      toast.error('Erro ao carregar solicitações recebidas')
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading])

  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await userApi.friendships.suggestions()
      setSuggestions(response.data.data)
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error)
    }
  }, [])

  const handleFriendshipAction = async (
    action: 'accept' | 'reject' | 'cancel', 
    friendshipId?: string
  ) => {
    if (!friendshipId) return
    
    try {
      setIsLoading(true)
      if (action === 'accept') {
        await userApi.friendships.accept(friendshipId)
        toast.success('Solicitação aceita com sucesso!')
        await Promise.all([fetchReceivedRequests(), fetchFriends()])
      } else {
        await userApi.friendships.reject(friendshipId)
        toast.success(action === 'reject' ? 'Solicitação rejeitada' : 'Solicitação cancelada')
        await fetchReceivedRequests()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar solicitação'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = useCallback(async (_event: React.SyntheticEvent | null, newValue: number) => {
    setTabValue(newValue)
    setIsLoading(true)
    try {
      switch (newValue) {
        case 0:
          await fetchFriends()
          break
        case 1:
          await fetchPendingRequests()
          break
        case 2:
          await fetchReceivedRequests()
          break
        case 3:
          await fetchSuggestions()
          break
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchFriends, fetchPendingRequests, fetchReceivedRequests, fetchSuggestions, setIsLoading])

  useEffect(() => {
    handleTabChange(null, tabValue)
  }, [handleTabChange, tabValue])

  const getCurrentContent = () => {
    switch (tabValue) {
      case 0: // Amigos
        return friends.map(friend => ({
          _id: friend.id,
          username: friend.username,
          bio: friend.bio,
          avatar: friend.avatar,
          followers: friend.followers?.length || 0,
          following: friend.following?.length || 0,
          friendshipStatus: 'FRIENDLY' as const,
          friendshipId: friend.friendshipId,
          plan: { type: 'FREE' as const }
        }))
      case 1: // Solicitações Enviadas por mim
        return pendingRequests.map(request => ({
          _id: request.user._id,
          username: request.user.username,
          bio: request.user.bio,
          avatar: request.user.avatar,
          followers: request.user.followers,
          following: request.user.following,
          friendshipStatus: 'PENDING' as const,
          friendshipId: request.id,
          isRequester: true, // Eu sou o solicitante
          plan: { type: 'FREE' as const }
        }))
      case 2: // Solicitações Recebidas por mim
        return receivedRequests.map(request => ({
          _id: request.user._id,
          username: request.user.username,
          bio: request.user.bio,
          avatar: request.user.avatar,
          followers: request.user.followers,
          following: request.user.following,
          friendshipStatus: 'PENDING' as const,
          friendshipId: request.id,
          isRequester: false, // Eu sou o destinatário
          plan: { type: 'FREE' as const }
        }))
      case 3: // Sugestões
        return suggestions
      default:
        return []
    }
  }

  const getEmptyMessage = () => {
    let emptyMessage = ''

    switch (tabValue) {
      case 0:
        emptyMessage = 'Você ainda não tem amigos'
        break
      case 1:
        emptyMessage = 'Nenhuma solicitação pendente'
        break
      case 2:
        emptyMessage = 'Nenhuma solicitação recebida'
        break
      case 3:
        emptyMessage = 'Nenhuma sugestão disponível'
        break
    }

    return emptyMessage
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        sx={{ mb: 4 }}
      >
        <Tab label={`Amigos (${friends.length})`} />
        <Tab label={`Enviadas (${pendingRequests.length})`} />
        <Tab label={`Recebidas (${receivedRequests.length})`} />
        <Tab label="Sugestões" />
      </Tabs>

      <ContainerCards
        isEmpty={!isLoading && getCurrentContent().length === 0}
        emptyMessage={getEmptyMessage()}
        isLoading={isLoading}
      >
        {getCurrentContent().map((user) => (
          <UserCard
          
            key={user._id}
            user={user}
            showFriendshipActions={tabValue === 2}
            showFriendshipButton={true}
            onFriendshipAction={handleFriendshipAction}
          />
        ))}
      </ContainerCards>
    </Box>
  )
} 