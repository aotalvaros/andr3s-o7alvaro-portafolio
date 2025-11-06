import { deleteCookie } from 'cookies-next';

export const logout = () => {
  try {
    // Limpiar cookies
    deleteCookie('token', { path: '/' });
    deleteCookie('refreshToken', { path: '/' });
    
    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    
    // Redirigir a login usando replace para evitar historial
    if (typeof window !== 'undefined') {
      window.location.replace('/login');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Forzar redirección incluso si hay errores
    if (typeof window !== 'undefined') {
      window.location.replace('/login');
    }
  }
}
