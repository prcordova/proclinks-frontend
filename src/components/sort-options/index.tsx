import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { 
  DragHandle as DragIcon, 
  Sort as SortIcon 
} from '@mui/icons-material'

interface SortOptionsProps {
  value: 'custom' | 'date' | 'name' | 'likes'
  onChange: (mode: 'custom' | 'date' | 'name' | 'likes') => void
  onSort: (mode: 'custom' | 'date' | 'name' | 'likes') => void
  isMobile: boolean
}

export function SortOptions({ value, onChange, onSort, isMobile }: SortOptionsProps) {
  const handleSortChange = (mode: 'custom' | 'date' | 'name' | 'likes') => {
    onChange(mode)
    onSort(mode)
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ordenação
      </Typography>
      
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, mode) => mode && handleSortChange(mode)}
        aria-label="ordenação"
        orientation={isMobile ? "vertical" : "horizontal"}
        fullWidth={isMobile}
        size={isMobile ? "small" : "medium"}
        sx={{
          display: 'flex',
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          '& .MuiToggleButton-root': {
            flex: isMobile ? '1' : 'initial',
            px: isMobile ? 1 : 2
          }
        }}
      >
        <ToggleButton value="custom" aria-label="personalizada">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            width: '100%',
            justifyContent: 'center'
          }}>
            <DragIcon sx={{ fontSize: isMobile ? 18 : 24 }} />
            <span>Personalizada</span>
          </Box>
        </ToggleButton>
        {['date', 'name', 'likes'].map((option) => (
          <ToggleButton key={option} value={option} aria-label={option}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              width: '100%',
              justifyContent: 'center'
            }}>
              <SortIcon sx={{ fontSize: isMobile ? 18 : 24 }} />
              <span>{option === 'date' ? 'Data' : option === 'name' ? 'Nome' : 'Curtidas'}</span>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
} 