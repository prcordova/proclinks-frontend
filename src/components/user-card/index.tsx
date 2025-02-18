import { Avatar, Card, CardContent,  Button, Box, Typography } from '@mui/material'
 import { getImageUrl } from '@/utils/url'
import { getPlanStyle } from '@/utils/planStyles'
 import { FriendshipButton } from '../FriendshipButton/friendship-button'
import { useRouter } from 'next/navigation'
 

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
}

interface UserCardProps {
  user: User
  showFriendshipActions?: boolean
  showFriendshipButton?: boolean
  onFriendshipAction?: (userId: string, action: 'accept' | 'reject', friendshipId?: string) => Promise<void>
}

export function UserCard({ 
  user, 
  showFriendshipActions,
  showFriendshipButton = true,
  onFriendshipAction
}: UserCardProps) {
  const router = useRouter()

  if (!user || !user.username) {
    return null
  }

  const handleCardClick = (e: React.MouseEvent) => {
    router.push(`/user/${user.username}`)
  }

  const handleAcceptFriend = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onFriendshipAction) {
      await onFriendshipAction(user._id, 'accept')
    }
  }

  const handleRejectFriend = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onFriendshipAction) {
      await onFriendshipAction(user._id, 'reject', user.friendshipId)
    }
  }

  return (
    <Card sx={{ 
      height: '100%',
      minWidth: 230,
      maxWidth: '100%',
      '&:hover': { 
        transform: 'translateY(-4px)',
        boxShadow: 4
      },
      transition: 'all 0.2s'
    }}>
      {/* Área clicável apenas na imagem */}
      <div 
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
      >
        <Avatar 
          src={user.avatar ? getImageUrl(user.avatar) || undefined : undefined}
          sx={{ 
            width: '100%',
            height: 280,
            borderRadius: 0,
            border: 3,
            ...getPlanStyle(user.plan?.type)
          }}
        >
          {!user.avatar ? user.username.slice(0, 2).toUpperCase() : null}
        </Avatar>
      </div>

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
          
          {showFriendshipButton && user.friendshipStatus && (
            <Box sx={{ width: '100%', mt: 'auto' }}>
              <FriendshipButton
                userId={user._id}
                initialStatus={user.friendshipStatus}
                size="small"
              />
            </Box>
          )}

          {showFriendshipActions && user.friendshipStatus === 'PENDING' && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              width: '100%',
              mt: 'auto'
            }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation()
                  handleAcceptFriend(e)
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
                  handleRejectFriend(e)
                }}
              >
                Recusar
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
} 