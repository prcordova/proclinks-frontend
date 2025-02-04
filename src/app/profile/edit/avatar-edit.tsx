'use client'

import { useState } from 'react'
import { Box } from '@mui/material'
import { AvatarUpload } from '@/components/avatar-upload'
import { userApi } from '@/services/api'

interface AvatarEditProps {
  currentAvatar: string | null
  onAvatarUpdated: (newAvatarUrl: string) => void
}

export function AvatarEdit({ currentAvatar, onAvatarUpdated }: AvatarEditProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAvatarChange = async (file: File) => {
    try {
      setIsLoading(true)
      const response = await userApi.updateAvatar(file)
      if (response.success) {
        onAvatarUpdated(response.avatarUrl)
      }
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <AvatarUpload
        currentAvatar={currentAvatar || '/default-avatar.png'}
        onAvatarChange={handleAvatarChange}
        isLoading={isLoading}
      />
    </Box>
  )
}