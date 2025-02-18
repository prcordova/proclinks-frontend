'use client'

import { IconButton, Tooltip, Typography } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import PeopleIcon from '@mui/icons-material/People'
import { useState } from 'react'
import { userApi } from '@/services/api'
import { toast } from 'react-hot-toast'

interface FriendshipButtonProps {
  userId: string
  initialStatus: 'NONE' | 'PENDING' | 'FRIENDLY'
  onStatusChange?: (newStatus: 'NONE' | 'PENDING' | 'FRIENDLY') => void
  size?: 'small' | 'medium' | 'large'
}

const statusConfig = {
  NONE: {
    text: 'Adicionar amigo',
    icon: PersonAddIcon,
    tooltip: 'Adicionar amigo',
    color: 'primary'
  },
  PENDING: {
    text: 'Cancelar solicitação',
    icon: HourglassEmptyIcon,
    tooltip: 'Solicitação pendente',
    color: 'warning'
  },
  FRIENDLY: {
    text: 'Remover amizade',
    icon: PeopleIcon,
    tooltip: 'Remover amizade',
    color: 'success'
  }
} as const

export function FriendshipButton({ 
  userId, 
  initialStatus, 
  onStatusChange,
  size = 'medium' 
}: FriendshipButtonProps) {
  const [status, setStatus] = useState(initialStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setIsLoading(true)

      switch (status) {
        case 'NONE':
          await userApi.sendFriendRequest({ recipientId: userId })
          setStatus('PENDING')
          toast.success('Solicitação de amizade enviada!')
          break

        case 'PENDING':
          await userApi.rejectFriendRequest(userId)
          setStatus('NONE')
          toast.success('Solicitação de amizade cancelada!')
          break

        case 'FRIENDLY':
          await userApi.rejectFriendRequest(userId)
          setStatus('NONE')
          toast.success('Amizade removida!')
          break
      }

      onStatusChange?.(status)
    } catch (error) {
      console.error('Erro detalhado:', error)
      toast.error('Erro ao processar solicitação')
    } finally {
      setIsLoading(false)
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Tooltip 
      title={isLoading ? 'Processando...' : config.tooltip}
      arrow
    >
      <span>
        <Typography variant="body2" color="text.secondary">{config.text}</Typography>
        <IconButton
          onClick={handleClick}
          disabled={isLoading}
          size={size}
          color={config.color as 'primary' | 'warning' | 'success'}
          aria-label={config.tooltip}
          sx={{
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.2s'
          }}
        >
          <Icon />
        </IconButton>
      </span>
    </Tooltip>
  )
} 