'use client'

import { Box, Container, Typography,   IconButton } from '@mui/material'
 import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
 import { Instagram } from '@mui/icons-material'

export function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 6,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3
        }}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Melter
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compartilhe todos os seus links em um único lugar
            </Typography>
          </Box>

        

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton color="inherit" href="https://github.com/prcordova" target="_blank">
              <GitHubIcon />
            </IconButton>
            <IconButton color="inherit" href="https://www.linkedin.com/in/pedroricardocordova/" target="_blank">
              <LinkedInIcon />
            </IconButton>
            <IconButton color="inherit" href="https://www.instagram.com/prcordova/" target="_blank">
              <Instagram />
            </IconButton>
          </Box>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} Melter. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  )
} 