import { httpClient } from '@/core/infrastructure/http/httpClientFactory';
import { ToggleModuleRequest } from "./models/toggleModuleRequest.interface";

export interface ToggleModuleResponse {
  message: string;
  data: ToggleModuleRequest;
}

export const toggleModule = async (data: ToggleModuleRequest): Promise<ToggleModuleResponse> => {
  return httpClient.post<ToggleModuleResponse>('/modules/toggle', data, {
    showLoading: false,
  });
}