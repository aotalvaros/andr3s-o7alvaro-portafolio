import { useLoadingStore } from "@/store/loadingStore";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { httpClient } from '@/core/infrastructure/http/httpClientFactory';

export const usePostContact = () => {

  const setLoading = useLoadingStore((state) => state.setLoading);

  const {
    mutateAsync: sendEmail,
    isPending: isLoading,
  } = useMutation({
    mutationFn: (payload: { name: string; email: string; message: string }) => httpClient.post('/contact', payload),
  });

  useEffect(() => {
    setLoading(isLoading);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return {
    sendEmail,
    isLoading
  };
};
