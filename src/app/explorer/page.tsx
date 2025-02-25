'use client'

import { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { userApi } from '@/services/api'
import { FilterOptions, FilterOption } from '@/components/FilterOptions/filter-options'
import { SearchInput } from '@/components/searchInput'
import { ContainerCards } from '@/components/ContainerCard/container-cards'
import { UserCard } from '@/components/user-card'
import { useLoading } from '@/contexts/loading-context'
import { Container, Typography, Box } from '@mui/material'

interface User {
  _id: string
  id?: string
  username: string
  bio: string
  avatar?: string
  plan: {
    type: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
  }
  followers: number
  following: number
  createdAt: string
}

interface UsersResponse {
  searchResults: User[]
  featuredUsers: User[]
  page: number
  hasMore: boolean
}

// Componente de filtro memorizado
const FilterOptionsWrapper = memo(({ selectedFilter, onFilterChange }: { 
  selectedFilter: FilterOption, 
  onFilterChange: (filter: FilterOption) => void 
}) => (
  <FilterOptions selectedFilter={selectedFilter} onFilterChange={onFilterChange} />
))

FilterOptionsWrapper.displayName = 'FilterOptionsWrapper'

// Componente de busca memorizado
const SearchWrapper = memo(({ value, onChange }: { 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
}) => (
  <SearchInput value={value} onChange={onChange} />
))

SearchWrapper.displayName = 'SearchWrapper'

export default function ExplorerPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('popular')
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<UsersResponse>({
    searchResults: [],
    featuredUsers: [],
    page: 1,
    hasMore: false
  })
  const { setIsLoading, isLoading } = useLoading()

  const fetchUsers = useCallback(async (
    pageNum: number,
    filter: FilterOption,
    search?: string
  ) => {
    try {
      const response = await userApi.listUsers({
        page: pageNum,
        limit: 20,
        filter,
        search: search?.trim()
      })
      
      console.log('Resposta completa:', response)
      console.log('Featured Users:', response.data.data.featuredUsers)
      console.log('Search Results:', response.data.data.searchResults)

      const users = search?.trim() ? response.data.data.searchResults : response.data.data.featuredUsers
      console.log('Users selecionados:', users)
      
      setUsers(prev => ({
        searchResults: search?.trim() ? response.data.data.searchResults : prev.searchResults,
        featuredUsers: !search?.trim() ? response.data.data.featuredUsers : prev.featuredUsers,
        page: response.data.data.page,
        hasMore: response.data.data.hasMore
      }))
      setIsLoading(false)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      setIsLoading(false)
    }
  }, [setIsLoading])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery || selectedFilter) {
        setIsLoading(true)
        fetchUsers(1, selectedFilter, searchQuery)
      }
    }, searchQuery ? 500 : 0)

    return () => {
      clearTimeout(timer)
    }
  }, [fetchUsers, selectedFilter, searchQuery, setIsLoading])

  const displayedUsers = useMemo(() => 
    searchQuery ? users.searchResults : users.featuredUsers
  , [searchQuery, users.searchResults, users.featuredUsers])

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (!value.trim()) {
      setIsLoading(true)
      fetchUsers(1, selectedFilter, '')
    }
  }, [fetchUsers, selectedFilter])

  const handleFilterChange = useCallback((filter: FilterOption) => {
    setSelectedFilter(filter)
  }, [setIsLoading, setSelectedFilter])

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
        Explorar Perfis
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        mb: 4,
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: { md: 'space-between' },
        alignItems: 'stretch',
        '& > *': {
          width: { xs: '100%', md: 'auto' }
        },
        '& .search-wrapper': {
          width: { xs: '100%', md: '300px' }
        }
      }}>
        <FilterOptionsWrapper 
          selectedFilter={selectedFilter} 
          onFilterChange={handleFilterChange} 
        />
        <Box className="search-wrapper">
          <SearchWrapper 
            value={searchQuery} 
            onChange={handleSearch} 
          />
        </Box>
      </Box>

      <ContainerCards 
        isEmpty={!isLoading && (!displayedUsers || displayedUsers.length === 0)}
        emptyMessage={`Nenhum usuário ${searchQuery ? 'encontrado' : 'em destaque'}`}
        isLoading={isLoading}
      >
        {(displayedUsers || []).map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </ContainerCards>
    </Container>
  )
}