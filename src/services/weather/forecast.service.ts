import { ForecastItem } from "@/types/weather.interface"
import { WEATHER_CONFIG } from "./constants/weatherConfig"
import { convertHourlyToDaily } from "./transformers/weatherTransformers"

export async function getForecast(lat: number, lon: number): Promise<ForecastItem[]> {
  const response = await fetch(`${WEATHER_CONFIG.BASE_URL}/forecast/daily?lat=${lat}&lon=${lon}&units=metric&cnt=7&appid=${WEATHER_CONFIG.API_KEY}`, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    // Fallback to hourly forecast and convert to daily
    const hourlyResponse = await fetch(`${WEATHER_CONFIG.BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_CONFIG.API_KEY}`, {
      next: { revalidate: 3600 },
    })

    if (!hourlyResponse.ok) {
      throw new Error("Failed to fetch forecast")
    }

    const hourlyData = await hourlyResponse.json()
    return convertHourlyToDaily(hourlyData.list)
  }

  const data = await response.json()
  return data.list
}