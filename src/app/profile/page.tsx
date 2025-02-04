'use client'

import { useState, useEffect } from 'react'
import { LinkCard } from '@/components/cardLink'
import { Button } from '@/components/ui/button'
import { useThemeContext } from '@/contexts/theme-context'
import Image from 'next/image'
import { AvatarUpload } from '@/components/avatar-upload'
import { userApi } from '@/services/api'

interface ProfileData {
  id: string
  username: string
  email: string
  avatar: string | null
  bio: string
  profile: {
    backgroundColor: string
    cardColor: string
    textColor: string
    cardTextColor: string
    displayMode: string
    cardStyle: string
    animation: string
    font: string
    spacing: number
    sortMode: string
    likesColor: string
  }
  followers: string[]
  following: string[]
  links: Array<{
    _id: string
    title: string
    url: string
    visible: boolean
    order: number
    likes: number
  }>
  viewMode: 'list' | 'grid'
  isPublic: boolean
}

export default function ProfilePage() {
  const { mode, setMode } = useThemeContext()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

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

  const handleAvatarChange = async (file: File) => {
    try {
      setIsLoading(true)
      const response = await userApi.updateAvatar(file)
      if (response.success && profileData) {
        setProfileData({
          ...profileData,
          avatar: response.avatarUrl
        })
      }
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  if (!profileData) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 dark:bg-gray-900">
      <div className="text-center mb-8 animate-fade-in">
        <AvatarUpload
          currentAvatar={profileData.avatar || '/default-avatar.png'}
          onAvatarChange={handleAvatarChange}
          isLoading={isLoading}
        />
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

        <div className="flex justify-center gap-2 mt-4">
          <Button variant="outline" className="dark:text-white dark:border-gray-700">
            Seguir
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
            className="w-10 p-0 dark:text-white dark:border-gray-700"
            aria-label="Alternar tema"
          >
            {mode === 'dark' ? '🌙' : '☀️'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {profileData.links.map((link) => (
          <LinkCard key={link._id} link={link} />
        ))}
      </div>
    </div>
  )
}