import { OneCallWeatherData } from "@/types/weather.interface"
import { WEATHER_CONFIG } from "./constants/weatherConfig"
import { transformOneCallWeather } from "./transformers/weatherTransformers"
import { OpenWeatherCurrentResponse, OpenWeatherForecastResponse } from "./models/weatherApiResponse.interface"

export async function getOneCallWeather(lat: number, lon: number): Promise<OneCallWeatherData> {
  // One Call 3.0 requires paid subscription, so we'll aggregate free APIs
  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${WEATHER_CONFIG.BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=sp&appid=${WEATHER_CONFIG.API_KEY}`),
      fetch(`${WEATHER_CONFIG.BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=sp&appid=${WEATHER_CONFIG.API_KEY}`),
    ])

    if (!currentRes.ok || !forecastRes.ok ) {
      if (currentRes.status === 429 || forecastRes.status === 429) {
        throw new Error("RATE_LIMIT_EXCEEDED")
      }
      throw new Error("Failed to fetch weather data")
    }

    const [currentData, forecastData] = await Promise.all([
      currentRes.json() as Promise<OpenWeatherCurrentResponse>,
      forecastRes.json() as Promise<OpenWeatherForecastResponse>,
    ])

    return transformOneCallWeather(currentData, forecastData)
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
      throw error
    }
    throw new Error("Failed to fetch weather data")
  }
}
