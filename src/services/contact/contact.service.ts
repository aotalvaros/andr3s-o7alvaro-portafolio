import api from '@/lib/axios';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContact(payload: ContactPayload) {
  const { data } = await api.post('/contact', payload);
  return data;
}