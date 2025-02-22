'use client'

import { Box, Skeleton } from '@mui/material'

interface ContainerCardsProps {
  children: React.ReactNode
  emptyMessage?: string
  isEmpty?: boolean
  isLoading?: boolean
  className?: string
}

const UserCardSkeleton = () => (
  <Box sx={{ width: '100%', maxWidth: 290, px: 1 }}>
    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 1 }} />
  </Box>
)

export function ContainerCards({ 
  children, 
  emptyMessage = "Nenhum item encontrado",
  isEmpty = false,
  isLoading = false,
 
}: ContainerCardsProps) {
  if (isLoading) {
    return (
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 4,
        justifyItems: 'center',
        maxWidth: 1600,
        mx: 'auto',
        p: 2
      }}>
        {Array.from(new Array(8)).map((_, index) => (
          <UserCardSkeleton key={index} />
        ))}
      </Box>
    )
  }

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      },
      gap: 4,
      justifyItems: 'center',
      alignItems: 'start',
      maxWidth: 1600,
      mx: 'auto',
      p: 2,
      '& > *': {
        width: '100%',
        maxWidth: 290,
        minHeight: 400,
      }
    }}>
      {isEmpty ? (
        <Box sx={{ 
          gridColumn: '1/-1', 
          textAlign: 'center',
          color: 'text.secondary'
        }}>
          {emptyMessage}
        </Box>
      ) : (
        children
      )}
    </Box>
  )
} 