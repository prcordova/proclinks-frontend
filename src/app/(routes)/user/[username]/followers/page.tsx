import FollowersClient from './followers-client'

export default async function FollowersPage({ 
  params 
}: { 
  params: { username: string } 
}) {
  return <FollowersClient username={params.username} />
}