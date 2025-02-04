'use client'

import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { userApi } from '@/services/api'
import { ProfileContent } from '@/app/(routes)/user/[username]/profile-content'

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await userApi.getMyProfile()
        if (response.success) {
          setUsername(response.data.username)
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading || !username) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return <ProfileContent username={username} />
}