import api from "@/lib/axios";
import { MarsPhotosResponse } from "./models/marsPhotosResponse.interface";

interface FetchMarsPhotosParams {
    rover: 'curiosity' | 'opportunity' | 'spirit';
    sol?: number;
    earth_date?: string;
    camera?: string;
    page?: number;
}

export async function fetchMarsPhotos({ rover, sol, earth_date, camera, page = 1}: FetchMarsPhotosParams) : Promise<MarsPhotosResponse[]> {

    if (!sol && !earth_date) throw new Error('Debes proporcionar `sol` o `earth_date`');

    const params: Record<string, string> = {
        api_key: process.env.NEXT_PUBLIC_NASA_API_KEY ?? 'DEMO_KEY',
        page: page.toString(),
    };

    if (sol !== undefined) params.sol = sol.toString();
    if (earth_date) params.earth_date = earth_date;
    if (camera) params.camera = camera;

  const { data } = await api.get(`/mars-photos/api/v1/rovers/${rover}/photos`, {
    baseURL: 'https://api.nasa.gov',
    params,
  });

  return data.photos;
} 