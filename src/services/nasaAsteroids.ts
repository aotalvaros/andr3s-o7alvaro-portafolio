import { nasaHttpClient } from '@/core/infrastructure/http/nasaHttpClientFactory';

const NASA_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY ?? 'DEMO_KEY';

export async function fetchAsteroids(page = 0) {
  return nasaHttpClient.get('/neo/rest/v1/neo/browse', {
    params: { page, api_key: NASA_KEY },
    showLoading: false
  });
}

export async function fetchAsteroidById(id: string) {
  return nasaHttpClient.get(`/neo/rest/v1/neo/${id}`, {
    params: { api_key: NASA_KEY },
    showLoading: false
  });
}
