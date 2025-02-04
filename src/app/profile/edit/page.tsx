'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { linkApi, userApi } from '@/services/api'
import { 
  Container, Box, Typography, Button, TextField, 
  Switch, FormControlLabel, Grid ,
   Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText,
  Tabs, Tab, Card, CardContent,
  Select, MenuItem, InputLabel, FormControl,
  ToggleButton, ToggleButtonGroup,
  Snackbar, Alert, Link as MuiLink,
  IconButton, Divider, useTheme, useMediaQuery
} from '@mui/material'
import { 
  DragHandle as DragIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Sort as SortIcon,
  DragIndicator,
  Favorite as HeartIcon,
  FavoriteBorder as HeartOutlineIcon
} from '@mui/icons-material'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableLink } from '@/components/SortableLink'
import Cookies from 'js-cookie'
import { ChromePicker } from 'react-color'

interface LinkItem {
  id: string
  title: string
  url: string
  visible: boolean
  createdAt: string
  likes?: number
}

interface NewLinkData {
  title: string
  url: string
  visible: boolean
}

interface ProfileSettings {
  backgroundColor: string
  cardColor: string
  textColor: string
  cardTextColor: string
  displayMode: 'list' | 'grid'
  cardStyle: 'rounded' | 'square' | 'pill'
  animation: 'none' | 'fade' | 'slide' | 'bounce'
  font: 'default' | 'serif' | 'mono'
  spacing: number
  sortMode: 'custom' | 'date' | 'name' | 'likes'
  likesColor: string
}

interface PreviewLink {
  id: string
  title: string
  url: string
  likes: number
  isLiked: boolean
}

