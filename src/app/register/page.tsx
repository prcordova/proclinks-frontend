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

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)

    try {
      const { token, user } = await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      
      localStorage.setItem('token', token)
      localStorage.setItem('currentUser', user.username)
      router.push('/profile/edit')
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSocialLogin = async (provider: string) => {
    console.log(`Cadastro com ${provider}`)
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
            Crie sua conta
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
              value={formData.username}
              onChange={handleChange('username')}
              disabled={loading}
            />
            <Input
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              disabled={loading}
            />
            <Input
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              disabled={loading}
            />
            <Input
              margin="normal"
              required
              fullWidth
              label="Confirmar Senha"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
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
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>ou cadastre-se com</Divider>

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
            Já tem uma conta?{' '}
            <Link href="/login" style={{ color: 'inherit', fontWeight: 'bold' }}>
              Faça login
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
} 