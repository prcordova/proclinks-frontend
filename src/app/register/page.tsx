'use client'

import { useState } from "react"
import { 
  Button, Container, Typography, Box,  Paper,
  TextField, FormControlLabel, Checkbox
} from '@mui/material'
 
import Link from 'next/link'
import { useAuth } from "@/contexts/auth-context"
import { AxiosError } from 'axios'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

export default function RegisterPage() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
 
    phone: '',
    fullName: '',
    birthDate: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [birthDate, setBirthDate] = useState<dayjs.Dayjs | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

 

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3')
  }

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value

  
    
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 11)
      value = formatPhone(value)
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isOver18 = (date: dayjs.Dayjs | null): boolean => {
    if (!date) return false
    const today = dayjs()
    const birthDate = dayjs(date)
    const age = today.diff(birthDate, 'year')
    return age >= 18
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (!birthDate) {
      setError('Data de nascimento é obrigatória')
      return
    }

    if (!isOver18(birthDate)) {
      setError('Você precisa ter pelo menos 18 anos para se cadastrar')
      return
    }

     const cleanPhone = formData.phone.replace(/\D/g, '')

    

    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      setError('Telefone inválido')
      return
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      
        phone: cleanPhone,
        fullName: formData.fullName,
        birthDate: birthDate.format('YYYY-MM-DD'),
        termsAccepted: acceptedTerms,
      })
    } catch (err) {
      const error = err as AxiosError<{ message: string }>

      setError(error.response?.data?.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
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
              label="Nome completo"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              disabled={loading}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
              <DatePicker
                label="Data de nascimento"
                value={birthDate}
                onChange={(newValue) => setBirthDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    margin: "normal",
                    required: true,
                    fullWidth: true,
                    error: birthDate ? (!isOver18(birthDate) || birthDate.year() < 1900) : false,
                    helperText: birthDate && (!isOver18(birthDate) 
                      ? "Você precisa ter pelo menos 18 anos"
                      : birthDate.year() < 1900 
                        ? "Data de nascimento inválida"
                        : "")
                  }
                }}
                disableFuture
                maxDate={dayjs().subtract(18, 'years')}
                minDate={dayjs('1900-01-01')}
              />
            </LocalizationProvider>
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  Li e aceito os{' '}
                  <Link href="/terms" target="_blank" style={{ color: 'inherit', fontWeight: 'bold' }}>
                   Termos de uso
                  </Link>
                </Typography>
              }
              sx={{ mt: 2 }}
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
              disabled={loading || !acceptedTerms}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
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