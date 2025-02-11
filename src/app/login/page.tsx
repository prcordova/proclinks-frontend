'use client'

import { useState } from "react"
import { Button, Container, Typography, Box,   Paper } from '@mui/material'
 
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { AxiosError } from 'axios'

export default function LoginPage() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.username, formData.password)
      // O redirecionamento já é feito no contexto
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      console.error('Erro no login:', err)
      setError(err.response?.data?.message || 'Erro ao fazer login')
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

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 4
      }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}
          >
            Login
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

          <Box component="form" onSubmit={handleSubmit}>
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
              label="Senha"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem' }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
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