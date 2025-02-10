export const getPlanStyle = (planType?: string) => {
    switch (planType) {
      case 'GOLD':
        return { borderColor: '#FFD700' }
      case 'SILVER':
        return { borderColor: '#C0C0C0' }
      case 'BRONZE':
        return { borderColor: '#CD7F32' }
      default:
        return { borderColor: 'primary.main' }
    }
  }