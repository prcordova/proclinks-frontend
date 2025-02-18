import { Avatar, Card, CardContent, Stack, Button, Box } from '@mui/material'
import Link from 'next/link'
import { getImageUrl } from '@/utils/url'
import { getPlanStyle } from '@/utils/planStyles'
import UserInfo from '../userInfo'

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
}

interface UserCardProps {
  user: User
  showFriendshipActions?: boolean
  onAcceptFriend?: () => void
  onRejectFriend?: () => void
}

export function UserCard({ 
  user, 
  showFriendshipActions,
  onAcceptFriend,
  onRejectFriend 
}: UserCardProps) {
  const cardContent = (
    <CardContent>
      <Stack spacing={2} alignItems="center">
        <Avatar 
          src={user.avatar ? getImageUrl(user.avatar) || undefined : undefined}
          sx={{ 
            width: 120,
            height: 120,
            border: 3,
            ...getPlanStyle(user.plan?.type)
          }}
        >
          {!user.avatar && user.username.slice(0, 2).toUpperCase()}
        </Avatar>

        <UserInfo 
          username={user.username} 
          bio={user.bio} 
          followers={typeof user.followers === 'number' ? user.followers : user.followers.length}
          following={typeof user.following === 'number' ? user.following : user.following.length}
        />

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
              onClick={(e) => {
                e.preventDefault()
                onAcceptFriend?.()
              }}
            >
              Aceitar
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={(e) => {
                e.preventDefault()
                onRejectFriend?.()
              }}
            >
              Recusar
            </Button>
          </Box>
        )}
      </Stack>
    </CardContent>
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