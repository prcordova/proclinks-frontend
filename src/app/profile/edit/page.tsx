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
  IconButton, Divider, useTheme, useMediaQuery, Backdrop, CircularProgress
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableLink } from '@/components/SortableLink'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface LinkItem {
  id: string
  title: string
  url: string
  visible: boolean
  createdAt: string
  likes?: number
  order: number
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

interface AlertState {
  open: boolean
  message: string
  severity: 'success' | 'error'
}

interface DeleteDialogState {
  open: boolean
  linkId: string | null
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

function SortableCard({ link, onUpdate, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const dragStyle = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '',
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
  }

  return (
    <div ref={setNodeRef} style={dragStyle}>
      <Card sx={{ mb: 2, bgcolor: isDragging ? 'action.hover' : 'background.paper' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton {...attributes} {...listeners} size="small">
              <DragIcon />
            </IconButton>
            
            <TextField
              label="Título"
              value={link.title}
              onChange={(e) => onUpdate(link.id, { title: e.target.value })}
              size="small"
              sx={{ flexGrow: 1 }}
            />
            
            <TextField
              label="URL"
              value={link.url}
              onChange={(e) => onUpdate(link.id, { url: e.target.value })}
              size="small"
              sx={{ flexGrow: 2 }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={link.visible}
                  onChange={() => {
                    handleUpdateLink(link.id, { visible: !link.visible })
                  }}
                />
              }
              label="Visível"
            />
            
            <IconButton 
              onClick={() => onDelete(link.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </div>
  )
}

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
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    linkId: null
  })
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
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'success'
  })
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Carregar links
  useEffect(() => {
    const loadLinks = async () => {
      if (!user) return

      try {
        console.log('Carregando links...')
        const response = await userApi.getMyProfile()
        console.log('Resposta do servidor:', response)
        
        if (response.success && response.data.links) {
          // Garantir que cada link tem todos os campos necessários
          const formattedLinks = response.data.links.map((link: any, index: number) => ({
            id: link._id || link.id, // Aceita ambos os formatos
            title: link.title,
            url: link.url,
            visible: link.visible,
            order: link.order || index, // Usa o índice como fallback
            createdAt: link.createdAt,
            likes: link.likes || 0
          }))
          
          // Ordenar links por ordem
          const sortedLinks = formattedLinks.sort((a: LinkItem, b: LinkItem) => a.order - b.order)
          console.log('Links ordenados:', sortedLinks)
          
          setLinks(sortedLinks)
          setPendingLinks(sortedLinks)
          setError('')
        } else {
          console.log('Nenhum link encontrado ou formato inválido')
        }
      } catch (error) {
        console.error('Erro ao carregar links:', error)
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
      setAlert({ open: true, message: 'Link adicionado com sucesso', severity: 'success' })
    } catch (err) {
      console.error('Erro ao criar link:', err)
      setError('Erro ao criar link. Tente novamente.')
      setAlert({ open: true, message: 'Erro ao adicionar link', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLink = (id: string, data: Partial<LinkItem>) => {
    if (!id) return
    
    try {
      // Atualiza apenas o estado local
      const updatedLinks = links.map(link => 
        link.id === id 
          ? { ...link, ...data }
          : link
      )

      // Atualiza os estados locais
      setLinks(updatedLinks)
      setPendingLinks(updatedLinks)
      setHasChanges(true) // Indica que há mudanças não salvas
      
    } catch (error) {
      console.error('Erro ao atualizar link:', error)
      setAlert({
        open: true,
        message: 'Erro ao atualizar link',
        severity: 'error'
      })
    }
  }

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true)
      console.log('Iniciando salvamento de alterações...')

      // Salva as configurações do perfil
      const profileResponse = await userApi.updateProfile({
        backgroundColor: settings.backgroundColor,
        cardColor: settings.cardColor,
        textColor: settings.textColor,
        cardTextColor: settings.cardTextColor,
        displayMode: settings.displayMode,
        cardStyle: settings.cardStyle,
        animation: settings.animation,
        font: settings.font,
        spacing: settings.spacing,
        sortMode: settings.sortMode,
        likesColor: settings.likesColor
      })

      if (!profileResponse.success) {
        throw new Error('Erro ao salvar configurações do perfil')
      }

      // Prepara as atualizações dos links que foram modificados
      const linkUpdates = links.map(async (link) => {
        const originalLink = pendingLinks.find(l => l.id === link.id)
        
        // Verifica se o link foi modificado
        if (
          originalLink?.title !== link.title ||
          originalLink?.url !== link.url ||
          originalLink?.visible !== link.visible ||
          originalLink?.order !== link.order
        ) {
          console.log('Atualizando link:', link)
          const response = await linkApi.updateLink(link.id, {
            title: link.title,
            url: link.url,
            visible: link.visible,
            order: link.order
          })

          if (!response.success) {
            throw new Error(`Erro ao atualizar link ${link.id}`)
          }

          return response.data
        }
        
        // Se o link não foi modificado, retorna o link original
        return link
      })

      // Aguarda todas as atualizações dos links
      const updatedLinks = await Promise.all(linkUpdates)
      console.log('Links atualizados:', updatedLinks)

      // Atualiza o estado com os links atualizados
      const formattedLinks = updatedLinks.map(link => ({
        id: link._id || link.id,
        title: link.title,
        url: link.url,
        visible: link.visible,
        order: link.order,
        createdAt: link.createdAt,
        likes: link.likes || 0
      }))

      // Atualiza os estados sem fazer novo get
      setLinks(formattedLinks)
      setPendingLinks(formattedLinks)
      setHasChanges(false)

      setAlert({
        open: true,
        message: 'Todas as alterações foram salvas com sucesso',
        severity: 'success'
      })

    } catch (error) {
      console.error('Erro ao salvar alterações:', error)
      setAlert({
        open: true,
        message: 'Erro ao salvar alterações. Por favor, tente novamente.',
        severity: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const openDeleteDialog = (id: string) => {
    setDeleteDialog({ open: true, linkId: id })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, linkId: null })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.linkId) return

    try {
      setLoading(true)
      const response = await linkApi.delete(deleteDialog.linkId)
      if (response.success) {
        setLinks(links.filter(link => link.id !== deleteDialog.linkId))
        setPendingLinks(prev => prev.filter(link => link.id !== deleteDialog.linkId))
        showAlert('Link excluído com sucesso', 'success')
      }
    } catch (error) {
      console.error('Erro ao deletar link:', error)
      setError('Erro ao deletar link. Tente novamente.')
      showAlert('Erro ao excluir link', 'error')
    } finally {
      setLoading(false)
      closeDeleteDialog()
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null) return

    const newLinks = [...pendingLinks]
    const draggedLink = newLinks[draggedIndex]
    
    // Remove o item arrastado e insere na nova posição
    newLinks.splice(draggedIndex, 1)
    newLinks.splice(index, 0, draggedLink)
    
    // Atualiza a ordem dos links
    const updatedLinks = newLinks.map((link, idx) => ({
      ...link,
      order: idx
    }))
    
    setPendingLinks(updatedLinks)
    setDraggedIndex(index)
  }

  const handleDragEnd = async () => {
    if (draggedIndex === null) return
    setDraggedIndex(null)

    try {
      // Garantir que temos IDs válidos
      const linkIds = pendingLinks.map(link => link.id)
      console.log('IDs dos links para reordenação:', linkIds) // Debug

      const response = await linkApi.reorder({ links: linkIds })
      
      if (response.success) {
        // Atualiza os estados com a nova ordem
        const updatedLinks = pendingLinks.map((link, index) => ({
          ...link,
          order: index
        }))
        setLinks(updatedLinks)
        setPendingLinks(updatedLinks)
        showAlert('Ordem atualizada com sucesso', 'success')
      }
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error)
      showAlert('Erro ao atualizar ordem', 'error')
      setPendingLinks(links) // Reverte para a ordem anterior
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

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ open: true, message, severity })
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false })
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
    <Container maxWidth="lg">
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={isSaving}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" component="div">
          Salvando alterações...
        </Typography>
      </Backdrop>

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
                    <DragIcon sx={{ mr: 1 }} />
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

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Gerenciar Links ({pendingLinks.length})</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenNewLinkDialog(true)}
              >
                Adicionar Link
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {pendingLinks.map((link, index) => (
                <Card 
                  key={link.id}
                  sx={{ 
                    mb: 2,
                    opacity: draggedIndex === index ? 0.5 : 1,
                    transition: 'all 0.2s',
                    cursor: 'move',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  draggable
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <DragIcon 
                        sx={{ 
                          cursor: 'grab',
                          '&:active': { cursor: 'grabbing' }
                        }} 
                      />
                      
                      <TextField
                        label="Título"
                        value={link.title}
                        onChange={(e) => handleUpdateLink(link.id, { title: e.target.value })}
                        size="small"
                        sx={{ flexGrow: 1 }}
                      />
                      
                      <TextField
                        label="URL"
                        value={link.url}
                        onChange={(e) => handleUpdateLink(link.id, { url: e.target.value })}
                        size="small"
                        sx={{ flexGrow: 2 }}
                      />
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={link.visible}
                            onChange={() => {
                              handleUpdateLink(link.id, { visible: !link.visible })
                            }}
                          />
                        }
                        label="Visível"
                      />
                      
                      <IconButton 
                        onClick={() => openDeleteDialog(link.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
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
            disabled={isSaving || !hasChanges}
            fullWidth={isMobile}
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </Box>

        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity={alert.severity}>
            {alert.message}
          </Alert>
        </Snackbar>

        {/* Dialog de confirmação de exclusão */}
        <Dialog
          open={deleteDialog.open}
          onClose={closeDeleteDialog}
        >
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir este link? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={closeDeleteDialog}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmDelete}
              color="error"
              disabled={isDeleting}
              autoFocus
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para mensagens */}
        {message && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
            {message}
          </Box>
        )}
      </Box>
    </Container>
  )
} 