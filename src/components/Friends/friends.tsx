'use client'

import { useState, useCallback } from 'react'
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
      console.error('Erro ao carregar solicitações:', error)
    }
  }, [])

  const handleFriendshipAction = useCallback(async (userId: string, action: 'accept' | 'reject', friendshipId?: string) => {
    try {
      if (action === 'accept') {
        await userApi.acceptFriendRequest(userId)
        toast.success('Solicitação aceita!')
      } else {
        await userApi.rejectFriendRequest(friendshipId || '')
        toast.success('Solicitação recusada!')
      }
      
      // Atualiza as listas
      await Promise.all([
        fetchFriends(),
        fetchPendingRequests()
      ])
    } catch (error) {
      console.error('Erro na ação de amizade:', error)
      toast.error('Erro ao processar solicitação')
    }
  }, [fetchFriends, fetchPendingRequests])

  const handleTabChange = useCallback(async (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setIsLoading(true)

    try {
      switch (newValue) {
        case 0: // Amigos
          const friendsResponse = await userApi.listFriends()
          setFriends(friendsResponse.data.data)
          break
        case 1: // Solicitações
          const requestsResponse = await userApi.listPendingRequests()
          setPendingRequests(requestsResponse.data.data)
          break
        case 2: // Sugestões
          const suggestionsResponse = await userApi.listSuggestions()
          setSuggestions(suggestionsResponse.data.data)
          break
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading])

  const renderContent = () => {
    let content: UserWithFriendship[] = []
    let emptyMessage = ''

    switch (tabValue) {
      case 0:
        content = friends.map(friend => ({
          _id: friend.id,
          username: friend.username,
          bio: friend.bio,
          avatar: friend.avatar,
          followers: 0,
          following: 0,
          friendshipStatus: 'FRIENDLY',
          friendshipId: friend.friendshipId,
          plan: { type: 'FREE' }
        }))
        emptyMessage = 'Você ainda não tem amigos'
        break
      case 1:
        content = pendingRequests.map(request => ({
          _id: request.user._id,
          username: request.user.username,
          bio: request.user.bio,
          avatar: request.user.avatar,
          followers: request.user.followers,
          following: request.user.following,
          friendshipStatus: 'PENDING',
          friendshipId: request.id,
          plan: { type: 'FREE' }
        }))
        emptyMessage = 'Nenhuma solicitação pendente'
        break
      case 2:
        content = suggestions.filter(Boolean) as UserWithFriendship[]
        emptyMessage = 'Nenhuma sugestão disponível'
        break
    }

    return (
      <ContainerCards
        key={tabValue}
        isEmpty={!isLoading && content.length === 0}
        emptyMessage={emptyMessage}
        isLoading={isLoading}
      >
        {content.map((user) => (
          user && user._id ? (
            <UserCard 
              key={user._id}
              user={user}
              showFriendshipActions={tabValue === 1}
              showFriendshipButton={true}
              onFriendshipAction={handleFriendshipAction}
            />
          ) : null
        ))}
      </ContainerCards>
    )
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
        <Tab label="Solicitações" />
        <Tab label="Sugestões" />
      </Tabs>

      {renderContent()}
    </Box>
  )
} 