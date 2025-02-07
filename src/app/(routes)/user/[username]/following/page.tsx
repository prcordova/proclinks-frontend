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

export default function FollowingPage({ params }: { params: { username: string } }) {
  const [following, setFollowing] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFollowing() {
      try {
        const followingResponse = await userApi.getFollowingFromUser(params.username)
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
  }, [params.username])

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <h1 className="text-2xl font-bold">Seguindo por @{params.username}</h1>
      
      <div className="space-y-4">
        {following.length === 0 ? (
          <p className="text-center text-muted-foreground">Não está seguindo ninguém ainda</p>
        ) : (
          following.map((user) => (
            <UserCard key={user.id} user={user} />
          ))
        )}
      </div>
    </div>
  )
}