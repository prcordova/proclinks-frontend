'use client'

interface LinkCardProps {
  link: {
    _id: string
    title: string
    url: string
    visible: boolean
    order: number
    likes: number
    style?: string
    customization?: {
      backgroundColor?: string
      textColor?: string
      borderRadius?: string
      shadow?: string
    }
  }
}

export function LinkCard({ link }: LinkCardProps) {
  const handleClick = () => {
    window.open(link.url, '_blank')
  }

  if (!link.visible) return null

  return (
    <button
      onClick={handleClick}
      className="w-full p-4 rounded-lg transition-all hover:scale-[1.01] active:scale-[0.99] bg-white dark:bg-gray-800 shadow hover:shadow-md"
      style={{
        backgroundColor: link.customization?.backgroundColor,
        color: link.customization?.textColor,
        borderRadius: link.customization?.borderRadius,
        boxShadow: link.customization?.shadow,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{link.title}</span>
        {link.likes > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {link.likes} likes
          </span>
        )}
      </div>
    </button>
  )
}