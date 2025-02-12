import { Box, Card, CardContent, Typography, Divider, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material'
import { ColorPickerField } from '@/components/color-picker-field'
import { CustomAvatar } from '@/components/avatar'
import { useState } from 'react'
import { PlanLocker } from '@/components/plan-locker'

interface AppearanceProps {
  settings: {
    bio: string
    backgroundColor: string
    cardColor: string
    textColor: string
    cardTextColor: string
    likesColor: string
    displayMode: 'list' | 'grid'
    cardStyle: 'rounded' | 'square' | 'pill'
    font: 'default' | 'serif' | 'mono'
    spacing: number
  }
  user: {
    username: string | undefined
    plan?: { 
      type: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD' 
    } | undefined
  } | null
  profileData: {
    avatar?: string | null
  } | null
  onSettingsChange: (newSettings: Partial<AppearanceProps['settings']>) => void
  onAvatarChange: (file: File) => Promise<void>
  isMobile: boolean
}

export function Appearance({ 
  settings, 
  user, 
  profileData, 
  onSettingsChange, 
  onAvatarChange, 
  isMobile 
}: AppearanceProps) {
  const [isAvatarLoading, setIsAvatarLoading] = useState(false)
  const avatarBorderColor = '#FFD700' // Cor dourada para borda do avatar

  const handleChange = (
    field: keyof AppearanceProps['settings'],
    value: string | number | 'list' | 'grid' | 'rounded' | 'square' | 'pill' | 'default' | 'serif' | 'mono'
  ) => {
    onSettingsChange({ [field]: value })
  }

  const handleAvatarUpload = async (file: File) => {
    setIsAvatarLoading(true)
    try {
      await onAvatarChange(file)
    } finally {
      setIsAvatarLoading(false)
    }
  }

 
  return (
    <Card>
      <CardContent>
        {/* Avatar */}
        <CustomAvatar
          src={profileData?.avatar || null}
          username={user?.username}
          planType={user?.plan?.type}
          borderColor={user?.plan?.type === 'GOLD' ? avatarBorderColor : undefined}
          editable={true}
          onAvatarChange={handleAvatarUpload}
          isLoading={isAvatarLoading}
        />

        {/* Biografia */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Biografia
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Escreva uma breve descrição sobre você..."
            value={settings.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Cores */}
        <Typography variant="h6" gutterBottom>
          Cores
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 2
        }}>
          <PlanLocker
            requiredPlan="GOLD"
            currentPlan={user?.plan?.type}
          >
            <ColorPickerField
              label="Cor de Fundo"
              value={settings.backgroundColor}
              onChange={(color) => handleChange('backgroundColor', color)}
              isMobile={isMobile}
            />
          </PlanLocker>

          <PlanLocker
            requiredPlan="GOLD"
            currentPlan={user?.plan?.type}
          >
            <ColorPickerField
              label="Cor dos Cards"
              value={settings.cardColor}
              onChange={(color) => handleChange('cardColor', color)}
              isMobile={isMobile}
            />
          </PlanLocker>

          <PlanLocker
            requiredPlan="GOLD"
            currentPlan={user?.plan?.type}
          >
            <ColorPickerField
              label="Cor do Texto"
              value={settings.textColor}
              onChange={(color) => handleChange('textColor', color)}
              isMobile={isMobile}
            />
          </PlanLocker>

          <PlanLocker
            requiredPlan="GOLD"
            currentPlan={user?.plan?.type}
          >
            <ColorPickerField
              label="Cor do Texto dos Cards"
              value={settings.cardTextColor}
              onChange={(color) => handleChange('cardTextColor', color)}
              isMobile={isMobile}
            />
          </PlanLocker>

          <PlanLocker
            requiredPlan="GOLD"
            currentPlan={user?.plan?.type}
          >
            <ColorPickerField
              label="Cor dos Likes"
              value={settings.likesColor}
              onChange={(color) => handleChange('likesColor', color)}
              isMobile={isMobile}
            />
          </PlanLocker>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Layout */}
        <Typography variant="h6" gutterBottom>
          Layout
        </Typography>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr',
          gap: 2
        }}>
          <PlanLocker
            requiredPlan="GOLD"
            currentPlan={user?.plan?.type}
          >
            <FormControl fullWidth>
              <InputLabel>Modo de Exibição</InputLabel>
              <Select
              value={settings.displayMode}
              onChange={(e) => handleChange('displayMode', e.target.value)}
              size={isMobile ? "small" : "medium"}
            >
              <MenuItem value="list">Lista</MenuItem>
              <MenuItem value="grid">Grade</MenuItem>
            </Select>
          </FormControl>
          </PlanLocker>

          <PlanLocker
            requiredPlan="GOLD"
            currentPlan={user?.plan?.type}
          >
            <FormControl fullWidth>
              <InputLabel>Estilo dos Cards</InputLabel>
              <Select
              value={settings.cardStyle}
              onChange={(e) => handleChange('cardStyle', e.target.value)}
              size={isMobile ? "small" : "medium"}
            >
              <MenuItem value="rounded">Arredondado</MenuItem>
              <MenuItem value="square">Quadrado</MenuItem>
              <MenuItem value="pill">Pílula</MenuItem>
            </Select>
            </FormControl>
          </PlanLocker>
           


          <PlanLocker
            requiredPlan="GOLD"
            currentPlan={user?.plan?.type}
          >
            <FormControl fullWidth>
              <InputLabel>Espaçamento</InputLabel>
              <Select
              value={settings.spacing}
              onChange={(e) => handleChange('spacing', e.target.value)}
              size={isMobile ? "small" : "medium"}
            >
              <MenuItem value={8}>Pequeno</MenuItem>
              <MenuItem value={16}>Médio</MenuItem>
              <MenuItem value={24}>Grande</MenuItem>
            </Select>
          </FormControl>
          </PlanLocker>
        </Box>
      </CardContent>
    </Card>
  )
} 