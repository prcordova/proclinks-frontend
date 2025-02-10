import { Avatar, Card, CardContent, Stack, Typography, Chip, Box, Grid } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Link from 'next/link'
import { getImageUrl } from '@/utils/url'
import { getPlanStyle } from '@/utils/planStyles'

interface User {
  username: string
  avatar?: string
  bio?: string
  followers: number
  following: number
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

            <Typography variant="h6" align="center" noWrap>
              {user.username}
            </Typography>

            <Typography 
              variant="body2" 
              color="text.secondary"
              align="center"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: 40,
                maxHeight: 40,
                width: '100%'
              }}
            >
              {user.bio || 'Sem biografia'}
            </Typography>

            <Box sx={{ width: '100%' }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={4}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Chip
                      icon={<PeopleIcon sx={{ fontSize: '1.2rem' }} />}
                      label={user.followers || 0}
                      size="small"
                      sx={{
                        minWidth: 80,
                        border: 'none',
                        backgroundColor: 'transparent',
                        '& .MuiChip-label': {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5
                        }
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      display="block" 
                      textAlign="center"
                    >
                      Seguidores
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={4}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Chip
                      icon={<PersonAddIcon sx={{ fontSize: '1.2rem' }} />}
                      label={user.following || 0}
                      size="small"
                      sx={{
                        minWidth: 80,
                        border: 'none',
                        backgroundColor: 'transparent',
                        '& .MuiChip-label': {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5
                        }
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      display="block" 
                      textAlign="center"
                    >
                      Seguindo
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={4}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Chip
                      icon={<FavoriteIcon sx={{ fontSize: '1.2rem' }} />}
                      label={`${user.totalLikes || 0}`}
                      size="small"
                      sx={{
                        minWidth: 80,
                        border: 'none',
                        backgroundColor: 'transparent',
                        '& .MuiChip-label': {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5
                        }
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      display="block" 
                      textAlign="center"
                    >
                      Likes
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  )
} 