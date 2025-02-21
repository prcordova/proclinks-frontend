'use client'

import { Box,   Skeleton } from '@mui/material'

interface ContainerCardsProps {
  children: React.ReactNode
  emptyMessage?: string
  isEmpty?: boolean
  isLoading?: boolean
  className?: string
}

const UserCardSkeleton = () => (
  <Box sx={{ width: '100%', maxWidth: 340, px: 1 }}>
    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
  </Box>
)

export function ContainerCards({ 
  children, 
  emptyMessage = "Nenhum item encontrado",
  isEmpty = false,
  isLoading = false,
  className
}: ContainerCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 place-items-center max-w-[1600px] mx-auto">
        {Array.from(new Array(6)).map((_, index) => (
          <UserCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className={`
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 
      gap-4
      place-items-center
      max-w-[1600px] mx-auto
      [&>*]:w-full [&>*]:max-w-[360px] [&>*]:h-[520px]
      ${className || ''}
    `}>
      {isEmpty ? (
        <p className="text-center text-muted-foreground col-span-full">
          {emptyMessage}
        </p>
      ) : (
        children
      )}
    </div>
  )
} 