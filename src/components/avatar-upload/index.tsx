'use client'

import { useState, useRef } from 'react'
import { IconButton, Tooltip, Avatar } from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import { Button } from '@/components/ui/button'

interface AvatarUploadProps {
  currentAvatar: string
  onAvatarChange: (file: File) => Promise<void>
  isLoading?: boolean
  username?: string
}

export function AvatarUpload({ 
  currentAvatar, 
  onAvatarChange, 
  isLoading = false,
  username = ''
}: AvatarUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if (!selectedFile) return

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
    (currentAvatar && !imageError 
      ? `${process.env.NEXT_PUBLIC_API_URL}${currentAvatar}` 
      : undefined)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative inline-block">
        <Avatar
          src={avatarUrl}
          onError={() => setImageError(true)}
          sx={{ 
            width: 96, 
            height: 96,
            border: 4,
            borderColor: 'primary.main'
          }}
        >
          {username?.slice(0, 2).toUpperCase()}
        </Avatar>
        
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
      </div>

      <Button
        onClick={handleSave}
        disabled={isLoading || !selectedFile}
        className="mt-2"
        variant="outline"
      >
        {isLoading ? 'Salvando...' : selectedFile ? 'Salvar foto' : 'Nenhuma alteração'}
      </Button>
    </div>
  )
} 