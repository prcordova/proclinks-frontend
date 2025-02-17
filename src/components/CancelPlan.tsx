import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import { paymentApi } from '@/services/api';

interface CancelPlanProps {
  currentPlan: string;
  expirationDate: string | null;
  planStatus: string;
  onPlanCancelled: () => void;
  newPlan?: string;  // Plano que o usuário quer assinar
  onCancelAndProceed?: () => void;  // Callback após cancelar para prosseguir com novo plano
  showDialog?: boolean;  // Controle externo do diálogo
  onCloseDialog?: () => void;  // Callback para fechar diálogo
}

export const CancelPlan = ({ 
  currentPlan, 
  expirationDate, 
  planStatus, 
  onPlanCancelled,
  newPlan,
  onCancelAndProceed,
  showDialog,
  onCloseDialog
}: CancelPlanProps) => {
  const [localOpenDialog, setLocalOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancelClick = () => {
    
    setLocalOpenDialog(true);
   };

  // Simplificando a lógica do dialog
  const isDialogOpen = newPlan ? showDialog : localOpenDialog;

  
  const handleClose = () => {
    if (onCloseDialog) {
      onCloseDialog();
    }
    setLocalOpenDialog(false);
  };

  const handleCancelPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await paymentApi.cancelSubscription();
      
      handleClose();
      onPlanCancelled();
      
      if (onCancelAndProceed) {
        onCancelAndProceed();
      }
    } catch {
      setError('Erro ao cancelar assinatura. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'CANCELLED':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <>
      {!newPlan && (
        <Card sx={{ mb: 4, p: { xs: 2, sm: 3 }, position: 'relative' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 2,
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Seu Plano Atual
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 1,
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {currentPlan}
                </Typography>
                <Chip 
                  label={planStatus} 
                  color={getStatusColor(planStatus) as 'success' | 'warning' | 'default'}
                  size="small"
                />
              </Box>
              {expirationDate && (
                <Typography variant="body2" color="text.secondary">
                  Válido até {formatDate(expirationDate)}
                </Typography>
              )}
            </Box>
            
            {planStatus === 'ACTIVE' && (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleCancelClick}
                sx={{ 
                  minWidth: { xs: '100%', sm: 'auto' }
                }}
              >
                Cancelar Assinatura
              </Button>
            )}
          </Box>
        </Card>
      )}

      <Dialog 
        open={isDialogOpen || false} 
        onClose={handleClose}
      >
        <DialogTitle>
          {newPlan ? 'Trocar de Plano' : 'Confirmar Cancelamento'}
        </DialogTitle>
        <DialogContent>
          {newPlan ? (
            <>
              <Typography gutterBottom>
                Para assinar o plano {newPlan}, é necessário cancelar seu plano atual ({currentPlan}).
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Você manterá acesso ao plano {currentPlan} até o final do período atual, 
                quando então iniciará o plano {newPlan}.
              </Typography>
            </>
          ) : (
            <>
              <Typography gutterBottom>
                Tem certeza que deseja cancelar sua assinatura do plano {currentPlan}?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Você continuará tendo acesso aos recursos do plano até o final do período atual.
              </Typography>
            </>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Voltar
          </Button>
          <Button 
            onClick={handleCancelPlan} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {newPlan ? 'Cancelar e Trocar Plano' : 'Confirmar Cancelamento'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 