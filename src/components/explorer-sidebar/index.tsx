import { 
  Box, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Drawer, IconButton, useMediaQuery, useTheme 
} from '@mui/material'
import { useState } from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MenuIcon from '@mui/icons-material/Menu'

export type FilterOption = 'popular' | 'unpopular' | 'mostViewed' | 'mostLiked'

interface ExplorerSidebarProps {
  selectedFilter: FilterOption
  onFilterChange: (filter: FilterOption) => void
}

const filterOptions = [
  { id: 'popular', label: 'Mais Seguidores', icon: <TrendingUpIcon /> },
  { id: 'unpopular', label: 'Menos Seguidores', icon: <TrendingDownIcon /> },
  { id: 'mostViewed', label: 'Mais Visualizados', icon: <VisibilityIcon /> },
  { id: 'mostLiked', label: 'Mais Curtidos', icon: <FavoriteIcon /> },
]

export function ExplorerSidebar({ selectedFilter, onFilterChange }: ExplorerSidebarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawerContent = (
    <List sx={{ pt: 2 }}>
      {filterOptions.map((option) => (
        <ListItem key={option.id} disablePadding>
          <ListItemButton
            selected={selectedFilter === option.id}
            onClick={() => {
              onFilterChange(option.id as FilterOption)
              if (isMobile) handleDrawerToggle()
            }}
            sx={{
              borderRadius: 1,
              mx: 1,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'inherit',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {option.icon}
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mb: 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Box
        component="nav"
        sx={{
          width: { md: 240 },
          flexShrink: { md: 0 },
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { 
                width: 240,
                boxSizing: 'border-box',
                backgroundColor: 'background.default'
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              height: 'fit-content',
            }}
          >
            {drawerContent}
          </Box>
        )}
      </Box>
    </>
  )
} 