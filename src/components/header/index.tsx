'use client'

import { useState, useEffect } from 'react'
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Box,
  Avatar, Menu, MenuItem, InputBase, alpha,
  Tooltip
} from '@mui/material'
import { useThemeContext } from '@/contexts/theme-context'
import { useAuth } from '@/contexts/auth-context'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import SearchIcon from '@mui/icons-material/Search'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { userApi } from '@/services/api'

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
  const [searchQuery, setSearchQuery] = useState('')
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }
 

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  const getPlanStyle = () => {
    return PLAN_STYLES[user?.plan?.type || 'FREE']
  }

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 2 }}>
            ProcLinks
          </Typography>
        </Link>

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            position: 'relative',
            borderRadius: 1,
            backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
            },
            marginRight: 2,
            marginLeft: 0,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Box sx={{ padding: '0 16px', height: '100%', position: 'absolute', display: 'flex', alignItems: 'center' }}>
            <SearchIcon />
          </Box>
          <InputBase
            sx={{ ml: 6, flex: 1 }}
            placeholder="Procurar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton 
            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
            color="inherit"
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          
          {user ? (
            <>
              <Tooltip title={`${user.username} - ${user.plan?.type || 'Plano Gratuito'}`}>
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  <Avatar 
                    src={avatarUrl || undefined}
                    sx={{ 
                      bgcolor: 'primary.main',
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
                    router.push('/settings')
                  }}>
                    Fazer Upgrade
                  </MenuItem>
                ) : (
                  <MenuItem 
                    component={Link}
                    href="/settings"
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
                color="primary"
              >
                Cadastrar
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
} 