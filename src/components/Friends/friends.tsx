'use client'

import { useState, useCallback } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { UserCard } from '@/components/user-card'
import { ContainerCards } from '@/components/ContainerCard/container-cards'
import { useLoading } from '@/contexts/loading-context'
import { userApi } from '@/services/api'

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

interface FriendsProps {
  initialTab?: number
}

export function Friends({ initialTab = 0 }: FriendsProps) {
  const [tabValue, setTabValue] = useState(initialTab)
  const [friends, setFriends] = useState<User[]>([])
  const [pendingRequests, setPendingRequests] = useState<User[]>([])
  const [suggestions, setSuggestions] = useState<User[]>([])
  const { setIsLoading, isLoading } = useLoading()

  const handleTabChange = useCallback(async (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setIsLoading(true)

    try {
      switch (newValue) {
        case 0: // Amigos
          const friendsResponse = await userApi.listFriends()
          setFriends(friendsResponse.data.data)
          break
        case 1: // Solicitações Pendentes
          const pendingResponse = await userApi.listPendingRequests()
          setPendingRequests(pendingResponse.data.data)
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
    let content: User[] = []
    let emptyMessage = ''

    switch (tabValue) {
      case 0:
        content = friends
        emptyMessage = 'Você ainda não tem amigos'
        break
      case 1:
        content = pendingRequests
        emptyMessage = 'Nenhuma solicitação pendente'
        break
      case 2:
        content = suggestions
        emptyMessage = 'Nenhuma sugestão disponível'
        break
    }

    return (
      <ContainerCards
        isEmpty={!isLoading && content.length === 0}
        emptyMessage={emptyMessage}
        isLoading={isLoading}
      >
        {content.map((user) => (
          <UserCard 
            key={user._id} 
            user={user}
            showFriendshipActions={tabValue === 1}
          />
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