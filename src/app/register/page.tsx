'use client'

import { useState } from "react"
import { 
  Button, Container, Typography, Box, Divider, Paper,
  TextField
} from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import { authApi } from "@/services/api"
import { useRouter } from "next/navigation"
import Link from 'next/link'
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3')
  }

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value

    if (field === 'cpf') {
      value = value.replace(/\D/g, '').slice(0, 11)
      value = formatCPF(value)
    }
    
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 11)
      value = formatPhone(value)
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    const cleanCpf = formData.cpf.replace(/\D/g, '')
    const cleanPhone = formData.phone.replace(/\D/g, '')

    if (cleanCpf.length !== 11) {
      setError('CPF inválido')
      return
    }

    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      setError('Telefone inválido')
      return
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        cpf: cleanCpf,
        phone: cleanPhone
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
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
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
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
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={formData.username}
              onChange={handleChange('username')}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="CPF"
              value={formData.cpf}
              onChange={handleChange('cpf')}
              disabled={loading}
              inputProps={{ maxLength: 14 }}
              placeholder="000.000.000-00"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Telefone"
              value={formData.phone}
              onChange={handleChange('phone')}
              disabled={loading}
              inputProps={{ maxLength: 15 }}
              placeholder="(00) 00000-0000"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              disabled={loading}
            />
            <TextField
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