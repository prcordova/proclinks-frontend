import { Box, Typography, IconButton, ClickAwayListener } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { HexColorPicker } from 'react-colorful'
import { useState } from 'react'

interface ColorPickerFieldProps {
  label: string
  value: string
  onChange: (color: string) => void
  isMobile: boolean
}

export function ColorPickerField({ label, value, onChange, isMobile }: ColorPickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      position: 'relative'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2
      }}>
        <Typography variant="subtitle1">
          {label}
        </Typography>
        <Box
          onClick={() => setShowPicker(!showPicker)}
          sx={{
            flex: 1,
            height: 36,
            borderRadius: 1,
            backgroundColor: value,
            border: '1px solid',
            borderColor: 'divider',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              opacity: 0.9,
              boxShadow: 1
            }
          }}
        />
      </Box>
      {showPicker && (
        <ClickAwayListener onClickAway={() => setShowPicker(false)}>
          <Box sx={{ 
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 9999,
            bgcolor: 'background.paper',
            boxShadow: 3,
            borderRadius: 1,
            p: 1,
            mt: 1,
            '.react-colorful': {
              backgroundColor: 'background.paper'
            },
            '.react-colorful__saturation': {
              borderRadius: 1,
              mb: 1
            },
            '.react-colorful__hue': {
              borderRadius: 1
            }
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mb: 1,
              backgroundColor: 'background.paper'
            }}>
              <IconButton 
                size="small" 
                onClick={() => setShowPicker(false)}
                sx={{ p: 0.5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <HexColorPicker
              color={value}
              onChange={onChange}
              style={{ 
                width: isMobile ? '280px' : '200px',
                height: isMobile ? '180px' : '150px'
              }}
            />
          </Box>
        </ClickAwayListener>
      )}
    </Box>
  )
} 