'use client'

import { useEffect, useState } from 'react'
import { Container, Box, Typography, Grid, Card, CardContent, IconButton } from '@mui/material'
import { Language as LanguageIcon } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

interface LinkItem {
  id: string
  title: string
  url: string
  icon?: string
  visible: boolean
}

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simula busca de dados do usuário
    const userData = localStorage.getItem(`user_${params.username}`)
    if (!userData) {
      router.push('/404')
      return
    }

    // Carrega links do usuário
    const userLinks = localStorage.getItem(`links_${params.username}`)
    if (userLinks) {
      const parsedLinks = JSON.parse(userLinks)
      setLinks(parsedLinks.filter((link: LinkItem) => link.visible))
      setViewMode(localStorage.getItem(`viewMode_${params.username}`) as 'list' | 'grid' || 'grid')
    }
    
    setLoading(false)
  }, [params.username, router])

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography>Carregando...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          @{params.username}
        </Typography>

        <Grid container spacing={2}>
          {links.map((link) => (
            <Grid 
              key={link.id} 
              item 
              xs={12}
              sm={viewMode === 'grid' ? 6 : 12}
            >
              <Card 
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  textDecoration: 'none',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {link.icon ? (
                    <img 
                      src={link.icon} 
                      alt={link.title}
                      style={{ width: 24, height: 24 }}
                    />
                  ) : (
                    <LanguageIcon />
                  )}
                  <Box>
                    <Typography variant="subtitle1">
                      {link.title}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
} 