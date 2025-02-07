'use client'

import { useState, useEffect } from 'react'
import { 
  Container, Typography, TextField, InputAdornment,
  Box, Grid, Alert
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { ExplorerSidebar, FilterOption } from '@/components/explorer-sidebar'
import { UserCard } from '@/components/user-card'
import { userApi } from '@/services/api'
import { useDebounce } from '@/hooks/useDebounce'

export default function ExplorerPage() {
  const [users, setUsers] = useState<{
    searchResults: any[];
    featuredUsers: any[];
  }>({
    searchResults: [],
    featuredUsers: []
  })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('popular')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchUsers = async (pageNum: number, filter: FilterOption, search?: string) => {
    setLoading(true)
    try {
      const response = await userApi.listUsers({
        page: pageNum,
        limit: 20,
        filter,
        search
      })
      
      setUsers({
        searchResults: response.data.searchResults || [],
        featuredUsers: response.data.featuredUsers || []
      })
      setHasMore(response.data.hasMore)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useDebounce((value: string) => {
    setPage(1)
    fetchUsers(1, selectedFilter, value)
  }, 300)

  useEffect(() => {
    setPage(1)
    fetchUsers(1, selectedFilter, searchQuery)
  }, [selectedFilter])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
        Explorar Perfis
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4 
      }}>
        <Box sx={{ 
          width: { xs: '100%', md: 'auto' }
        }}>
          <ExplorerSidebar
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 6 }}>
            <TextField
              fullWidth
              placeholder="Buscar usuários..."
              value={searchQuery}
              onChange={handleSearch}
              sx={{ 
                mb: 3,
                maxWidth: 600,
                mx: 'auto',
                display: 'block'
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />

            {searchQuery && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Resultados da busca
                </Typography>
                {users.searchResults.length > 0 ? (
                  <Grid container spacing={3}>
                    {users.searchResults.map((user) => (
                      <Grid item xs={12} sm={6} md={4} key={user._id}>
                        <UserCard user={user} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">
                    Nenhum usuário encontrado com "{searchQuery}"
                  </Alert>
                )}
              </Box>
            )}
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {searchQuery ? 'Outros usuários que podem te interessar' : 'Usuários em Destaque'}
            </Typography>
            <Grid container spacing={3}>
              {users.featuredUsers.map((user) => (
                <Grid item xs={12} sm={6} md={4} key={user._id}>
                  <UserCard user={user} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}