import { useLoadingStore } from "@/store/loadingStore";
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react";
import { toast } from "sonner";
import { setCookie } from 'cookies-next';
import { httpClient } from '@/core/infrastructure/http/httpClientFactory';
import { LoginResponse } from '@/services/login/models/loginResponse.interface';

export const useLogin = () => {
  
    const setLoading = useLoadingStore((state) => state.setLoading);

    const { 
        mutateAsync: auth, 
        isPending: isLoading 
    } = useMutation({
        mutationFn: (payload: { email: string; password: string }) => httpClient.post<LoginResponse>('/auth/login', payload),
        onSuccess: (data) => {
            // Establecer cookies con configuración segura
            setCookie('token', data?.token, { 
                path: '/', 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 7 días
            });
            setCookie('refreshToken', data?.refreshToken, { 
                path: '/', 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 30 // 30 días
            });
            
            // También guardar en localStorage como respaldo
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', data?.token);
            }

            const loginMessage = data?.message || 'Inicio de sesión exitoso';
            toast.success(loginMessage);

            if (data?.mustChangePassword) {
                toast.warning('Debes cambiar tu contraseña antes de continuar.');
            }
        },
    });

    useEffect(() => {
        setLoading(isLoading);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);
    
    
    return {
        auth,
        isLoading,
    };

}
