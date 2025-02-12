'use client'

import { Button } from '@mui/material'

export type FilterOption = 'popular' | 'recent'

interface FilterOptionsProps {
  selectedFilter: FilterOption
  onFilterChange: (filter: FilterOption) => void
}

export function FilterOptions({ selectedFilter, onFilterChange }: FilterOptionsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant={selectedFilter === 'popular' ? 'contained' : 'outlined'}
        onClick={() => onFilterChange('popular')}
      >
        Popular
      </Button>
      <Button 
        variant={selectedFilter === 'recent' ? 'contained' : 'outlined'}
        onClick={() => onFilterChange('recent')}
      >
        Recente
      </Button>
    </div>
  )
} 