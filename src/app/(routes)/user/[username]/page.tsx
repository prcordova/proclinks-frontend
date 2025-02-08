import { ProfileContent } from './profile-content'

export type ParamsType = Promise<{ username: string }>

export default async function UserLinksPage(props: { params: ParamsType }) {
  const { username } = await props.params
  return <ProfileContent username={username} />
}
