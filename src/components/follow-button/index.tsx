'use client'

import { Button } from '@mui/material'

interface FollowButtonProps {
  text: string
  isLoading: boolean
  onClick: () => void
}

export function FollowButton({ text, isLoading, onClick }: FollowButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      variant="outlined"
      color="primary"
      fullWidth
      sx={{
        py: 1,
        textTransform: 'none',
        fontWeight: 'medium'
      }}
    >
      {isLoading ? 'Carregando...' : text}
    </Button>
  )
} 