import { httpClient } from '@/core/infrastructure/http/httpClientFactory';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContact(payload: ContactPayload) {
  const data = await httpClient.post('/contact', payload);
  return data;
}