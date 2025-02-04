'use client'

import { useState, useRef } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import { Button } from '@/components/ui/button'

interface AvatarUploadProps {
  currentAvatar: string
  onAvatarChange: (file: File) => Promise<void>
  isLoading?: boolean
}

export function AvatarUpload({ currentAvatar, onAvatarChange, isLoading = false }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(currentAvatar)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
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
    } catch (error) {
      console.error('Erro ao salvar avatar:', error)
    }
  }

  // Função para construir a URL completa do avatar
  const getAvatarUrl = (avatarPath: string) => {
    if (!avatarPath) return '/default-avatar.png'
    if (avatarPath.startsWith('http')) return avatarPath
    if (avatarPath.startsWith('data:')) return avatarPath // Para preview de arquivo local
    return `${process.env.NEXT_PUBLIC_API_URL}${avatarPath}` // Usando a variável de ambiente
  }

  console.log('Avatar URL:', getAvatarUrl(previewUrl)) // Debug

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative inline-block">
        <img
          src={getAvatarUrl(previewUrl)}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-primary object-cover"
          onError={(e) => {
            console.error('Erro ao carregar imagem:', e)
            e.currentTarget.src = '/default-avatar.png'
          }}
        />
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