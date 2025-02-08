import { Metadata } from 'next'
import FollowersClient from './followers-client'

type Props = {
  params: {
    username: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
  title: 'Seguidores',
  description: 'Lista de seguidores'
}

export default function FollowersPage(props: Props) {
  return <FollowersClient username={props.params.username} />
}