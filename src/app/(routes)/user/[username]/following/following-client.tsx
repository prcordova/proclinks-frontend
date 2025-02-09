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
    <div className="space-y-4">
      {following.length === 0 ? (
        <p className="text-center text-muted-foreground">Não está seguindo ninguém ainda</p>
      ) : (
        following.map((user) => (
          <UserCard key={user.id} user={user} />
        ))
      )}
    </div>
  )
} 