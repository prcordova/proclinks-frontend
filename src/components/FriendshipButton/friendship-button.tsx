'use client'

import { Button } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import PeopleIcon from '@mui/icons-material/People'

interface FriendshipButtonProps {
  status: 'NONE' | 'PENDING' | 'FRIENDLY'
  size?: 'small' | 'medium' | 'large'
  onClick: () => void
  disabled?: boolean
}

const statusConfig = {
  NONE: {
    text: 'Amigar',
    icon: PersonAddIcon,
    color: 'primary',
    variant: 'contained'
  },
  PENDING: {
    text: 'Enviada',
    icon: HourglassEmptyIcon,
    color: 'warning',
    variant: 'outlined'
  },
  FRIENDLY: {
    text: 'Amigos',
    icon: PeopleIcon,
    color: 'success',
    variant: 'outlined'
  }
} as const

export function FriendshipButton({ 
  status, 
  size = 'medium', 
  onClick,
  disabled = false 
}: FriendshipButtonProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Button
      variant={config.variant}
      color={config.color}
      size={size}
      fullWidth
      disabled={disabled}
      startIcon={<Icon />}
      sx={{
        py: 1,
        textTransform: 'none',
        fontWeight: 'medium',
        '&:hover': {
          transform: 'scale(1.02)'
        },
        transition: 'transform 0.2s'
      }}
      onClick={onClick}
    >
      {config.text}
    </Button>
  )
} 