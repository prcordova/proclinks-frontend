'use client'

import { useCallback, useEffect, useState } from 'react'
import { userApi } from '@/services/api'
import { ContainerCards } from '@/components/ContainerCard/container-cards'
import { UserCard } from '@/components/user-card'
import { useLoading } from '@/contexts/loading-context'
import { FilterOption } from '@/components/FilterOptions/filter-options'

interface User {
  _id: string
  username: string
  bio: string
  avatar?: string
  plan: {
    type: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
  }
  followers: number
  following: number
  friendshipStatus?: 'NONE' | 'PENDING' | 'FRIENDLY'
}

interface UsersListProps {
  searchQuery: string
  selectedFilter: FilterOption
}

export function UsersList({ searchQuery, selectedFilter }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([])
  const { setIsLoading, isLoading } = useLoading()

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await userApi.listUsers({
        page: 1,
        limit: 20,
        filter: selectedFilter,
        search: searchQuery.trim()
      })
      
      const users = searchQuery 
        ? response.data.data.searchResults 
        : response.data.data.featuredUsers

      setUsers(users || [])
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedFilter, setIsLoading])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, searchQuery ? 500 : 0)

    return () => clearTimeout(timer)
  }, [fetchUsers, searchQuery])

  return (
    <ContainerCards 
      isEmpty={!isLoading && users?.length === 0}
      emptyMessage={`Nenhum usuário ${searchQuery ? 'encontrado' : 'em destaque'}`}
      isLoading={isLoading}
    >
      {users?.map((user) => (
        <UserCard 
          key={user._id} 
          user={user}
          showFriendshipButton={true}
        />
      ))}
    </ContainerCards>
  )
} 