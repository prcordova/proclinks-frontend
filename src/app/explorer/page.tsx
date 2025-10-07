'use client'

import { memo, useCallback, useState } from 'react'
import { Container, Typography, Box, Tabs, Tab } from '@mui/material'
import { SearchInput } from '@/components/searchInput'
import { Friends } from '@/components/Friends/friends'
import { FilterOptions, FilterOption } from '@/components/FilterOptions/filter-options'
import { UsersList } from '@/components/UsersList/users-list'

const SearchWrapper = memo(({ value, onChange }: { 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
}) => (
  <SearchInput value={value} onChange={onChange} />
))

SearchWrapper.displayName = 'SearchWrapper'

export default function ExplorerPage() {
  const [mainTab, setMainTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('popular')

  const handleMainTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setMainTab(newValue)
  }

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
        Explorar
      </Typography>

      <Tabs
        value={mainTab}
        onChange={handleMainTabChange}
        centered
        sx={{ mb: 4 }}
      >
        <Tab label="Todos Usuários" />
        <Tab label="Amigos" />
      </Tabs>

      {mainTab === 0 ? (
        <>
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            mb: 4,
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { md: 'space-between' },
            alignItems: 'stretch'
          }}>
            <FilterOptions 
              selectedFilter={selectedFilter} 
              onFilterChange={setSelectedFilter} 
            />
            <Box sx={{ width: { xs: '100%', md: '300px' } }}>
              <SearchWrapper 
                value={searchQuery} 
                onChange={handleSearch} 
              />
            </Box>
          </Box>
          <UsersList 
          
            searchQuery={searchQuery}
            selectedFilter={selectedFilter}
          />
        </>
      ) : (
        <Friends />
      )}
    </Container>
  )
}