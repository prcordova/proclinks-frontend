'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, Box, TextField, FormControlLabel, Switch, IconButton, Tooltip } from '@mui/material'
import { DragHandle as DragIcon, Delete as DeleteIcon } from '@mui/icons-material'

interface LinkItem {
  id: string
  title: string
  url: string
  visible: boolean
}

interface SortableLinkProps {
  link: LinkItem
  onUpdate: (id: string, data: Partial<LinkItem>) => void
  onDelete: (id: string) => void
}

export function SortableLink({ link, onUpdate, onDelete }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: link.id })

  const handleDelete = () => {
     onDelete(link.id)
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton size="small" {...attributes} {...listeners}>
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
                  onChange={(e) => onUpdate(link.id, { visible: e.target.checked })}
                />
              }
              label="Visível"
            />
            
            <Tooltip title="Deletar">
              <IconButton 
                onClick={handleDelete}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </div>
  )
} 