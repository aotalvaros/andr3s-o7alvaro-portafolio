export interface LoginResponse {
  token: string;
  refreshToken: string;
  mustChangePassword?: boolean;
  message?: string;
}
