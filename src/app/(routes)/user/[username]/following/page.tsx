import { Metadata } from 'next'
import FollowingClient from './following-client'
import Link from 'next/link'

type ParamsType = Promise<{ username: string }>

export const metadata: Metadata = {
  title: 'Seguindo',
  description: 'Lista de usuários seguidos'
}

export default async function FollowingPage(props: { params: ParamsType }) {
  const {username} = await props.params

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
          <FollowingClient username={username} />
        </div>
      </div>
    </section>
  )
}