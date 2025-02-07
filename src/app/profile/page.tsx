'use client'

import { Box, CircularProgress } from '@mui/material'
import { ProfileContent } from '@/app/(routes)/user/[username]/profile-content'
import { useAuth } from '@/contexts/auth-context'

export default function ProfilePage() {
  const { user, loading } = useAuth() // Usando o contexto diretamente

  if (loading || !user?.username) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return <ProfileContent username={user.username} />
}