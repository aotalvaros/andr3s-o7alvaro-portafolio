import api from '@/lib/axios';

const NASA_BASE_URL = 'https://api.nasa.gov/planetary/apod';
const NASA_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY ?? 'DEMO_KEY';

export async function fetchNasaPhotoOfTheDay() {
  const { data } = await api.get(NASA_BASE_URL, {
    params: {
      api_key: NASA_KEY,
    },
  });
  return data;
}