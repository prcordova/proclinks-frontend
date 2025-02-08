import { Metadata } from 'next'
import FollowersClient from './followers-client'
import Link from 'next/link'

export type ParamsType = Promise<{ username: string }>

export const metadata: Metadata = {
  title: 'Seguidores',
  description: 'Lista de seguidores'
}

export default async function FollowersPage(props: { params: ParamsType }) {
  const { username } = await props.params

  return (
    <section className="py-6">
      <div className="container max-w-2xl">
        <div>
          <Link
            href={`/user/${username}`}
            className="font-semibold text-primary hover:underline"
          >
            Voltar ao perfil
          </Link>
        </div>
        <div className="mt-6">
          <FollowersClient username={username} />
        </div>
      </div>
    </section>
  )
}