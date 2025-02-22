import { Avatar, Card, CardContent,  Button, Box, Typography } from '@mui/material'
import { getImageUrl } from '@/utils/url'
import { getPlanStyle } from '@/utils/planStyles'
import { FriendshipButton } from '../FriendshipButton/friendship-button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useState, useEffect } from 'react'
import { userApi } from '@/services/api'
import { toast } from 'react-hot-toast'

interface User {
  _id: string
  username: string
  avatar?: string
  bio?: string
  followers: number | string[]
  following: number | string[]
  totalLikes?: number
  plan?: {
    type: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
  }
  friendshipStatus?: 'NONE' | 'PENDING' | 'FRIENDLY'
  friendshipId?: string
  friendshipInitiator?: 'ME' | 'THEM'
  recipient?: string
}

interface UserCardProps {
  user: User
  showFriendshipButton?: boolean
  showFriendshipActions?: boolean
  isRequester?: boolean
  onFriendshipAction?: (action: 'accept' | 'reject' | 'cancel', friendshipId?: string) => Promise<void>
}

export function UserCard({ 
  user, 
  showFriendshipButton = true,
  showFriendshipActions = false,
  isRequester = false,
  onFriendshipAction
}: UserCardProps) {
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [friendshipStatus, setFriendshipStatus] = useState(user.friendshipStatus || 'NONE')
  const [friendshipId, setFriendshipId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user._id) {
      userApi.friendships.checkStatus(user._id)
        .then(response => {
          setFriendshipStatus(response.data.data.status)
          setFriendshipId(response.data.data.friendshipId)
        })
        .catch(console.error)
    }
  }, [user._id])

  if (!user || !user.username) {
    return null
  }

  const handleCardClick = () => {
    router.push(`/user/${user.username}`)
  }

  const handleFriendshipAction = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      if (onFriendshipAction) {
        await onFriendshipAction('accept', friendshipId || undefined)
        return
      }

      switch (friendshipStatus) {
        case 'NONE':
          await userApi.friendships.send(user._id)
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

  return (
    <Card sx={{ 
      height: '100%',
      minWidth: 250,
      maxWidth: '290px',
      '&:hover': { 
        transform: 'translateY(-4px)',
        boxShadow: 4
      },
      transition: 'all 0.2s'
    }}>
      {/* Área clicável apenas na imagem */}
      <Box 
        onClick={handleCardClick}
        style={{ 
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <Avatar 
          src={user.avatar ? getImageUrl(user.avatar) || undefined : undefined}
          sx={{ 
            width: 120,
            height: 120,
            border: 3,
            ...getPlanStyle(user.plan?.type)
          }}
        >
          {!user.avatar ? user.username.slice(0, 2).toUpperCase() : null}
        </Avatar>
      </Box>

      {/* Área de informações não clicável */}
      <CardContent sx={{ 
        height: '240px',
        p: 2,
        '&:last-child': { pb: 2 },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          width: '100%',
          gap: 1,
          flex: 1
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {user.username}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 4
          }}>
           
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Seguidores
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {Array.isArray(user.followers) ? user.followers.length : user.followers}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Seguindo
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {Array.isArray(user.following) ? user.following.length : user.following}
              </Typography>
            </Box>
          </Box>
          
          {showFriendshipButton && currentUser?.id !== user._id && (
            <Box sx={{ width: '100%', mt: 'auto' }}>
              <FriendshipButton
                status={friendshipStatus}
                onClick={handleFriendshipAction}
                size="small"
                disabled={isLoading}
              />
            </Box>
          )}

          {/* Solicitações que EU recebi - botões de aceitar/recusar */}
          {showFriendshipActions && user.friendshipStatus === 'PENDING' && (
            <Box sx={{ display: 'flex', gap: 1, width: '100%', mt: 'auto' }}>
              {isRequester ? (
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation()
                    onFriendshipAction?.('cancel', user.friendshipId)
                  }}
                >
                  Cancelar solicitação
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation()
                      onFriendshipAction?.('accept', user.friendshipId)
                    }}
                  >
                    Aceitar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation()
                      onFriendshipAction?.('reject', user.friendshipId)
                    }}
                  >
                    Recusar
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
} 