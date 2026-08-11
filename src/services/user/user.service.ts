import { httpClient } from '@/core/infrastructure/http/httpClientFactory';
import { User } from '@/core/domain/entities/User';

interface UserProfileResponse {
  status: string;
  data: User;
}

export const getUserProfile = async (): Promise<User> => {
  const response = await httpClient.get<UserProfileResponse>('/user/profile');
  return response.data;
};
