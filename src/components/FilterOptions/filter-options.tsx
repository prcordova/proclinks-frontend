'use client'

import { Button } from '@mui/material'
import { PlanLocker } from '../plan-locker'
import { useAuth } from '@/contexts/auth-context'

export type FilterOption = 'popular' | 'recent'


interface FilterOptionsProps {
  selectedFilter: FilterOption
  onFilterChange: (filter: FilterOption) => void
}

export function FilterOptions({ selectedFilter, onFilterChange }: FilterOptionsProps) {
  const { user } = useAuth()
  return (
    <div className="flex gap-2">
      <PlanLocker
        requiredPlan="GOLD"
        currentPlan={user?.plan?.type}
      >
      <Button 
        variant={selectedFilter === 'popular' ? 'contained' : 'outlined'}
        onClick={() => onFilterChange('popular')}
      >
        Popular
      </Button>
      </PlanLocker>
      <PlanLocker
        requiredPlan="GOLD"
        currentPlan={user?.plan?.type}
      >
      <Button 
        variant={selectedFilter === 'recent' ? 'contained' : 'outlined'}
        onClick={() => onFilterChange('recent')}
      >
        Recente
      </Button>
      </PlanLocker>
    </div>
  )
} 