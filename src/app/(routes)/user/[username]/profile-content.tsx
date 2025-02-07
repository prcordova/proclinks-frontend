'use client'

import { useEffect, useState } from 'react'
import { Container, Box, Typography, Link as MuiLink, CircularProgress } from '@mui/material'
import { userApi } from '@/services/api'
import Avatar from '@mui/material/Avatar'
import { useAuth } from '@/contexts/auth-context'
import { FollowButton } from '@/components/follow-button'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

interface UserProfile {
  id: string
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
  bio?: string
  avatar?: string
  userId: string
  isFollowing: boolean
}

interface AuthUser extends UserProfile {
  _id: string
}

const BUTTON_TEXT = {
  FOLLOW: 'Seguir',
  UNFOLLOW: 'Deixar de Seguir',
  LOADING: 'Carregando...'
} as const

export function ProfileContent({ username }: { username: string }) {
  const { user: currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadProfile = async () => {
    try {
      const profileData = await userApi.getPublicProfile(username)
      const userId = profileData.data.avatar?.split('/users/')[1]?.split('/')[0]
      
      // Verificar se o usuário atual está seguindo o perfil
      const isFollowing = Array.isArray(currentUser?.following) && 
        currentUser?.following.includes(userId)
      
      console.log('Current User Following:', currentUser?.following)
      console.log('Profile UserId:', userId)
      console.log('Is Following:', isFollowing)
      
      setProfile({
        ...profileData.data,
        userId,
        isFollowing // Garantindo que seja booleano
      })
      setLinks(profileData.data.links || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [username])

  // Função para construir a URL completa do avatar
  const getAvatarUrl = (avatarPath: string | null) => {
    if (!avatarPath) return '/default-avatar.png'
    if (avatarPath.startsWith('http')) return avatarPath
    return `${process.env.NEXT_PUBLIC_API_URL}${avatarPath}`
  }

  const handleFollowClick = async () => {
    try {
      setIsLoading(true)
      
      if (profile?.isFollowing) {
        await userApi.unfollowUser(profile.userId)
        setProfile(prev => ({
          ...prev!,
          isFollowing: false,
          followers: Math.max(0, prev!.followers - 1) // Garantir que não fique negativo
        }))
        toast.success('Deixou de seguir com sucesso!')
      } else {
        await userApi.followUser(profile!.userId)
        setProfile(prev => ({
          ...prev!,
          isFollowing: true,
          followers: prev!.followers + 1
        }))
        toast.success('Seguindo com sucesso!')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar seguidor'
      toast.error(errorMessage)
      // Recarregar o perfil em caso de erro para garantir estado correto
      loadProfile()
    } finally {
      setIsLoading(false)
    }
  }

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
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
          gap: 2
        }}>
          {/* Avatar */}
          <Avatar
            src={getAvatarUrl(profile.avatar)}
            alt={profile.username}
            sx={{ 
              width: 120,
              height: 120,
              mb: 2,
              border: '4px solid',
              borderColor: profile.profile.textColor,
              backgroundColor: profile.profile.cardColor
            }}
          />

          {/* Username */}
          <Typography 
            variant="h4"
            sx={{ 
              color: profile.profile.textColor,
              fontWeight: 'bold'
            }}
          >
            {profile.username}
          </Typography>

          {/* @username */}
          <Typography 
            variant="subtitle1"
            sx={{ 
              color: profile.profile.textColor,
              opacity: 0.8
            }}
          >
            @{profile.username}
          </Typography>

          {/* Bio se existir */}
          {profile.bio && (
            <Typography 
              variant="body1"
              align="center"
              sx={{ 
                color: profile.profile.textColor,
                mt: 1,
                maxWidth: '600px'
              }}
            >
              {profile.bio}
            </Typography>
          )}

          {/* Followers/Following */}
          <Box sx={{ 
            display: 'flex',
            gap: 3,
            mt: 2
          }}>
            <Typography 
              sx={{ 
                color: profile.profile.textColor,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <span style={{ fontWeight: 'bold' }}>{profile.following}</span>
              <Link 
          href={`/user/${username}/following`}
          className="text-primary hover:underline"
        >
         Seguindo
        </Link>
            </Typography>

            <Typography 
              sx={{ 
                color: profile.profile.textColor,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <span style={{ fontWeight: 'bold' }}>{profile.followers}</span>
 
              <Link 
          href={`/user/${username}/followers`}
          className="text-primary hover:underline"
        >
          Seguidores
        </Link>
             </Typography>
          </Box>

          {/* Botão de Seguir - Não mostrar para o próprio perfil */}
          {profile && currentUser && currentUser.id !== profile.userId && (
            <FollowButton 
              text={profile.isFollowing ? BUTTON_TEXT.UNFOLLOW : BUTTON_TEXT.FOLLOW}
              isLoading={isLoading}
              onClick={handleFollowClick}
            />
          )}
        </Box>
        {/* Links Section */}
        {links.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            gap: 2,
            textAlign: 'center'
          }}>
            <Typography 
              variant="h6" 
              sx={{ color: profile.profile.textColor }}
            >
              Este usuário ainda não possui links públicos
            </Typography>
          </Box>
        ) : (
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
                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
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
        )}
      </Box>
    </Container>
  )
} 