import { Metadata } from 'next'
import FollowersClient from './followers-client'

type Params = Promise<{ username: string }>

export const metadata: Metadata = {
  title: 'Seguidores',
  description: 'Lista de seguidores'
}

export default async function FollowersPage(props: { params: Params }) {
  return <FollowersClient params={props.params} />
}