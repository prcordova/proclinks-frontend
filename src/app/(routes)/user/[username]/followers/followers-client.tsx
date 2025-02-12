'use client'

import { useEffect, useState } from "react"
import { userApi } from "@/services/api"
import { UserCard } from "@/components/user-card"
import toast from "react-hot-toast"

interface User {
  id: string
  username: string
  name: string
  avatar?: string
  followers: number
  following: number
  bio?: string
  plan?: {
    type: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
  }
}

export default function FollowersClient({ username }: { username: string }) {
  const [followers, setFollowers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFollowers() {
      try {
        const followersResponse = await userApi.getFollowersFromUser(username)
        const followersData = followersResponse.data?.data || []
        setFollowers(followersData)
      } catch (error) {
        console.error('Erro ao carregar seguidores:', error)
        toast.error('Erro ao carregar seguidores')
      } finally {
        setLoading(false)
      }
    }

    loadFollowers()
  }, [username])

  if (loading) {
    return <div>Carregando seguidores...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Seguidores de @{username}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {followers.length === 0 ? (
          <p className="text-center text-muted-foreground col-span-full">
            Nenhum seguidor ainda
          </p>
        ) : (
          followers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))
        )}
      </div>
    </div>
  )
} 