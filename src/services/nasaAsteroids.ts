import { httpClient } from '@/core/infrastructure/http/httpClientFactory';

const BASE_URL = 'https://api.nasa.gov/neo/rest/v1';
const NASA_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY ?? 'DEMO_KEY';

export async function fetchAsteroids(page = 0) {
  const data = await httpClient.get(`${BASE_URL}/neo/browse`, {
    params: {
      page,
      api_key: NASA_KEY,
    },
  });

  return data;
}

export async function fetchAsteroidById(id: string) {
  const data = await httpClient.get(`${BASE_URL}/neo/${id}`, {
    params: {
      api_key: NASA_KEY,
    },
  });

  return data;
}
