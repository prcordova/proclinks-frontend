import { Typography, IconButton, Box, Tooltip, useTheme, useMediaQuery } from '@mui/material'
import Link from '@mui/material/Link'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ShareIcon from '@mui/icons-material/Share'
import toast from 'react-hot-toast'
import { useState } from 'react'

interface CustomLinkProps {
  title: string
  url: string
  likes?: number
  profile: {
    cardColor: string
    cardTextColor: string
    cardStyle: 'pill' | 'square' | 'rounded'
    likesColor: string
    displayMode: 'grid' | 'list'
  }
}

export function CustomLink({ title, url, likes = 0, profile }: CustomLinkProps) {
  const [isHovered, setIsHovered] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await navigator.clipboard.writeText(url.startsWith('http') ? url : `https://${url}`)
      toast.success('Link copiado para a área de transferência!', {
        duration: 2000,
        position: 'bottom-center',
      })
    } catch (error) {
      toast.error('Não foi possível copiar o link', {
        duration: 2000,
        position: 'bottom-center'
      })
      console.error('Erro ao copiar:', error)
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: fullUrl
        })
        toast.success('Link pronto para compartilhar!', {
          duration: 2000,
          position: 'bottom-center',
        })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Não foi possível compartilhar o link', {
            duration: 2000,
            position: 'bottom-center'
          })
          console.error('Erro ao compartilhar:', error)
        }
      }
    } else {
      handleCopy(e)
    }
  }

  const ActionButtons = () => (
    <Box 
      sx={{ 
        display: 'flex',
        gap: 0.5,
        bgcolor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 1,
        p: 0.5,
        ...(isMobile ? {
          justifyContent: 'center',
          mt: 1
        } : {
          position: 'absolute',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out',
        }),
        zIndex: 2
      }}
    >
      <Tooltip title="Copiar link">
        <IconButton 
          size="small" 
          onClick={handleCopy}
          sx={{ 
            color: profile.cardTextColor,
            padding: '4px'
          }}
        >
          <ContentCopyIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Compartilhar">
        <IconButton 
          size="small" 
          onClick={handleShare}
          sx={{ 
            color: profile.cardTextColor,
            padding: '4px'
          }}
        >
          <ShareIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </Tooltip>
    </Box>
  )

  return (
    <Link
      href={url.startsWith('http') ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: 'block',
        width: profile.displayMode === 'grid' ? 'calc(50% - 8px)' : '100%',
        p: 2,
        bgcolor: profile.cardColor,
        color: profile.cardTextColor,
        borderRadius: profile.cardStyle === 'pill' ? '24px' : 
                     profile.cardStyle === 'square' ? '0px' : '8px',
        textDecoration: 'none',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Typography>
          {title}
        </Typography>

        <ActionButtons />
      </Box>

      {likes > 0 && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            mt: 1,
            color: profile.likesColor
          }}
        >
          ❤️ {likes}
        </Typography>
      )}
    </Link>
  )
} 