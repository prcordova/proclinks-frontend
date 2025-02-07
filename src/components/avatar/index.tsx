'use client'

import { useState, useRef } from 'react'
import { IconButton, Tooltip, Avatar as MuiAvatar, Box } from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import { Button } from '@/components/ui/button'

interface CustomAvatarProps {
  src: string | null
  username?: string
  size?: number
  planType?: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
  borderColor?: string
  editable?: boolean
  onAvatarChange?: (file: File) => Promise<void>
  isLoading?: boolean
}

const PLAN_BORDERS = {
  FREE: 'none',
  BRONZE: '2px solid #CD7F32',
  SILVER: '2px solid #C0C0C0',
  GOLD: '2px solid #FFD700'
}

export function CustomAvatar({
  src,
  username = '',
  size = 96,
  planType = 'FREE',
  borderColor,
  editable = false,
  onAvatarChange,
  isLoading = false
}: CustomAvatarProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getBorderStyle = () => {
    if (planType === 'GOLD' && borderColor) {
      return `2px solid ${borderColor}`
    }
    return PLAN_BORDERS[planType]
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
        setImageError(false)
      }
      reader.readAsDataURL(file)
      setSelectedFile(file)
    }
  }

  const handleSave = async () => {
    if (!selectedFile || !onAvatarChange) return

    try {
      await onAvatarChange(selectedFile)
      setSelectedFile(null)
      setPreviewUrl(null)
      setImageError(false)
    } catch (error) {
      console.error('Erro ao salvar avatar:', error)
    }
  }

  const avatarUrl = previewUrl || 
    (src && !imageError 
      ? `${process.env.NEXT_PUBLIC_API_URL}${src}` 
      : undefined)

  const AvatarComponent = (
    <MuiAvatar
      src={avatarUrl}
      onError={() => setImageError(true)}
      sx={{ 
        width: size, 
        height: size,
        border: getBorderStyle()
      }}
    >
      {username?.slice(0, 2).toUpperCase()}
    </MuiAvatar>
  )

  if (!editable) {
    return AvatarComponent
  }

  return (
    <Box className="flex flex-col items-center gap-4">
      <Box className="relative inline-block">
        {AvatarComponent}
        
        <Tooltip title="Alterar foto">
          <IconButton
            className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white"
            size="small"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <CameraAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Box>

      {selectedFile && (
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="mt-2"
          variant="outline"
        >
          {isLoading ? 'Salvando...' : 'Salvar foto'}
        </Button>
      )}
    </Box>
  )
} 