'use client'

import { LinkCard } from '@/components/cardLink'
import { Button } from '@/components/ui/button'
import { useThemeContext } from '@/contexts/theme-context'
import Image from 'next/image'

// Isso será substituído por uma chamada à API
const mockProfile = {
  id: '1',
  username: 'johndoe',
  name: 'John Doe',
  avatar: 'https://github.com/johndoe.png',
  bio: 'Desenvolvedor Full Stack | Criador de conteúdo',
  links: [
    {
      id: '1',
      title: 'Meu Blog',
      url: 'https://blog.exemplo.com',
      style: 'card',
      customization: {
        backgroundColor: '#4f46e5',
        textColor: '#ffffff',
        borderRadius: '12px',
        shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
      order: 1,
      isActive: true,
    },
    // ... mais links
  ],
  metrics: {
    views: 1200,
    clicks: 450,
    relevanceScore: 85,
  },
  theme: {
    primary: '#4f46e5',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#818cf8',
  },
  social: {
    followers: 1500,
    following: 890,
  },
}

export default function ProfilePage() {
  const { mode, setMode } = useThemeContext()

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 dark:bg-gray-900">
      <div className="text-center mb-8 animate-fade-in">
        <Image
          src={mockProfile.avatar}
          alt={mockProfile.name}
          width={96}
          height={96}
          className="rounded-full mx-auto mb-4 border-4 border-primary"
        />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {mockProfile.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">@{mockProfile.username}</p>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{mockProfile.bio}</p>
        
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-sm">
            <span className="font-medium dark:text-white">
              {mockProfile.social.followers}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              seguidores
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium dark:text-white">
              {mockProfile.social.following}
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
        {mockProfile.links.map((link) => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>
    </div>
  )
}