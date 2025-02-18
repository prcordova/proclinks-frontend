import { Avatar, Card, CardContent, Stack, Button, Box } from '@mui/material'
import Link from 'next/link'
import { getImageUrl } from '@/utils/url'
import { getPlanStyle } from '@/utils/planStyles'
import UserInfo from '../userInfo'
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
    // Não navega se o clique foi em um botão
    if ((e.target as HTMLElement).closest('button')) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
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

  const cardContent = (
    <>
      <Avatar 
        src={user.avatar ? getImageUrl(user.avatar) || undefined : undefined}
        sx={{ 
          width: '100%',
          height: 200,
          borderRadius: 0,
          border: 3,
          ...getPlanStyle(user.plan?.type)
        }}
      >
        {!user.avatar ? user.username.slice(0, 2).toUpperCase() : null}
      </Avatar>

      <CardContent>
        <Stack 
          spacing={2} 
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={handleCardClick}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            gap: 1,
            width: '100%'
          }}>
            <UserInfo 
              username={user.username} 
              bio={user.bio} 
              followers={Array.isArray(user.followers) ? user.followers.length : user.followers}
              following={Array.isArray(user.following) ? user.following.length : user.following}
            />
            {showFriendshipButton && user.friendshipStatus && (
              <Box onClick={e => e.stopPropagation()} sx={{ width: '100%' }}>
                <FriendshipButton
                  userId={user._id}
                  initialStatus={user.friendshipStatus}
                  size="small"
                />
              </Box>
            )}
          </Box>

          {showFriendshipActions && user.friendshipStatus === 'PENDING' && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              width: '100%',
              mt: 1 
            }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAcceptFriend}
              >
                Aceitar
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleRejectFriend}
              >
                Recusar
              </Button>
            </Box>
          )}
        </Stack>
      </CardContent>
    </>
  )

  if (showFriendshipActions) {
    return (
      <Card sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s',
        height: '100%',
        minWidth: 230,
        maxWidth: '100%',
        '&:hover': { 
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}>
        {cardContent}
      </Card>
    )
  }

  return (
    <Link href={`/user/${user.username}`} style={{ textDecoration: 'none' }}>
      <Card sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s',
        height: '100%',
        minWidth: 230,
        maxWidth: '100%',
        '&:hover': { 
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}>
        {cardContent}
      </Card>
    </Link>
  )
} 