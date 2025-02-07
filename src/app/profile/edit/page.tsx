'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { linkApi, userApi } from '@/services/api'
import { 
  Container, Box, Typography, Button, TextField, 
  Switch, FormControlLabel, 
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
 
  Favorite as HeartIcon,
  FavoriteBorder as HeartOutlineIcon
} from '@mui/icons-material'
 
 
 import { useThemeContext } from '@/contexts/theme-context'
 import { CustomAvatar } from '@/components/avatar'
  
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
  bio: string
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
    likesColor: '#ff0000',
    bio: '',
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
  const { mode, setMode } = useThemeContext()
   const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isAvatarLoading, setIsAvatarLoading] = useState(false)

 

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await userApi.getMyProfile()
        if (response.success) {
          setProfileData(response.data)
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
      }
    }

    loadProfile()
  }, [])

  // Carregar links
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true)
        const response = await userApi.getMyProfile()
        
        if (response.success) {
          const formattedLinks = response.data.links.map((link: any) => ({
            id: link._id,
            title: link.title,
            url: link.url,
            visible: link.visible,
            createdAt: link.createdAt,
            order: link.order,
            likes: link.likes || 0
          }))

          setLinks(formattedLinks)
          setPendingLinks(formattedLinks)
          
          // Apenas atualizando as settings com as preferências do usuário
          if (response.data.profile) {
            setSettings(prevSettings => ({
              ...prevSettings,
              ...response.data.profile,
              bio: response.data.bio || '',
            }))
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error)
        setError('Erro ao carregar seus dados. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [])

  const handleAddLink = async () => {
    try {
      setLoading(true)
      
      // Validar dados do novo link
      if (!newLink.title || !newLink.url) {
        setAlert({
          open: true,
          message: 'Título e URL são obrigatórios',
          severity: 'error'
        })
        return
      }

      // Usar o método createLink do linkApi
      const response = await linkApi.createLink({
        title: newLink.title,
        url: newLink.url,
        visible: newLink.visible
      })

      if (response.success) {
        // Formatar o novo link para o formato esperado
        const createdLink: LinkItem = {
          id: response.data._id,
          title: response.data.title,
          url: response.data.url,
          visible: response.data.visible,
          createdAt: response.data.createdAt,
          order: response.data.order || 0,
          likes: response.data.likes || 0
        }

        // Atualizar os estados
        setLinks(prev => [...prev, createdLink])
        setPendingLinks(prev => [...prev, createdLink])
        
        // Limpar o formulário e fechar o modal
        setNewLink({ title: '', url: '', visible: true })
        setOpenNewLinkDialog(false)
        
        // Mostrar mensagem de sucesso
        setAlert({
          open: true,
          message: 'Link adicionado com sucesso',
          severity: 'success'
        })
        
        // Indicar que há mudanças não salvas
        setHasChanges(true)
      } else {
        // Se a resposta não foi bem sucedida, mostrar a mensagem de erro da API
        throw new Error(response.message)
      }
    } catch (error: any) {
      console.error('Erro ao criar link:', error)
      
      // Verificar se é um erro relacionado ao limite do plano
      if (error.response?.data?.currentPlan) {
        const planInfo = error.response.data.currentPlan
        setAlert({
          open: true,
          message: `Limite do plano ${planInfo.type} atingido (${planInfo.currentLinks}/${planInfo.maxLinks} links). Faça um upgrade para adicionar mais links.`,
          severity: 'error'
        })
        // Fechar o modal quando for erro de limite de plano
        setOpenNewLinkDialog(false)
      } else {
        setAlert({
          open: true,
          message: error.response?.data?.message || 'Erro ao adicionar link',
          severity: 'error'
        })
      }
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
      
      const updateData = {
        bio: settings.bio,
        profile: {
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
        }
      }

      const response = await userApi.updateProfile(updateData)
      
      if (!response.success) {
        throw new Error('Erro ao salvar alterações')
      }

      // Atualiza os estados com os dados retornados
      if (response.data) {
        const { links: updatedLinks, profile: updatedProfile } = response.data
        
        if (updatedLinks) {
          const formattedLinks = updatedLinks.map(link => ({
            id: link._id,
            title: link.title,
            url: link.url,
            visible: link.visible,
            order: link.order,
            likes: link.likes || 0
          }))
          setLinks(formattedLinks)
          setPendingLinks(formattedLinks)
        }

        if (updatedProfile) {
          setSettings(updatedProfile)
        }
      }

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
      setIsDeleting(true)
      await linkApi.deleteLink(deleteDialog.linkId)

      // Atualizar a lista de links
      const updatedLinks = links.filter(link => link.id !== deleteDialog.linkId)
      setLinks(updatedLinks)
      setPendingLinks(updatedLinks)
      
      // Fechar o modal
      closeDeleteDialog()
      
      // Mostrar mensagem de sucesso
      setAlert({
        open: true,
        message: 'Link excluído com sucesso',
        severity: 'success'
      })

      // Indicar que há mudanças não salvas
      setHasChanges(true)
    } catch (error) {
      console.error('Erro ao excluir link:', error)
      setAlert({
        open: true,
        message: 'Erro ao excluir link',
        severity: 'error'
      })
    } finally {
      setIsDeleting(false)
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
 
  const handleSpacingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpacing = Number(event.target.value)
    setSettings(prev => ({
      ...prev,
      spacing: newSpacing
    }))
    setHasChanges(true)
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

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ open: true, message, severity })
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false })
  }

  const handleAvatarUpdated = (newAvatarUrl: string) => {
    if (profileData) {
      setProfileData({
        ...profileData,
        avatar: newAvatarUrl
      })
      setAlert({
        open: true,
        message: 'Avatar atualizado com sucesso',
        severity: 'success'
      })
    }
  }

  const handleAvatarChange = async (file: File) => {
    try {
      setIsAvatarLoading(true)
      const response = await userApi.updateAvatar(file)
      if (response.success) {
        // Atualiza o avatar no estado do perfil
        setProfileData(prev => ({
          ...prev,
          avatar: response.avatarUrl
        }))
        // Atualiza o contexto do usuário se necessário
        // updateUserContext({ ...user, avatar: response.avatarUrl })
      }
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error)
      setAlert({
        open: true,
        message: 'Erro ao atualizar foto de perfil',
        severity: 'error'
      })
      throw error
    } finally {
      setIsAvatarLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await userApi.updateProfile({
        profile: {
          backgroundColor: settings.backgroundColor,
          cardColor: settings.cardColor,
          textColor: settings.textColor,
          cardTextColor: settings.cardTextColor,
          displayMode: settings.displayMode,
          cardStyle: settings.cardStyle,
          animation: settings.animation,
          font: settings.font,
          spacing: settings.spacing,
          likesColor: settings.likesColor,
          sortMode: settings.sortMode,
        },
        bio: settings.bio
      })

      if (response.success) {
        setAlert({
          open: true,
          message: 'Perfil atualizado com sucesso!',
          severity: 'success'
        })
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      setAlert({
        open: true,
        message: 'Erro ao atualizar perfil',
        severity: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || !profileData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
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

      <div className="text-center mb-8 animate-fade-in">
     
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          {profileData.username}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">@{profileData.username}</p>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{profileData.bio}</p>
        
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-sm">
            <span className="font-medium dark:text-white">
              {profileData.followers.length}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              seguidores
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium dark:text-white">
              {profileData.following.length}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              seguindo
            </span>
          </div>
        </div>

       
      </div>

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
            {links.length === 0 ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px',
                  gap: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Você ainda não possui nenhum link
                </Typography>
                <Typography color="text.secondary">
                  Clique no botão abaixo para adicionar seu primeiro link
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenNewLinkDialog(true)}
                >
                  Adicionar Link
                </Button>
              </Box>
            ) : (
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
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 4
          }}>
            <Box sx={{ 
              width: isMobile ? '100%' : isTablet ? '350px' : '400px',
              flexShrink: 0
            }}>
              <Card>
                <CardContent>
                  <CustomAvatar
                    src={profileData?.avatar}
                    username={user?.username}
                    planType={user?.plan?.type}
                    borderColor={user?.plan?.type === 'GOLD' ? avatarBorderColor : undefined}
                    editable={true}
                    onAvatarChange={handleAvatarChange}
                    isLoading={isAvatarLoading}
                  />
                  
                  {/* Campo de Bio */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Biografia
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Escreva uma breve descrição sobre você..."
                      value={settings.bio}
                      onChange={(e) => {
                        setSettings(prev => ({
                          ...prev,
                          bio: e.target.value
                        }))
                        setHasChanges(true)
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 3 }} />
                  
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
                      onChange={(color) => {
                        setSettings(prev => ({
                          ...prev,
                          backgroundColor: color
                        }))
                        setHasChanges(true)
                      }}
                      isMobile={isMobile}
                    />

                    <ColorPickerField
                      label="Cor dos Cards"
                      value={settings.cardColor}
                      onChange={(color) => {
                        setSettings(prev => ({
                          ...prev,
                          cardColor: color
                        }))
                        setHasChanges(true)
                      }}
                      isMobile={isMobile}
                    />

                    <ColorPickerField
                      label="Cor do Texto"
                      value={settings.textColor}
                      onChange={(color) => {
                        setSettings(prev => ({
                          ...prev,
                          textColor: color
                        }))
                        setHasChanges(true)
                      }}
                      isMobile={isMobile}
                    />

                    <ColorPickerField
                      label="Cor do Texto dos Cards"
                      value={settings.cardTextColor}
                      onChange={(color) => {
                        setSettings(prev => ({
                          ...prev,
                          cardTextColor: color
                        }))
                        setHasChanges(true)
                      }}
                      isMobile={isMobile}
                    />

                    <ColorPickerField
                      label="Cor dos Likes"
                      value={settings.likesColor}
                      onChange={(color) => {
                        setSettings(prev => ({
                          ...prev,
                          likesColor: color
                        }))
                        setHasChanges(true)
                      }}
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
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            displayMode: e.target.value as 'list' | 'grid'
                          }))
                          setHasChanges(true)
                        }}
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
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            cardStyle: e.target.value as 'rounded' | 'square' | 'pill'
                          }))
                          setHasChanges(true)
                        }}
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
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            animation: e.target.value as 'none' | 'fade' | 'slide' | 'bounce'
                          }))
                          setHasChanges(true)
                        }}
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
            onClick={handleSubmit}
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

        <Dialog
          open={openNewLinkDialog}
          onClose={() => !loading && setOpenNewLinkDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Adicionar Novo Link</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Título"
                value={newLink.title}
                onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                fullWidth
                disabled={loading}
                error={!newLink.title}
                helperText={!newLink.title ? 'Título é obrigatório' : ''}
              />
              <TextField
                label="URL"
                value={newLink.url}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                fullWidth
                disabled={loading}
                error={!newLink.url}
                helperText={!newLink.url ? 'URL é obrigatória' : ''}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newLink.visible}
                    onChange={(e) => setNewLink(prev => ({ ...prev, visible: e.target.checked }))}
                    disabled={loading}
                  />
                }
                label="Visível"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenNewLinkDialog(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddLink}
              disabled={loading || !newLink.title || !newLink.url}
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </DialogActions>
        </Dialog>

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