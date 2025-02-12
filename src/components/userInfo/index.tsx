import React from 'react'

interface UserInfoProps {
    username: string
    bio: string | undefined
    followers: number
    following: number
}

export default function UserInfo({ username, bio, followers, following }: UserInfoProps) {
  return (
    <div className="text-center mb-8 animate-fade-in min-h-[160px] flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          {username}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">@{username}</p>
        <p className="mt-2 text-gray-700 dark:text-gray-300 min-h-[48px] line-clamp-2">
          {bio || ""}
        </p>
      </div>
      
      <div className="flex justify-center gap-4 mt-4">
        <div className="text-sm">
          <span className="font-medium dark:text-white">
            {followers}
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">
            seguidores
          </span>
        </div>
        <div className="text-sm">
          <span className="font-medium dark:text-white">
            {following}
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">
            seguindo
          </span>
        </div>
      </div>
    </div>
  )
}
