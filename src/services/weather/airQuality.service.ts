import { AirQuality } from "@/types/weather.interface"
import { WEATHER_CONFIG } from "./constants/weatherConfig"

export async function getAirQuality(lat: number, lon: number): Promise<AirQuality> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&lang=es&appid=${WEATHER_CONFIG.API_KEY}`,
    {
      next: { revalidate: 3600 },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch air quality data")
  }

  const data = await response.json()
  return {
    aqi: data.list[0].main.aqi,
    components: data.list[0].components,
  }
}
