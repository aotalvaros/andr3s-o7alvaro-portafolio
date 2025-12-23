import { httpClient } from '@/core/infrastructure/http/httpClientFactory';
import { LoginResponse } from './models/loginResponse.interface';

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const data = await httpClient.post<LoginResponse>('/auth/login', payload);
  return data;
}