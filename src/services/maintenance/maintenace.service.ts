import api from '@/lib/axios';
import { MaintenanceResponseStatus } from './models/maintenaceResponseStatus.interface';

export const getMaintenanceStatus = async (): Promise<MaintenanceResponseStatus[]> => {
  const { data } = await api.get('/modules');
  return data;
}

