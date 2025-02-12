import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Box, 
  TextField, 
  FormControlLabel, 
  Switch, 
  Button, 
  Typography,
  CircularProgress 
} from '@mui/material'
import { useState } from 'react'

interface AddLinkDialogProps {
  open: boolean
  loading: boolean
  isMobile: boolean
  onClose: () => void
  onAdd: (linkData: { title: string; url: string; visible: boolean }) => Promise<void>
}

export function AddLinkDialog({ 
  open, 
  loading, 
  isMobile, 
  onClose, 
  onAdd 
}: AddLinkDialogProps) {
  const [linkData, setLinkData] = useState({
    title: '',
    url: '',
    visible: true
  })

  const handleSubmit = async () => {
    await onAdd(linkData)
    // Limpa o form após adicionar
    setLinkData({ title: '', url: '', visible: true })
  }

  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          margin: isMobile ? '16px' : '32px',
          width: 'calc(100% - 32px)',
          maxHeight: isMobile ? 'calc(100% - 32px)' : '80vh'
        }
      }}
    >
      <DialogTitle>
        <Typography variant={isMobile ? 'h6' : 'h5'}>
          Adicionar Novo Link
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          pt: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          '& .MuiTextField-root': {
            minHeight: isMobile ? '48px' : '56px'
          }
        }}>
          <TextField
            label="Título"
            value={linkData.title}
            onChange={(e) => setLinkData(prev => ({ ...prev, title: e.target.value }))}
            fullWidth
            disabled={loading}
            error={!linkData.title}
            helperText={!linkData.title ? 'Título é obrigatório' : ''}
            size={isMobile ? "small" : "medium"}
          />
          <TextField
            label="URL"
            value={linkData.url}
            onChange={(e) => setLinkData(prev => ({ ...prev, url: e.target.value }))}
            fullWidth
            disabled={loading}
            error={!linkData.url}
            helperText={!linkData.url ? 'URL é obrigatória' : ''}
            size={isMobile ? "small" : "medium"}
          />
          <FormControlLabel
            control={
              <Switch
                checked={linkData.visible}
                onChange={(e) => setLinkData(prev => ({ ...prev, visible: e.target.checked }))}
                disabled={loading}
              />
            }
            label="Visível"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          fullWidth={isMobile}
          size={isMobile ? "small" : "medium"}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading || !linkData.title || !linkData.url}
          variant="contained"
          fullWidth={isMobile}
          size={isMobile ? "small" : "medium"}
          startIcon={loading ? <CircularProgress size={isMobile ? 16 : 20} /> : null}
        >
          {loading ? 'Adicionando...' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
} 