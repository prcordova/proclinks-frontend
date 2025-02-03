'use client'

import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material'
import { useThemeContext } from '@/contexts/theme-context'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Header() {
  const { mode, setMode } = useThemeContext()
  const router = useRouter()

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 2 }}>
            ProcLinks
          </Typography>
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
            color="inherit"
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          
          <Button 
            color="inherit" 
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => router.push('/register')}
          >
            Cadastrar
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
} 