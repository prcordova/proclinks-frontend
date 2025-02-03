'use client'

import { ThemeProvider } from "@/contexts/theme-context"
import { SessionProvider } from "next-auth/react"
import { Header } from "./header"
import { Box, Container } from "@mui/material"

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Box sx={{ 
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary'
        }}>
          <Header />
          <Container component="main" sx={{ py: 4 }}>
            {children}
          </Container>
        </Box>
      </ThemeProvider>
    </SessionProvider>
  )
}