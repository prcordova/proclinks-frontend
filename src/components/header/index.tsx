'use client'

import { useState } from 'react'
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

export function Header() {
  const { mode, setMode } = useThemeContext()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
              <Tooltip title="Menu do usuário">
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {getInitials(user.username)}
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
                <MenuItem 
                  component={Link}
                  href="/profile/settings"
                  onClick={handleClose}
                >
                  Configurações
                </MenuItem>
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