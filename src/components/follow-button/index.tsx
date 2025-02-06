'use client'

import { Button } from '@/components/ui/button'

interface FollowButtonProps {
  text: string
  isLoading: boolean
  onClick: () => void
}

export function FollowButton({ text, isLoading, onClick }: FollowButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      variant={text === 'Deixar de Seguir' ? 'outline' : 'default'}
      size="sm"
    >
      {isLoading ? 'Carregando...' : text}
    </Button>
  )
} 