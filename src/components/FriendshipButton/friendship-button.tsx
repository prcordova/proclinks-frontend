'use client'

import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import PeopleIcon from '@mui/icons-material/People'
import { useState } from 'react'
import { userApi } from '@/services/api'
import { toast } from 'react-hot-toast'

interface FriendshipButtonProps {
  userId: string
  initialStatus: 'NONE' | 'PENDING' | 'FRIENDLY'
  size?: 'small' | 'medium' | 'large'
}

const statusConfig = {
  NONE: {
    text: 'Adicionar amigo',
    icon: PersonAddIcon,
    color: 'primary',
    variant: 'contained'
  },
  PENDING: {
    text: 'Solicitação enviada',
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

export function FriendshipButton({ userId, initialStatus, size = 'medium' }: FriendshipButtonProps) {
  const [status, setStatus] = useState(initialStatus)
  const [openDialog, setOpenDialog] = useState(false)
  
  const config = statusConfig[status]
  const Icon = config.icon

  const handleConfirmRemove = async () => {
    try {
      await userApi.rejectFriendRequest(userId)
      setStatus('NONE')
      toast.success('Amizade removida!')
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar solicitação'
      toast.error(errorMessage)
    }
    setOpenDialog(false)
  }

  const handleClick = async () => {
    try {
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
          setOpenDialog(true)
          break
      }
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar solicitação'
      toast.error(errorMessage)
    }
  }

  return (
    <>
      <Button
        variant={config.variant}
        color={config.color}
        size={size}
        fullWidth
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
        onClick={handleClick}
      >
        {config.text}
      </Button>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>
          Tem certeza que deseja remover esta amizade?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmRemove} color="error" variant="contained">
            Remover
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
} 