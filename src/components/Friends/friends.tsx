'use client'

import { useState, useCallback, useEffect } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { UserCard } from '@/components/user-card'
import { ContainerCards } from '@/components/ContainerCard/container-cards'
import { useLoading } from '@/contexts/loading-context'
import { userApi } from '@/services/api'
 
interface Friend {
  id: string;
  username: string;
  bio: string;
  avatar?: string;
  friendshipId: string;
  since: string;
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

export function Friends({ initialTab = 0 }: FriendsProps) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([])
  const [receivedRequests, setReceivedRequests] = useState<PendingRequest[]>([])
  const [suggestions, setSuggestions] = useState<UserWithFriendship[]>([])
  const [tabValue, setTabValue] = useState(initialTab)
  const { isLoading, setIsLoading } = useLoading()

  const fetchFriends = useCallback(async () => {
    try {
      const response = await userApi.listFriends()
      setFriends(response.data.data)
    } catch (error) {
      console.error('Erro ao carregar amigos:', error)
    }
  }, [])

  const fetchPendingRequests = useCallback(async () => {
    try {
      const response = await userApi.listPendingRequests()
      setPendingRequests(response.data.data)
    } catch (error) {
      console.error('Erro ao carregar solicitações enviadas:', error)
    }
  }, [])

  const fetchReceivedRequests = useCallback(async () => {
    try {
      const response = await userApi.listReceivedRequests()
      setReceivedRequests(response.data.data)
    } catch (error) {
      console.error('Erro ao carregar solicitações recebidas:', error)
    }
  }, [])

  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await userApi.listSuggestions()
      setSuggestions(response.data.data)
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error)
    }
  }, [])

  const handleFriendshipAction = async (userId: string, action: 'accept' | 'reject', friendshipId?: string) => {
    try {
      setIsLoading(true)
      
      if (action === 'accept' && friendshipId) {
        await userApi.acceptFriendRequest(friendshipId)
        
        // Remove a solicitação aceita da lista de recebidas
        setReceivedRequests(prev => prev.filter(request => request.id !== friendshipId))
        
        // Atualiza a lista de amigos
        const friendsResponse = await userApi.listFriends()
        setFriends(friendsResponse.data.data)
        
      } else if (action === 'reject' && friendshipId) {
        await userApi.rejectFriendRequest(friendshipId)
        // Remove a solicitação rejeitada da lista
        setReceivedRequests(prev => prev.filter(request => request.id !== friendshipId))
      }
      
    } catch (error) {
      console.error('Erro ao executar ação de amizade:', error)
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
          followers: 0,
          following: 0,
          friendshipStatus: 'FRIENDLY' as const,
          friendshipId: friend.friendshipId,
          plan: { type: 'FREE' as const }
        }))
      case 1: // Solicitações Enviadas
        return pendingRequests.map(request => ({
          _id: request.user._id,
          username: request.user.username,
          bio: request.user.bio,
          avatar: request.user.avatar,
          followers: request.user.followers,
          following: request.user.following,
          friendshipStatus: 'PENDING' as const,
          friendshipId: request.id,
          friendshipInitiator: 'ME' as const,
          plan: { type: 'FREE' as const }
        }))
      case 2: // Solicitações Recebidas
        return receivedRequests.map(request => ({
          _id: request.user._id,
          username: request.user.username,
          bio: request.user.bio,
          avatar: request.user.avatar,
          followers: request.user.followers,
          following: request.user.following,
          friendshipStatus: 'PENDING' as const,
          friendshipId: request.id,
          friendshipInitiator: 'THEM' as const,
          plan: { type: 'FREE' as const }
        }))
      case 3:
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
        <Tab label="Amigos" />
        <Tab label="Solicitações Enviadas" />
        <Tab label="Solicitações Recebidas" />
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