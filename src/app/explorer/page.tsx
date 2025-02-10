'use client'

import { useState, useEffect } from 'react'
import { 
  Container, Typography, TextField, InputAdornment,
  Box, Grid, Alert, Button
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { ExplorerSidebar, FilterOption } from '@/components/explorer-sidebar'
import { UserCard } from '@/components/user-card'
import { userApi } from '@/services/api'
import { useDebounce } from '@/hooks/useDebounce'

interface User {
  _id: string
  username: string
  avatar?: string
  bio?: string
  plan: {
    type: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
    status: string
  }
  followers: number
  following: number
}

export default function ExplorerPage() {
  const [users, setUsers] = useState<{
    searchResults: User[]
    featuredUsers: User[]
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
      
      setUsers(prev => ({
        searchResults: pageNum === 1 ? response.data.searchResults : [...prev.searchResults, ...response.data.searchResults],
        featuredUsers: response.data.featuredUsers
      }))
      setHasMore(response.data.hasMore)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useDebounce((...args: unknown[]) => {
    const searchValue = args[0] as string
    setPage(1)
    fetchUsers(1, selectedFilter, searchValue)
  }, 300)

  useEffect(() => {
    setPage(1)
    fetchUsers(1, selectedFilter, searchQuery)
  }, [selectedFilter, searchQuery])

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
        gap: 4,
        maxWidth: '100%'
      }}>
        <Box sx={{ 
          width: { xs: '100%', md: 280 },
          flexShrink: 0
        }}>
          <ExplorerSidebar
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </Box>

        <Box sx={{ 
          flex: 1,
          maxWidth: '100%'
        }}>
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
                  <Grid 
                    container 
                    spacing={3} 
                    justifyContent="center"
                    sx={{ 
                      '& .MuiGrid-item': {
                        display: 'flex',
                        justifyContent: 'center'
                      }
                    }}
                  >
                    {users.searchResults.map((user) => (
                      <Grid 
                        item 
                        xs={12} 
                        sm={6} 
                        lg={4} 
                        xl={3} 
                        key={user._id}
                      >
                        <UserCard user={user} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">
                    Nenhum usuário encontrado com &ldquo;{searchQuery}&rdquo;
                  </Alert>
                )}
              </Box>
            )}
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {searchQuery ? 'Outros usuários que podem te interessar' : 'Usuários em Destaque'}
            </Typography>
            <Grid 
              container 
              spacing={{ xs: 2, sm: 3 }}
              columns={{ xs: 1, sm: 12, md: 12, lg: 12 }}
              sx={{ 
                width: '100%',
                margin: '0 auto',
                '& .MuiGrid-item': {
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%'
                }
              }}
            >
              {users.featuredUsers.map((user) => (
                <Grid 
                  item 
                  xs={1}
                  sm={6}
                  md={6}
                  lg={4}
                  key={user._id}
                >
                  <Box sx={{ 
                    width: '100%', 
                    maxWidth: 340,
                    px: 1
                  }}>
                    <UserCard user={user} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {hasMore && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setPage(prev => prev + 1)
                  fetchUsers(page + 1, selectedFilter, searchQuery)
                }}
                disabled={loading}
              >
                {loading ? 'Carregando...' : 'Carregar mais'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  )
}