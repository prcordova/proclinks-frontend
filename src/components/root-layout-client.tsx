'use client'

import { ThemeProvider } from "@/contexts/theme-context"
import { Box, Container } from "@mui/material"

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}>
        <Container component="main" sx={{ py: 4 }}>
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  )
}