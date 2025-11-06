import { deleteCookie } from 'cookies-next';

export const logout = () => {
  // Limpiar cookies
  deleteCookie('token');
  deleteCookie('refreshToken');
  
  // Limpiar localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
  
  // Redirigir a login
  window.location.href = '/login';
};
