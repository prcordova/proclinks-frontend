'use client'

import { useState, useEffect } from 'react'
import { 
  Container, Box, Typography, Card, CardContent, 
  Button, Chip, Divider, useTheme, useMediaQuery 
} from '@mui/material'
import {
  Diamond as DiamondIcon,
  WorkspacePremium as PremiumIcon,
  Star as StarIcon,
  Check as CheckIcon
} from '@mui/icons-material'
import {
  paymentApi,
  userApi
} from '@/services/api'
import { CancelPlan } from '@/components/CancelPlan'

export default function PlansPage() {
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [currentPlan, setCurrentPlan] = useState<string>('FREE')
  const [expirationDate, setExpirationDate] = useState<string | null>(null)
  const [planStatus, setPlanStatus] = useState<string>('INACTIVE')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedNewPlan, setSelectedNewPlan] = useState<string | null>(null)

  const plans = [
   
    {
      name: 'FREE',
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      price: 'R$ 0,00',
      color: '#000000',
      features: [
        'Até 3 links',
        'Navegação limitada',
        
         
      ],
      recommended: false
    },
    
  
    {
      name: 'BRONZE',
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      price: 'R$ 4,90',
      color: '#CD7F32',
      features: [
        'Até 5 links',
        'Ordenação personalizada dos links',
        'Customização de cores de cards'
      ],
      recommended: false
    },
    {
      name: 'SILVER',
      icon: <PremiumIcon sx={{ fontSize: 40 }} />,
      price: 'R$ 9,90',
      color: '#C0C0C0',
      features: [
        'Até 10 links',
        'Ordenação personalizada dos links',
        'Customização de cores de cards',
        'Customização de cores de textos de cards',
        'Customização de cores de background',
      ],
      recommended: true
    },
    {
      name: 'GOLD',
      icon: <DiamondIcon sx={{ fontSize: 40 }} />,
      price: 'R$ 29,90',
      color: '#FFD700',
      features: [
        'Até 50 links',
        'Ordenação personalizada dos links',
        'Customização de cores de cards',
        'Customização de cores de textos de cards',
        'Customização de cores de background',
        'Customização de cores de bordas',
        'Customização de cores de ícones',
        'Customização de cores de links',
        'Icones personalizados',
      ],
      recommended: false
    }
  ]

  const fetchUserPlan = async () => {
    try {
      const userData = await userApi.getMyProfile()
      setCurrentPlan(userData.data.plan.type)
      setExpirationDate(userData.data.plan.expirationDate)
      setPlanStatus(userData.data.plan.status)
    } catch (error) {
      console.error('Erro ao buscar plano do usuário:', error)
    }
  }

  useEffect(() => {
    fetchUserPlan()
  }, [])

  const getButtonText = (planName: string) => {
    if (planName === currentPlan) {
      return 'Plano Atual';
    }
    return 'Assinar';
  };

  const handleSubscribe = async (planName: string) => {
    if (currentPlan !== 'FREE' && planStatus === 'ACTIVE') {
      setSelectedNewPlan(planName);
      setShowCancelDialog(true);
      return;
    }

    try {
      const { url } = await paymentApi.createCheckoutSession(planName);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
    }
  };

  const handlePlanCancelled = () => {
    fetchUserPlan();
  };

  const handleCancelAndProceed = async () => {
    if (selectedNewPlan) {
      const { url } = await paymentApi.createCheckoutSession(selectedNewPlan);
      if (url) {
        window.location.href = url;
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {currentPlan !== 'FREE' && (
        <CancelPlan
          currentPlan={currentPlan}
          expirationDate={expirationDate}
          planStatus={planStatus}
          onPlanCancelled={handlePlanCancelled}
          newPlan={selectedNewPlan || undefined}
          onCancelAndProceed={handleCancelAndProceed}
          showDialog={showCancelDialog}
          onCloseDialog={() => {
            setShowCancelDialog(false);
            setSelectedNewPlan(null);
          }}
        />
      )}

      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Escolha seu Plano
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Desbloqueie todo o potencial do seu perfil com nossos planos premium
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 4,
        justifyContent: 'center',
        alignItems: 'stretch'
      }}>
        {plans.map((plan) => (
          <Card
            key={plan.name}
            sx={{
              flex: 1,
              maxWidth: isMobile ? '100%' : 350,
              position: 'relative',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                transform: isMobile ? 'none' : 'translateY(-8px)',
                boxShadow: theme.shadows[10]
              },
              ...(plan.recommended && {
                border: `2px solid ${theme.palette.primary.main}`,
                transform: isMobile ? 'none' : 'scale(1.05)',
                '&:hover': {
                  transform: isMobile ? 'none' : 'translateY(-8px) scale(1.05)'
                }
              })
            }}
          >
            {plan.recommended && (
              <Chip
                label="Mais Popular"
                color="primary"
                sx={{
                  position: 'absolute',
                  top: { xs: 12, sm: 16 },
                  right: { xs: -8, sm: -12 },
                  transform: 'rotate(15deg)',
                  zIndex: 1,
                  height: { xs: 24, sm: 32 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  background: `linear-gradient(135deg, 
                    ${theme.palette.primary.main} 0%, 
                    ${theme.palette.primary.dark} 100%
                  )`,
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(8px)',
                  '& .MuiChip-label': {
                    px: { xs: 1, sm: 2 },
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  },
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'rotate(15deg) scale(1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    },
                    '50%': {
                      transform: 'rotate(15deg) scale(1.05)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                    },
                    '100%': {
                      transform: 'rotate(15deg) scale(1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }
                }}
              />
            )}
            <CardContent sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: 4,
              flex: 1,
              '&:last-child': { pb: 4 }
            }}>
              <Box sx={{ 
                color: plan.color,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                mb: 2
              }}>
                {plan.icon}
                <Typography 
                  variant="h4" 
                  component="h2" 
                  fontWeight="bold"
                  align="center"
                >
                  {plan.name}
                </Typography>
              </Box>

              <Typography 
                variant="h4" 
                component="p" 
                fontWeight="bold"
                align="center"
              >
                {plan.price}
                <Typography 
                  component="span" 
                  variant="subtitle1" 
                  color="text.secondary"
                  align="center"
                >
                  /mês
                </Typography>
              </Typography>

              <Divider sx={{ width: '100%', my: 2 }} />

              <Box sx={{ 
                width: '100%',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                mb: 3
              }}>
                {plan.features.map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                      minHeight: 32
                    }}
                  >
                    <CheckIcon color="success" sx={{ flexShrink: 0 }} />
                    <Typography align="left" sx={{ flex: 1 }}>
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button
                variant={plan.recommended ? "contained" : "outlined"}
                size="large"
                fullWidth
                onClick={() => handleSubscribe(plan.name)}
                onTouchStart={() => console.log('Touch start:', plan.name)}
                onTouchEnd={() => console.log('Touch end:', plan.name)}
                disabled={plan.name === currentPlan}
                sx={{ 
                  mt: 'auto',
                  position: 'relative',
                  zIndex: 1,
                  minHeight: '48px',
                  '&:active': {
                    transform: 'scale(0.98)'
                  }
                }}
              >
                {getButtonText(plan.name)}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Precisa de mais informações? Entre em contato com nosso suporte.
        </Typography>
      </Box>
    </Container>
  )
} 