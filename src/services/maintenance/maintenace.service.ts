import api from '@/lib/axios';
import { MaintenanceResponseStatus } from './models/maintenaceResponseStatus.interface';

export const getMaintenanceStatus = async (): Promise<MaintenanceResponseStatus> => {
   try {
    const { data } = await api.get('/modules', {
      showLoading: false,
      skipErrorToast: true // No mostrar toast en este servicio
    });
    return data;
  } catch (error) {
    console.error('[getMaintenanceStatus] Error fetching maintenance status:', error);
    
    // ✅ Retornar un estado por defecto en caso de error
    // Esto previene que React Query siga reintentando indefinidamente
    return {
      data: [],
      status: 'error',
      cache: false
    } as MaintenanceResponseStatus;
  }
}

