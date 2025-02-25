'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ReactNode } from 'react'
import { ThemeProvider as MUIThemeProvider, Theme, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

declare module '@mui/material/styles' {
  interface TypeBackground {
    autofill: string;
  }
}

type ThemeMode = 'dark' | 'light'

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

export const useThemeContext = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'theme-preferences',
    }
  )
)

const createAutofillStyles = (theme: Theme) => ({
  '& .MuiInputBase-input': {
    '&:-webkit-autofill': {
      boxShadow: `0 0 0 100px ${theme.palette.mode === 'light' 
        ? 'rgba(229, 231, 235, 0.4)'
        : 'rgba(21, 24, 29, 0.678)'
      } inset !important`,
      WebkitTextFillColor: `${theme.palette.text.primary} !important`,
      caretColor: `${theme.palette.text.primary}`,
      borderRadius: 'inherit',
      '&::selection': {
        backgroundColor: `${theme.palette.primary.main}40 !important`,
        color: `${theme.palette.text.primary} !important`
      }
    },
    '&::selection': {
      backgroundColor: `${theme.palette.primary.main}40`,
      color: theme.palette.text.primary
    }
  }
})

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => createAutofillStyles(theme)
      }
    }
  }
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#818cf8',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => createAutofillStyles(theme)
      }
    }
  }
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { mode } = useThemeContext()
  const theme = mode === 'dark' ? darkTheme : lightTheme

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
} 