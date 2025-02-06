import { Avatar, Card, CardContent, Stack, Typography, Chip, Box, Grid } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Link from 'next/link'

const getPlanStyle = (planType?: string) => {
  switch (planType) {
    case 'GOLD':
      return { borderColor: '#FFD700' }
    case 'SILVER':
      return { borderColor: '#C0C0C0' }
    case 'BRONZE':
      return { borderColor: '#CD7F32' }
    default:
      return { borderColor: 'primary.main' }
  }
}

export function UserCard({ user }: { user: any }) {
  return (
    <Link href={`/user/${user.username}`} style={{ textDecoration: 'none' }}>
      <Card sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s',
        height: '100%',
        '&:hover': { 
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Avatar 
              src={user.avatar ? `${process.env.NEXT_PUBLIC_API_URL}${user.avatar}` : undefined} 
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
              <Grid container spacing={1} justifyContent="center">
                <Grid item xs={12} sm={4}>
                  <Chip
                    icon={<PeopleIcon sx={{ fontSize: '1.1rem' }} />}
                    label={`${user.followers?.length || 0}`}
                    variant="outlined"
                    size="small"
                    sx={{
                      width: '100%',
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
                    sx={{ mt: 0.5 }}
                  >
                    Seguidores
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Chip
                    icon={<PersonAddIcon sx={{ fontSize: '1.1rem' }} />}
                    label={`${user.following?.length || 0}`}
                    variant="outlined"
                    size="small"
                    sx={{
                      width: '100%',
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
                    sx={{ mt: 0.5 }}
                  >
                    Seguindo
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Chip
                    icon={<FavoriteIcon sx={{ fontSize: '1.1rem' }} />}
                    label={`${user.totalLikes || 0}`}
                    variant="outlined"
                    size="small"
                    sx={{
                      width: '100%',
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
                    sx={{ mt: 0.5 }}
                  >
                    Likes
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  )
} 