'use client'

interface LinkCardProps {
  link: {
    id: string
    title: string
    url: string
    style: string
    customization: {
      backgroundColor: string
      textColor: string
      borderRadius: string
      shadow: string
    }
    isActive: boolean
  }
}

export function LinkCard({ link }: LinkCardProps) {
  const handleClick = () => {
    window.open(link.url, '_blank')
  }

  if (!link.isActive) return null

  return (
    <button
      onClick={handleClick}
      className="w-full p-4 rounded-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
      style={{
        backgroundColor: link.customization.backgroundColor,
        color: link.customization.textColor,
        borderRadius: link.customization.borderRadius,
        boxShadow: link.customization.shadow,
      }}
    >
      <span className="font-medium">{link.title}</span>
    </button>
  )
}