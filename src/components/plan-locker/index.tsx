import { Box, Tooltip, Button } from '@mui/material'
import { Lock as LockIcon, Stars as StarsIcon } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import React from 'react'

interface PlanLockerProps {
  children: React.ReactNode
  requiredPlan: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
  currentPlan?: 'FREE' | 'BRONZE' | 'SILVER' | 'GOLD'
  onUpgradeClick?: () => void
}

export function PlanLocker({ 
  children, 
  requiredPlan, 
  currentPlan = 'FREE',
  onUpgradeClick 
}: PlanLockerProps) {
  const router = useRouter()
  const planValues = {
    'FREE': 0,
    'BRONZE': 1,
    'SILVER': 2,
    'GOLD': 3
  }

  const hasAccess = planValues[currentPlan] >= planValues[requiredPlan]

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onUpgradeClick) {
      onUpgradeClick()
    } else {
      router.push('/plans')
    }
  }

  if (hasAccess) {
    return <>{children}</>
  }

  return (
    <Tooltip title={`Disponível no plano ${requiredPlan}`}>
      <Box sx={{ position: 'relative', pointerEvents: 'none' }}>
        <Box sx={{ opacity: 0.7 }}>
          {React.Children.map(children, child => {
            if (React.isValidElement<{ style?: React.CSSProperties }>(child)) {
              return React.cloneElement(child, {
                disabled: true,
                'aria-disabled': true,
                onClick: undefined,
                style: {
                  ...(child.props.style || {}),
                  cursor: 'not-allowed'
                }
              } as React.HTMLAttributes<HTMLElement>)
            }
            return child
          })}
        </Box>
        <Box
          onClick={handleUpgradeClick}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 'inherit',
            cursor: 'pointer',
            zIndex: 1,
            pointerEvents: 'auto',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              transform: 'scale(1.01)'
            }
          }}
        >
          <Button
            variant="contained"
            size="small"
            color="warning"
            startIcon={<LockIcon />}
            endIcon={<StarsIcon />}
            onClick={handleUpgradeClick}
            sx={{
              zIndex: 1000,
              position: 'absolute',
              bottom: '10px',
              left: '75%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              py: 0.5,
              px: 1,
              minHeight: 0,
              fontSize: '0.75rem'
            }}
          >
            {requiredPlan}
          </Button>
        </Box>
      </Box>
    </Tooltip>
  )
} 