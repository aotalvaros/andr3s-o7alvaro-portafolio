import api from "@/lib/axios";
import { ToggleModuleRequest } from "./models/toggleModuleRequest.interface";

export interface ToggleModuleResponse {
  message: string;
  data: ToggleModuleRequest;
}

export const toggleModule = async (data: ToggleModuleRequest): Promise<ToggleModuleResponse> => {
  return api.post('/modules/toggle', data, {
    showLoading: false,
  })
    .then((response) => response.data);
};