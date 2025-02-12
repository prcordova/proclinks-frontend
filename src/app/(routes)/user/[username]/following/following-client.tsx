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

export default function FollowingClient({ username }: { username: string }) {
  const [following, setFollowing] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFollowing() {
      try {
        const followingResponse = await userApi.getFollowingFromUser(username)
        const followingData = followingResponse.data?.data || []
        setFollowing(followingData)
      } catch (error) {
        console.error('Erro ao carregar usuários seguidos:', error)
        toast.error('Erro ao carregar usuários seguidos')
      } finally {
        setLoading(false)
      }
    }

    loadFollowing()
  }, [username])

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Seguindo por @{username}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {following.length === 0 ? (
          <p className="text-center text-muted-foreground col-span-full">
            Não está seguindo ninguém ainda
          </p>
        ) : (
          following.map((user) => (
            <UserCard key={user.id} user={user} />
          ))
        )}
      </div>
    </div>
  )
} 