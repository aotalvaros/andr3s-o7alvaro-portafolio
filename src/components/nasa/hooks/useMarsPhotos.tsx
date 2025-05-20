import { fetchMarsPhotos } from '@/services/nasa/nasaMars';
import { useQuery } from '@tanstack/react-query';


export function useMarsPhotos(params: Parameters<typeof fetchMarsPhotos>[0]) {
  return useQuery({
    queryKey: ['marsPhotos', params],
    queryFn: () => fetchMarsPhotos(params),
    enabled: !!params.sol || !!params.earth_date,
    refetchOnWindowFocus: false,
  });
}
