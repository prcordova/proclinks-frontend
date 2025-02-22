'use client'

import {  useState, useEffect } from 'react'
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Box,
   Menu, MenuItem, 
  Tooltip, Container
} from '@mui/material'
import { useThemeContext } from '@/contexts/theme-context'
import { useAuth } from '@/contexts/auth-context'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
 import { useRouter } from 'next/navigation'
import { usePathname } from 'next/dist/client/components/navigation'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { CustomAvatar } from '@/components/avatar'
import { useLoading } from '@/contexts/loading-context'

export function Header() {
  const { setIsLoading } = useLoading()
  const { mode, setMode } = useThemeContext()
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    setIsLoading(false)
  }, [pathname, setIsLoading])

  const handleNavigation = (path: string) => {
    if (path === pathname) {
      handleClose()
      return
    }

    setIsLoading(true)
    handleClose()
    router.push(path)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
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
          <Box 
            onClick={() => handleNavigation('/')} 
            sx={{ 
              cursor: 'pointer', 
              textDecoration: 'none', 
              color: 'inherit' 
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Melter
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Explorar Perfis">
              <IconButton
                onClick={() => handleNavigation('/explorer')}
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
                    <CustomAvatar
                      src={user.avatar || null}
                      username={user.username}
                      size={35}
                      planType={user.plan?.type || 'FREE'}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem 
                    onClick={() => handleNavigation(`/user/${user.username}`)}
                  >
                    Meu Perfil
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleNavigation('/profile/edit')}
                  >
                    Editar Links
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleNavigation('/plans')}
                  >
                    {user.plan?.type === 'FREE' ? 'Fazer Upgrade' : 'Gerenciar Plano'}
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
                  onClick={() => handleNavigation('/login')}
                  color="inherit"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => handleNavigation('/register')}
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