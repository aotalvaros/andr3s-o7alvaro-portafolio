import api from '@/lib/axios';
import { LoginResponse } from './models/loginResponse.interface';

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post('/auth/login', payload);
  return data;
}