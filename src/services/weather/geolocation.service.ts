import { CitySearchResult } from "@/types/weather.interface";
import { WEATHER_CONFIG } from "./constants/weatherConfig";

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (query.length < 2) return []

  const response = await fetch(`${WEATHER_CONFIG.GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${WEATHER_CONFIG.API_KEY}`)

  if (!response.ok) {
    throw new Error("Failed to search cities")
  }

  return response.json()
}

export async function getUserLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
    )
  })
}
