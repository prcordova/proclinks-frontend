import { Avatar, Card, CardContent, Stack } from '@mui/material'
 
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
}

export function UserCard({ user }: { user: User }) {
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
          </Stack>
        </CardContent>
      </Card>
    </Link>
  )
} 