import { httpClient } from '@/core/infrastructure/http/httpClientFactory';
import { User } from '@/core/domain/entities/User';

interface UserProfileResponse {
  status: string;
  data: User;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const getUserProfile = async (): Promise<User> => {
  const response = await httpClient.get<UserProfileResponse>('/user/profile');
  return response.data;
};

export const updateUserProfile = async (payload: UpdateProfilePayload): Promise<void> => {
  await httpClient.patch('/user/profile', payload);
};

export const updateUserPassword = async (payload: UpdatePasswordPayload): Promise<void> => {
  await httpClient.patch('/user/password', payload);
};
