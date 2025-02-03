'use client'

import { useState, useEffect } from 'react'
import { 
  Container, Box, Paper, Typography, Button, 
  TextField, Switch, FormControlLabel, IconButton,
  Grid, Card, CardContent, Tooltip,
  ToggleButton, ToggleButtonGroup
} from '@mui/material'
import { 
  DragHandle as DragIcon,
  Delete as DeleteIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Add as AddIcon,
  Language as LanguageIcon
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
  gridSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface LinkItem {
  id: string
  title: string
  url: string
  icon?: string
  visible: boolean
  useFavicon: boolean
}

function SortableLink({ link, index, viewMode, onDelete, onVisibilityChange }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Grid 
      item 
      xs={12}
      sm={viewMode === 'grid' ? 6 : 12}
      ref={setNodeRef}
      style={style}
    >
      <Card>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton {...attributes} {...listeners}>
            <DragIcon />
          </IconButton>
          {link.icon ? (
            <img 
              src={link.icon} 
              alt={link.title}
              style={{ width: 24, height: 24 }}
            />
          ) : (
            <LanguageIcon />
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">
              {link.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {link.url}
            </Typography>
          </Box>
          <Tooltip title={link.visible ? 'Visível' : 'Oculto'}>
            <Switch
              checked={link.visible}
              onChange={(e) => onVisibilityChange(index, e.target.checked)}
            />
          </Tooltip>
          <IconButton 
            color="error"
            onClick={() => onDelete(link.id)}
          >
            <DeleteIcon />
          </IconButton>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default function EditLinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    visible: true,
    useFavicon: true
  })

  const [username] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currentUser') || ''
    }
    return ''
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    const savedLinks = localStorage.getItem(`links_${username}`)
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks))
    }
    
    const savedViewMode = localStorage.getItem(`viewMode_${username}`)
    if (savedViewMode) {
      setViewMode(savedViewMode as 'list' | 'grid')
    }
  }, [username])

  useEffect(() => {
    if (username) {
      localStorage.setItem(`links_${username}`, JSON.stringify(links))
    }
  }, [links, username])

  useEffect(() => {
    if (username) {
      localStorage.setItem(`viewMode_${username}`, viewMode)
    }
  }, [viewMode, username])

  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) return

    const favicon = newLink.useFavicon 
      ? `https://www.google.com/s2/favicons?domain=${newLink.url}&sz=128`
      : undefined

    setLinks([...links, {
      id: Date.now().toString(),
      title: newLink.title,
      url: newLink.url,
      icon: favicon,
      visible: newLink.visible,
      useFavicon: newLink.useFavicon
    }])

    setNewLink({
      title: '',
      url: '',
      visible: true,
      useFavicon: true
    })
  }

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id))
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Adicionar Novo Link
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Título"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="URL"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newLink.visible}
                    onChange={(e) => setNewLink({ ...newLink, visible: e.target.checked })}
                  />
                }
                label="Visível"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newLink.useFavicon}
                    onChange={(e) => setNewLink({ ...newLink, useFavicon: e.target.checked })}
                  />
                }
                label="Usar Favicon"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddLink}
                fullWidth
              >
                Adicionar Link
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            Meus Links
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="list">
              <ListIcon />
            </ToggleButton>
            <ToggleButton value="grid">
              <GridIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links}
            strategy={viewMode === 'grid' ? gridSortingStrategy : verticalListSortingStrategy}
          >
            <Grid container spacing={2}>
              {links.map((link, index) => (
                <SortableLink
                  key={link.id}
                  link={link}
                  index={index}
                  viewMode={viewMode}
                  onDelete={handleDeleteLink}
                  onVisibilityChange={(index: number, checked: boolean) => {
                    const newLinks = [...links]
                    newLinks[index].visible = checked
                    setLinks(newLinks)
                  }}
                />
              ))}
            </Grid>
          </SortableContext>
        </DndContext>
      </Box>
    </Container>
  )
} 