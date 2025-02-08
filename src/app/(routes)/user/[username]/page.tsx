import { ProfileContent } from './profile-content'

// Server Component
export default async function UserLinksPage({ 
  params 
}: { 
  params: { username: string }
}) {
  return <ProfileContent username={params.username} />
}
