'use client'

import { useState, useEffect } from 'react'
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Box,
  Avatar, Menu, MenuItem, 
  Tooltip, Container
} from '@mui/material'
import { useThemeContext } from '@/contexts/theme-context'
import { useAuth } from '@/contexts/auth-context'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
 import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { userApi } from '@/services/api'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'

const PLAN_STYLES = {
  FREE: {
    border: 'none'
  },
  BRONZE: {
    border: '2px solid #CD7F32'
  },
  SILVER: {
    border: '2px solid #C0C0C0'
  },
  GOLD: {
    border: '2px solid #FFD700'
  }
}

export function Header() {
  const { mode, setMode } = useThemeContext()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      userApi.getMyProfile()
        .then(response => {
          if (response.data?.avatar) {
            setAvatarUrl(`${process.env.NEXT_PUBLIC_API_URL}${response.data.avatar}`)
          }
        })
        .catch(error => console.error('Erro ao buscar perfil:', error))
    }
  }, [user?.id])

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  const getPlanStyle = () => {
    return PLAN_STYLES[user?.plan?.type || 'FREE']
  }

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: theme => theme.palette.background.default,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            minHeight: 70,
            justifyContent: 'space-between'
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              ProcLinks
            </Typography>
          </Link>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Explorar Perfis">
              <IconButton
                component={Link}
                href="/explorer"
                sx={{ color: 'text.secondary' }}
              >
                <PeopleAltOutlinedIcon />
              </IconButton>
            </Tooltip>

            <IconButton 
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              sx={{ color: 'text.secondary' }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            
            {user ? (
              <>
                <Tooltip title={`${user.username} - ${user.plan?.type || 'Plano Gratuito'}`}>
                  <IconButton onClick={handleMenu}>
                    <Avatar 
                      src={avatarUrl || undefined}
                      sx={{ 
                        width: 35,
                        height: 35,
                        ...getPlanStyle()
                      }}
                    >
                      {!avatarUrl && getInitials(user.username)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem 
                    component={Link}
                    href="/profile"
                    onClick={handleClose}
                  >
                    Meu Perfil
                  </MenuItem>
                  <MenuItem 
                    component={Link}
                    href="/profile/edit"
                    onClick={handleClose}
                  >
                    Editar Links
                  </MenuItem>
                  {user.plan?.type === 'FREE' ? (
                    <MenuItem onClick={() => {
                      handleClose()
                      router.push('/plans')
                    }}>
                      Fazer Upgrade
                    </MenuItem>
                  ) : (
                    <MenuItem 
                      component={Link}
                      href="/plans"
                      onClick={handleClose}
                    >
                      Gerenciar Plano
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => {
                    handleClose()
                    logout()
                  }}>
                    Sair
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button 
                  component={Link}
                  href="/login"
                  color="inherit"
                >
                  Login
                </Button>
                <Button 
                  component={Link}
                  href="/register"
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                >
                  Criar Conta
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
} 