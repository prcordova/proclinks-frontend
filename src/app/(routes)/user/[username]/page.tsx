import { ProfileContent } from './profile-content'

// Server Component
export default async function UserLinksPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  return <ProfileContent username={resolvedParams.username} />
}
