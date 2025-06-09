import { login } from "@/services/login/login.service";
import { useLoadingStore } from "@/store/loadingStore";
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react";
import { toast } from "sonner";
import { setCookie } from 'cookies-next';

export const useLogin = () => {
  
    const setLoading = useLoadingStore((state) => state.setLoading);

    const { 
        mutateAsync: auth, 
        isPending: isLoading 
    } = useMutation({
        mutationFn: (payload: { email: string; password: string }) => login(payload),
        onSuccess: (data) => {
            setCookie('token', data.token, { path: '/' });
            setCookie('refreshToken', data.refreshToken, { path: '/' });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.error(error.message ?? 'Error al iniciar sesión');
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
