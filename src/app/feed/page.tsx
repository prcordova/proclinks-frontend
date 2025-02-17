'use client'

import { useEffect, useState } from 'react'
import { 
  Container, Box, Typography, Paper, Grid,
  Card, CardContent, Button, TextField,
 } from '@mui/material'
import { useRouter } from 'next/navigation'
import MailOutlineIcon from '@mui/icons-material/MailOutline'

interface NewsItem {
  id: string
  title: string
  content: string
  date: string
}

export default function FeedPage() {
  const router = useRouter()
  const [news, setNews] = useState<NewsItem[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Simular carregamento de notícias (depois substituiremos por chamada API)
    setNews([
      {
        id: '1',
        title: 'Nova funcionalidade: Temas personalizados',
        content: 'Agora você pode personalizar as cores e o estilo da sua página de links!',
        date: '2024-03-15'
      },
      {
        id: '2',
        title: 'Dica: Aumente seu alcance',
        content: 'Use tags relevantes e uma boa descrição para aumentar a visibilidade dos seus links.',
        date: '2024-03-14'
      }
    ])
    setLoading(false)
  }, [router])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar inscrição na newsletter
    alert('Inscrição realizada com sucesso!')
    setEmail('')
  }

  if (loading) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Carregando...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Seção de Boas-vindas */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Bem-vindo ao seu Feed!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Fique por dentro das novidades e atualizações do Melter
              </Typography>
            </Paper>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <MailOutlineIcon fontSize="large" color="primary" />
                <Typography variant="h5">
                  Inscreva-se na nossa Newsletter
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Receba dicas, atualizações e novidades diretamente no seu email.
              </Typography>
              <Box component="form" onSubmit={handleNewsletterSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      label="Seu melhor email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      sx={{ height: '100%' }}
                    >
                      Inscrever-se
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Novidades */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Últimas Novidades
            </Typography>
            <Grid container spacing={2}>
              {news.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {item.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.date).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
} 