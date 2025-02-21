'use client'

import { useEffect, useState, useCallback } from 'react'
import { Container, Box, Typography, IconButton } from '@mui/material'
import { userApi } from '@/services/api'
import { useAuth } from '@/contexts/auth-context'
import { FollowButton } from '@/components/follow-button'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { CustomAvatar } from '@/components/avatar'
import { useRouter } from 'next/navigation'
import EditIcon from '@mui/icons-material/Edit'
import { CustomLink } from '@/components/custom-link'
import { useLoading } from '@/contexts/loading-context'
import { FriendshipButton } from '@/components/FriendshipButton/friendship-button'

interface UserLink {
  _id: string
  title: string
  url: string
  visible: boolean
  order: number
  likes: number
  userId: string
  createdAt: string
  updatedAt: string
}

interface PlanFeatures {
  maxLinks: number
  customization: boolean
  analytics: boolean
  priority: boolean
  support: 'basic' | 'priority' | 'vip'
}

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
  links: UserLink[]
  bio?: string
  avatar?: string
  userId: string
  isFollowing: boolean
  plan?: {
    type: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
    status: string
    features: PlanFeatures
  }
}

const BUTTON_TEXT = {
  FOLLOW: 'Seguir',
  UNFOLLOW: 'Seguindo',
  LOADING: 'Carregando...'
} as const

export function ProfileContent({ username }: { username: string }) {
  const { user: currentUser } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [links, setLinks] = useState<UserLink[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const { setIsLoading , isLoading } = useLoading()
  const [friendshipStatus, setFriendshipStatus] = useState<'NONE' | 'PENDING' | 'FRIENDLY'>('NONE')
  const [friendshipId, setFriendshipId] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      const profileData = await userApi.getPublicProfile(username)
      setProfile({
        ...profileData.data,
        userId: profileData.data.id
      })
      
      // Carregar status de amizade
      if (currentUser?.id) {
        const friendshipData = await userApi.friendships.checkStatus(profileData.data.id)
        setFriendshipStatus(friendshipData.data.data.status)
        setFriendshipId(friendshipData.data.data.friendshipId)
      }
      
      setIsFollowing(Array.isArray(profileData.data.followersIds) && 
        profileData.data.followersIds.includes(currentUser?.id))
      setLinks(profileData.data.links || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }, [username, currentUser?.id, setIsLoading])

  useEffect(() => {
    loadProfile()
  }, [username, loadProfile])

  const handleFollowClick = async () => {
    console.log('currentUser', currentUser)
    console.log('profile', profile)
    try {
      setIsLoading(true)
      
      if (!profile?.id) {
        throw new Error('ID do usuário não encontrado')
      }
      
      if (isFollowing) {
        await userApi.unfollowUser(profile.id)
        setIsFollowing(false)
        toast.success('Deixou de seguir com sucesso!')
      } else {
        await userApi.followUser(profile.id)
        setIsFollowing(true)
        toast.success('Seguindo com sucesso!')
      }
      
      loadProfile()
    } catch (error) {
      const err = error as Error
      toast.error(err.message || 'Erro ao atualizar seguidor')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFriendshipAction = async () => {
    if (isLoading || !profile?.id) return
    setIsLoading(true)

    try {
      switch (friendshipStatus) {
        case 'NONE':
          await userApi.friendships.send(profile.id)
          setFriendshipStatus('PENDING')
          toast.success('Solicitação de amizade enviada!')
          break

        case 'PENDING':
          if (friendshipId) {
            await userApi.friendships.reject(friendshipId)
            setFriendshipStatus('NONE')
            toast.success('Solicitação de amizade cancelada!')
          }
          break

        case 'FRIENDLY':
          if (friendshipId) {
            await userApi.friendships.unfriend(friendshipId)
            setFriendshipStatus('NONE')
            toast.success('Amizade removida!')
          }
          break
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar solicitação'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
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
          {/* Avatar atualizado */}
          <CustomAvatar
            src={profile.avatar || null}
            username={profile.username}
            size={120}
            planType={profile.plan?.type || 'FREE'}
            editable={false}
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

          {/* Bio com botão de edição */}
          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Typography 
              sx={{ 
                color: profile.profile.textColor,
                fontStyle: profile.bio ? 'normal' : 'italic'
              }}
            >
              {profile.bio || 'Sem bio'}
            </Typography>
            
            {/* Mostra o botão se o usuário logado está vendo seu próprio perfil */}
            {currentUser?.username === username && (
              <IconButton 
                onClick={() => router.push('/profile/edit')}
                size="small"
                sx={{ color: profile.profile.textColor }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

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

          {/* Botão de Follow */}
          {profile && currentUser && currentUser?.username !== username && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FollowButton 
                text={isFollowing ? BUTTON_TEXT.UNFOLLOW : BUTTON_TEXT.FOLLOW}
                isLoading={isLoading}
                onClick={handleFollowClick}
              />
              <FriendshipButton 
                status={friendshipStatus}
                onClick={handleFriendshipAction}
                disabled={isLoading}
              />
            </Box>
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
              <CustomLink
                key={link._id}
                title={link.title}
                url={link.url}
                likes={link.likes}
                profile={profile.profile}
              />
            ))}
          </Box>
        )}
      </Box>
    </Container>
  )
} 