'use client'

import { useEffect, useState } from 'react'
import { Container, Box, Typography, Link as MuiLink, CircularProgress } from '@mui/material'
import { userApi, linkApi } from '@/services/api'

interface UserProfile {
  _id: string
  username: string
  profile: {
    backgroundColor: string
    cardColor: string
    textColor: string
    cardTextColor: string
    displayMode: 'grid' | 'list'
    cardStyle: 'rounded' | 'square' | 'pill'
    animation: 'none' | 'fade' | 'slide' | 'bounce'
    font: 'default' | 'serif' | 'mono'
    spacing: number
    likesColor: string
    sortMode: string
  }
  followers: number
  following: number
  links: any[]
}

export function ProfileContent({ username }: { username: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await userApi.getPublicProfile(username)
        setProfile(profileData.data)
        setLinks(profileData.data.links || [])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [username])

  if (loading) {
    return <CircularProgress />
  }

  if (!profile) {
    return <Typography>Perfil não encontrado</Typography>
  }

  return (
    <Container>
      <Box sx={{ 
        minHeight: '100vh',
        py: 4,
        bgcolor: profile.profile.backgroundColor,
        fontFamily: profile.profile.font === 'serif' 
          ? 'serif' 
          : profile.profile.font === 'mono' 
            ? 'monospace' 
            : 'inherit'
      }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{ color: profile.profile.textColor }}
        >
          {profile.username}
        </Typography>

        <Typography 
          variant="subtitle1" 
          align="center" 
          gutterBottom
          sx={{ color: profile.profile.textColor }}
        >
          Seguidores: {profile.followers} | Seguindo: {profile.following}
        </Typography>

        <Box sx={{ 
          display: 'flex',
          flexDirection: profile.profile.displayMode === 'grid' ? 'row' : 'column',
          flexWrap: profile.profile.displayMode === 'grid' ? 'wrap' : 'nowrap',
          gap: `${profile.profile.spacing}px`,
          justifyContent: 'center',
          px: 2,
          mt: 4
        }}>
          {links.map((link) => (
            <MuiLink
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'block',
                width: profile.profile.displayMode === 'grid' ? 'calc(50% - 8px)' : '100%',
                p: 2,
                bgcolor: profile.profile.cardColor,
                color: profile.profile.cardTextColor,
                borderRadius: profile.profile.cardStyle === 'pill' ? '24px' : 
                           profile.profile.cardStyle === 'square' ? '0px' : '8px',
                textDecoration: 'none',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }
              }}
            >
              {link.title}
              {link.likes > 0 && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    mt: 1,
                    color: profile.profile.likesColor
                  }}
                >
                  ❤️ {link.likes}
                </Typography>
              )}
            </MuiLink>
          ))}
        </Box>
      </Box>
    </Container>
  )
} 