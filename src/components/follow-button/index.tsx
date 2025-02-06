'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { userApi } from '@/services/api'
import { useAuth } from '@/contexts/auth-context'

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  onFollowChange?: (isFollowing: boolean) => void
}

export function FollowButton({ userId, isFollowing: initialIsFollowing, onFollowChange }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  console.log('FollowButton received userId:', userId) // Debug

  const handleFollowClick = async () => {
    console.log('Handling click with userId:', userId) // Debug
    try {
      setIsLoading(true)
      
      if (isFollowing) {
        await userApi.unfollowUser(userId)
      } else {
        await userApi.followUser(userId)
      }

      setIsFollowing(!isFollowing)
      onFollowChange?.(!isFollowing)
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleFollowClick}
      disabled={isLoading}
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
    >
      {isLoading 
        ? 'Carregando...' 
        : isFollowing 
          ? 'Deixar de Seguir' 
          : 'Seguir'}
    </Button>
  )
} 