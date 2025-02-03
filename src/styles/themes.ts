import { createTheme, type Theme, ThemeOptions } from '@mui/material/styles'

export type ThemeMode = 'light' | 'dark-blue' | 'dark-gray' | 'dark-purple'

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: 'var(--font-geist-sans)',
  },
  shape: {
    borderRadius: 8,
  },
}

const createCustomTheme = (options: ThemeOptions): Theme => {
  return createTheme({
    ...baseTheme,
    ...options,
  })
}

export const themes: Record<ThemeMode, Theme> = {
  light: createCustomTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#4f46e5',
        light: '#818cf8',
        dark: '#3730a3',
      },
      background: {
        default: '#ffffff',
        paper: '#f8fafc',
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
      },
    },
  }),

  'dark-blue': createCustomTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#818cf8',
        light: '#a5b4fc',
        dark: '#6366f1',
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
  }),

  'dark-gray': createCustomTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#6b7280',
        light: '#9ca3af',
        dark: '#4b5563',
      },
      background: {
        default: '#18181b',
        paper: '#27272a',
      },
      text: {
        primary: '#fafafa',
        secondary: '#a1a1aa',
      },
    },
  }),

  'dark-purple': createCustomTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#a855f7',
        light: '#c084fc',
        dark: '#9333ea',
      },
      background: {
        default: '#1e1b4b',
        paper: '#312e81',
      },
      text: {
        primary: '#f5f3ff',
        secondary: '#c4b5fd',
      },
    },
  }),
} 