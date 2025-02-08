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
}

interface Props {
  params: {
    username: string
  }
}

export default function FollowersPage({ params }: Props) {
  const [followers, setFollowers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFollowers() {
      try {
        const followersResponse = await userApi.getFollowersFromUser(params.username)
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
  }, [params.username])

  if (loading) {
    return <div>Carregando seguidores...</div>
  }

  const username = params.username

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <h1 className="text-2xl font-bold">Seguidores de @{username}</h1>
      
      <div className="space-y-4">
        {followers.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum seguidor ainda</p>
        ) : (
          followers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))
        )}
      </div>
    </div>
  )
}