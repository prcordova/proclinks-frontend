import { Avatar, Card, CardContent,  Button, Box, Typography } from '@mui/material'
import { getImageUrl } from '@/utils/url'
import { getPlanStyle } from '@/utils/planStyles'
import { FriendshipButton } from '../FriendshipButton/friendship-button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useState } from 'react'
import { userApi } from '@/services/api'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
 
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
  isRequester?: boolean
  isRecipient?: boolean
  createdAt?: string
}

interface UserCardProps {
  user: User
  showFriendshipButton?: boolean
  showFriendshipActions?: boolean
  isRequester?: boolean
  onFriendshipAction?: (action: 'accept' | 'reject' | 'cancel' | 'send' | 'unfriend', friendshipId?: string, userId?: string) => Promise<void>
}

export function UserCard({ 
  user, 
  showFriendshipButton = true,
  showFriendshipActions = false,
 
  onFriendshipAction
}: UserCardProps) {
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [friendshipStatus, setFriendshipStatus] = useState(user.friendshipStatus || 'NONE')
  const friendshipId = user.friendshipId || null
  const [isLoading, setIsLoading] = useState(false)

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
        switch (friendshipStatus) {
          case 'NONE':
            const response = await userApi.friendships.send(user._id)
            setFriendshipStatus('PENDING')
            user.isRequester = true
            user.isRecipient = false
            user.friendshipId = response.data.data._id
            onFriendshipAction('send', response.data.data._id, user._id)
            toast.success('Solicitação de amizade enviada!')
            break
          case 'PENDING':
            if (friendshipId) {
              if (user.isRecipient) {
                toast.error('Você não pode cancelar uma solicitação que recebeu')
                return
              }
              await onFriendshipAction('cancel', friendshipId, user._id)
              setFriendshipStatus('NONE')
              user.isRequester = false
              user.isRecipient = false
              toast.success('Solicitação cancelada!')
            }
            break
          case 'FRIENDLY':
            if (friendshipId) {
              await onFriendshipAction('unfriend', friendshipId, user._id)
              setFriendshipStatus('NONE')
              user.isRequester = false
              user.isRecipient = false
              toast.success('Amizade removida!')
            }
            break
        }
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

  const shouldShowFriendshipButton = () => {
    if (currentUser?.id === user._id) return false;
    if (friendshipStatus === 'PENDING' && user.isRecipient) {
      return false;
    }

    return showFriendshipButton;
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
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Área de conteúdo principal */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          flex: 1,
          minHeight: 0 // Importante para o flex funcionar corretamente
        }}>
          {/* Informações do usuário */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
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
          </Box>

          {/* Texto de tempo - agora no meio */}
          {user.createdAt && (
            <Typography variant="caption" color="text.secondary" align="center">
              {user.friendshipStatus === 'FRIENDLY' 
                ? 'Amigos desde ' 
                : user.isRequester 
                  ? 'Solicitação enviada em ' 
                  : 'Solicitação recebida em '}
              {format(new Date(user.createdAt), "dd 'de' MMMM 'de' yyyy")}
            </Typography>
          )}
        </Box>

        {/* Área de botões - sempre no final */}
        <Box sx={{ 
          mt: 'auto',
          pt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          {shouldShowFriendshipButton() && (
            <FriendshipButton
              status={friendshipStatus}
              onClick={handleFriendshipAction}
              size="small"
              disabled={isLoading}
              isRequester={user.isRequester}
              isRecipient={user.isRecipient}
            />
          )}

          {friendshipStatus === 'PENDING' && (
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              {user.isRequester && (
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation()
                    onFriendshipAction?.('cancel', friendshipId ?? undefined, user._id)
                  }}
                >
                  Cancelar solicitação
                </Button>
              )}
              {user.isRecipient && showFriendshipActions && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation()
                      onFriendshipAction?.('accept', friendshipId ?? undefined, user._id)
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
                      onFriendshipAction?.('reject', friendshipId ?? undefined, user._id)
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