const ColorPickerField = ({ 
  label, 
  value, 
  onChange, 
  isMobile 
}: { 
  label: string
  value: string
  onChange: (color: string) => void
  isMobile: boolean 
}) => (
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

export default function EditLinksPage() {
  const { user, loading: authLoading } = useAuth()
   const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openNewLinkDialog, setOpenNewLinkDialog] = useState(false)
  const [newLink, setNewLink] = useState<NewLinkData>({
    title: '',
    url: '',
    visible: true
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [pendingLinks, setPendingLinks] = useState<LinkItem[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [tab, setTab] = useState(0)
  const [settings, setSettings] = useState<ProfileSettings>({
    backgroundColor: '#ffffff',
    cardColor: '#f5f5f5',
    textColor: '#000000',
    cardTextColor: '#000000',
    displayMode: 'list',
    cardStyle: 'rounded',
    animation: 'none',
    font: 'default',
    spacing: 16,
    sortMode: 'custom',
    likesColor: '#ff0000'
  })
  const [message, setMessage] = useState('')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Carregar links
  useEffect(() => {
    const loadLinks = async () => {
      if (!user) return

      try {
        const response = await linkApi.list()
        console.log('Links carregados:', response)
        setLinks(response)
        setPendingLinks(response)
        setError('')
      } catch (err) {
        console.error('Erro ao carregar links:', err)
        setError('Erro ao carregar seus links. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    loadLinks()
  }, [user])

  const handleAddLink = async () => {
    try {
      setLoading(true)
      const createdLink = await linkApi.create({
        title: newLink.title,
        url: newLink.url,
        visible: newLink.visible
      })

      // Atualiza os estados com o novo link
      setLinks(prev => [...prev, createdLink])
      setPendingLinks(prev => [...prev, createdLink])
      
      // Limpa o formulário e fecha o modal
      setNewLink({ title: '', url: '', visible: true })
      setOpenNewLinkDialog(false)
      setError('')
    } catch (err) {
      console.error('Erro ao criar link:', err)
      setError('Erro ao criar link. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLink = (id: string, data: Partial<LinkItem>) => {
    setPendingLinks(prev => prev.map(link => 
      link.id === id ? { ...link, ...data } : link
    ))
    setHasChanges(true)
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      // Salva as configurações do perfil
      await userApi.updateProfile({
        ...settings,
        links: links.map((link, index) => ({
          ...link,
          order: index
        }))
      })
      setMessage('Alterações salvas com sucesso')
    } catch (err) {
      console.error('Erro ao salvar alterações:', err)
      setMessage('Erro ao salvar alterações')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (linkId: string) => {
    console.log('Link recebido para exclusão:', { linkId, type: typeof linkId })
    setLinkToDelete(linkId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    console.log('Estado atual:', { linkToDelete, type: typeof linkToDelete })
    
    if (!linkToDelete) {
      console.log('Nenhum link selecionado para exclusão')
      return
    }

    try {
      console.log('Tentando excluir link:', linkToDelete)
      setIsDeleting(true)

      await linkApi.delete(linkToDelete)

      setPendingLinks(prev => prev.filter(link => link.id !== linkToDelete))
      setLinks(prev => prev.filter(link => link.id !== linkToDelete))
      setDeleteDialogOpen(false)
      setLinkToDelete(null)
    } catch (err) {
      console.error('Erro ao deletar link:', err)
      setError('Erro ao deletar link. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  const updateLinksOrder = async (newLinks: LinkItem[]) => {
    try {
      setLoading(true)
      // Atualiza a ordem dos links no backend
      await linkApi.updateOrder(
        newLinks.map((link, index) => ({
          id: link.id,
          order: index
        }))
      )
      setMessage('Ordem atualizada com sucesso')
    } catch (err) {
      console.error('Erro ao atualizar ordem:', err)
      setMessage('Erro ao atualizar ordem')
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        
        const newOrder = arrayMove(items, oldIndex, newIndex)
        // Atualizar ordem no backend
        updateLinksOrder(newOrder)
        return newOrder
      })
    }
  }

  const handleSortModeChange = (mode: string) => {
    if (!mode) return // Evita erro quando o modo é null

    setSettings(prev => ({ ...prev, sortMode: mode as ProfileSettings['sortMode'] }))
    
    const sortedLinks = [...links].sort((a, b) => {
      switch (mode) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'name':
          return a.title.localeCompare(b.title)
        case 'likes':
          return (b.likes || 0) - (a.likes || 0)
        default:
          return 0
      }
    })

    setLinks(sortedLinks)
  }

  const handleColorChange = (color: string, field: keyof ProfileSettings) => {
    setSettings(prev => ({
      ...prev,
      [field]: color
    }))
  }

  // Links de exemplo para o preview
  const [previewLinks, setPreviewLinks] = useState<PreviewLink[]>([
    { id: '1', title: 'Link de Exemplo 1', url: '#', likes: 42, isLiked: false },
    { id: '2', title: 'Link de Exemplo 2', url: '#', likes: 15, isLiked: true },
    { id: '3', title: 'Link de Exemplo 3', url: '#', likes: 27, isLiked: false }
  ])

  const handlePreviewLike = (linkId: string) => {
    setPreviewLinks(prevLinks =>
      prevLinks.map(link =>
        link.id === linkId
          ? { 
              ...link, 
              isLiked: !link.isLiked,
              likes: link.likes + (link.isLiked ? -1 : 1)
            }
          : link
      )
    )
  }

  const renderPreviewLink = (link: PreviewLink) => (
    <Box
      key={link.id}
      sx={{
        width: settings.displayMode === 'grid' 
          ? isMobile 
            ? '100%' 
            : 'calc(50% - 8px)' 
          : '100%',
      }}
    >
      <MuiLink
        component="div"
        sx={{
          display: 'block',
          p: 2,
          bgcolor: settings.cardColor,
          color: settings.cardTextColor,
          borderRadius: settings.cardStyle === 'pill' ? 24 : 
                     settings.cardStyle === 'square' ? 0 : 2,
          textAlign: 'center',
          textDecoration: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: `all 0.2s ${settings.animation === 'bounce' ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'ease-in-out'}`,
          '&:hover': {
            transform: settings.animation !== 'none' ? 'translateY(-5px)' : 'none',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }
        }}
      >
        <Box sx={{ mb: 2 }}>
          {link.title}
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}>
          <IconButton 
            size="small"
            onClick={() => handlePreviewLike(link.id)}
            sx={{ 
              color: link.isLiked ? settings.likesColor : settings.cardTextColor,
              '&:hover': {
                color: settings.likesColor
              }
            }}
          >
            {link.isLiked ? <HeartIcon /> : <HeartOutlineIcon />}
          </IconButton>
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: settings.cardTextColor,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            {link.likes}
            <Typography 
              variant="caption" 
              sx={{ 
                color: settings.cardTextColor,
                opacity: 0.7
              }}
            >
              {link.likes === 1 ? 'curtida' : 'curtidas'}
            </Typography>
          </Typography>
        </Box>
      </MuiLink>
    </Box>
  )

  const handleSpacingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpacing = Number(event.target.value)
    setSettings(prev => ({
      ...prev,
      spacing: newSpacing
    }))
  }

  if (authLoading || loading) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Carregando...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Editar Perfil
        </Typography>

        <Tabs 
          value={tab} 
          onChange={(_, newValue) => setTab(newValue)} 
          sx={{ mb: 4 }}
          variant={isMobile ? "fullWidth" : "standard"}
        >
          <Tab label="Links" />
          <Tab label="Aparência" />
        </Tabs>

        {tab === 0 && (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ordenação
                </Typography>
                
                <ToggleButtonGroup
                  value={settings.sortMode}
                  exclusive
                  onChange={(_, mode) => handleSortModeChange(mode)}
                  aria-label="ordenação"
                >
                  <ToggleButton value="custom" aria-label="personalizada">
                    <DragIndicator sx={{ mr: 1 }} />
                    Personalizada
                  </ToggleButton>
                  <ToggleButton value="date" aria-label="data">
                    <SortIcon sx={{ mr: 1 }} />
                    Data
                  </ToggleButton>
                  <ToggleButton value="name" aria-label="nome">
                    <SortIcon sx={{ mr: 1 }} />
                    Nome
                  </ToggleButton>
                  <ToggleButton value="likes" aria-label="curtidas">
                    <SortIcon sx={{ mr: 1 }} />
                    Curtidas
                  </ToggleButton>
                </ToggleButtonGroup>
              </CardContent>
            </Card>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              disabled={settings.sortMode !== 'custom'}
            >
              <SortableContext
                items={links}
                strategy={verticalListSortingStrategy}
              >
                <Grid container spacing={2}>
                  {links.map((link) => (
                    <Grid item xs={12} key={link.id}>
                      <SortableLink
                        link={link}
                        onUpdate={handleUpdateLink}
                        onDelete={handleDeleteClick}
                        isDraggable={settings.sortMode === 'custom'}
                      />
                    </Grid>
                  ))}
                </Grid>
              </SortableContext>
            </DndContext>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 4,
            minHeight: 'calc(100vh - 200px)'
          }}>
            {/* Painel de Configurações */}
            <Box sx={{ 
              width: isMobile ? '100%' : isTablet ? '350px' : '400px',
              flexShrink: 0,
              order: isMobile ? 2 : 1
            }}>
              <Box sx={{ 
                position: isMobile ? 'relative' : 'sticky',
                top: 24,
                maxHeight: isMobile ? 'auto' : 'calc(100vh - 100px)',
                overflowY: isMobile ? 'visible' : 'auto',
                pr: isMobile ? 0 : 2
              }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Cores
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr',
                      gap: 2
                    }}>
                      <ColorPickerField
                        label="Cor de Fundo"
                        value={settings.backgroundColor}
                        onChange={(color) => setSettings(prev => ({
                          ...prev,
                          backgroundColor: color
                        }))}
                        isMobile={isMobile}
                      />

                      <ColorPickerField
                        label="Cor dos Cards"
                        value={settings.cardColor}
                        onChange={(color) => setSettings(prev => ({
                          ...prev,
                          cardColor: color
                        }))}
                        isMobile={isMobile}
                      />

                      <ColorPickerField
                        label="Cor do Texto"
                        value={settings.textColor}
                        onChange={(color) => setSettings(prev => ({
                          ...prev,
                          textColor: color
                        }))}
                        isMobile={isMobile}
                      />

                      <ColorPickerField
                        label="Cor do Texto dos Cards"
                        value={settings.cardTextColor}
                        onChange={(color) => setSettings(prev => ({
                          ...prev,
                          cardTextColor: color
                        }))}
                        isMobile={isMobile}
                      />

                      <ColorPickerField
                        label="Cor dos Likes"
                        value={settings.likesColor}
                        onChange={(color) => setSettings(prev => ({
                          ...prev,
                          likesColor: color
                        }))}
                        isMobile={isMobile}
                      />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                      Layout
                    </Typography>

                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr',
                      gap: 2
                    }}>
                      <FormControl fullWidth>
                        <InputLabel>Modo de Exibição</InputLabel>
                        <Select
                          value={settings.displayMode}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            displayMode: e.target.value as 'list' | 'grid'
                          }))}
                          size={isMobile ? "small" : "medium"}
                        >
                          <MenuItem value="list">Lista</MenuItem>
                          <MenuItem value="grid">Grade</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>Estilo dos Cards</InputLabel>
                        <Select
                          value={settings.cardStyle}
                          onChange={(e) => handleColorChange(e.target.value as string, 'cardStyle')}
                          size={isMobile ? "small" : "medium"}
                        >
                          <MenuItem value="rounded">Arredondado</MenuItem>
                          <MenuItem value="square">Quadrado</MenuItem>
                          <MenuItem value="pill">Pílula</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>Animação</InputLabel>
                        <Select
                          value={settings.animation}
                          onChange={(e) => handleColorChange(e.target.value as string, 'animation')}
                          size={isMobile ? "small" : "medium"}
                        >
                          <MenuItem value="none">Nenhuma</MenuItem>
                          <MenuItem value="fade">Fade</MenuItem>
                          <MenuItem value="slide">Slide</MenuItem>
                          <MenuItem value="bounce">Bounce</MenuItem>
                        </Select>
                      </FormControl>

                      <Box sx={{ mb: 2 }}>
                        <Typography gutterBottom variant={isMobile ? 'body2' : 'body1'}>
                          Espaçamento entre cards: {settings.spacing}px
                        </Typography>
                        <TextField
                          type="range"
                          value={settings.spacing}
                          onChange={handleSpacingChange}
                          inputProps={{
                            min: 8,
                            max: 32,
                            step: 4
                          }}
                          sx={{
                            width: '100%',
                            '& input': {
                              padding: '8px 0',
                              height: '20px'
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Preview em Tempo Real */}
            <Box sx={{ 
              flex: 1,
              order: isMobile ? 1 : 2
            }}>
              <Box sx={{ 
                position: isMobile ? 'relative' : 'sticky',
                top: 24,
                bgcolor: settings.backgroundColor,
                borderRadius: 2,
                p: isMobile ? 2 : 4,
                minHeight: isMobile ? 400 : 600,
                transition: 'all 0.3s ease'
              }}>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  gutterBottom 
                  sx={{ color: settings.textColor }}
                >
                  Preview do Seu Perfil
                </Typography>

                <Box sx={{ 
                  display: 'flex',
                  flexDirection: settings.displayMode === 'grid' ? 'row' : 'column',
                  flexWrap: settings.displayMode === 'grid' ? 'wrap' : 'nowrap',
                  gap: `${settings.spacing}px`,
                  width: '100%'
                }}>
                  {previewLinks.map(renderPreviewLink)}
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          mt: 4,
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.default',
          py: 2,
          zIndex: 1
        }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSaveChanges}
            disabled={loading}
            fullWidth={isMobile}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </Box>

        <Snackbar
          open={!!message}
          autoHideDuration={3000}
          onClose={() => setMessage('')}
          sx={{
            bottom: isMobile ? 80 : 24
          }}
        >
          <Alert severity="info" onClose={() => setMessage('')}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  )
} 