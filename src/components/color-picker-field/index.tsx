import { Box, Typography, TextField } from '@mui/material'

interface ColorPickerFieldProps {
  label: string
  value: string
  onChange: (color: string) => void
  isMobile: boolean
}

export function ColorPickerField({ label, value, onChange, isMobile }: ColorPickerFieldProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography gutterBottom variant={isMobile ? 'body2' : 'body1'}>
        {label}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <Box
          sx={{
            width: isMobile ? '100%' : 40,
            height: 40,
            borderRadius: 1,
            bgcolor: value,
            border: '2px solid #ddd'
          }}
        />
        <TextField
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{ 
            flex: 1,
            '& input': {
              width: '100%',
              height: '40px',
              padding: '4px',
              cursor: 'pointer'
            }
          }}
          fullWidth
        />
      </Box>
    </Box>
  )
} 