import { deleteCookie } from 'cookies-next';

export const logout = () => {
  deleteCookie('token');
  localStorage.removeItem('token');
  // Redirige a login
  window.location.href = '/login';
};
