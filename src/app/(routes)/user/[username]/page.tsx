import { ProfileContent } from './profile-content'

type ParamsType = { username: string }

export default async function UserLinksPage({ params }: { params: ParamsType }) {
  const username = params.username
  return <ProfileContent username={username} />
}
