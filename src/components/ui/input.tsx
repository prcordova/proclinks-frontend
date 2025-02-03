'use client'

import { TextField, TextFieldProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
}))

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  error?: boolean
  helperText?: string
}

export function Input({ error, helperText, ...props }: InputProps) {
  return (
    <StyledTextField
      variant="outlined"
      fullWidth
      error={error}
      helperText={helperText}
      {...props}
    />
  )
} 