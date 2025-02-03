'use client'

import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button, Container, Typography, Box, Divider, Paper } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import { authApi } from "@/services/api"
import { useRouter } from "next/navigation"
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await authApi.login(username, password)
      localStorage.setItem('token', data.token)
      router.push('/profile')
    } catch (err) {
      console.log(err)
      setError('Usuário ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    console.log(`Login com ${provider}`)
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 4
      }}>
        <Paper elevation={3} sx={{ 
          p: 4, 
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}>
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            Bem-vindo de volta
          </Typography>
          
          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mb: 2, 
                textAlign: 'center',
                bgcolor: 'error.main',
                color: 'error.contrastText',
                py: 1,
                px: 2,
                borderRadius: 1
              }}
            >
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Input
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <Input
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem'
              }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>ou continue com</Divider>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHubIcon />}
              onClick={() => handleSocialLogin('github')}
              disabled={loading}
            >
              GitHub
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
            >
              Facebook
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Não tem uma conta?{' '}
            <Link href="/register" style={{ color: 'inherit', fontWeight: 'bold' }}>
              Cadastre-se
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
} 