import { CurrentWeather } from "@/types/weather.interface"
import { WEATHER_CONFIG } from "./constants/weatherConfig"

export async function getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  const response = await fetch(`${WEATHER_CONFIG.BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_CONFIG.API_KEY}`, {
    next: { revalidate: 600 },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch current weather")
  }

  const data = await response.json()

  return {
    temp: data.main.temp,
    feels_like: data.main.feels_like,
    temp_min: data.main.temp_min,
    temp_max: data.main.temp_max,
    pressure: data.main.pressure,
    humidity: data.main.humidity,
    visibility: data.visibility,
    wind_speed: data.wind.speed,
    wind_deg: data.wind.deg,
    clouds: data.clouds.all,
    dt: data.dt,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    weather: data.weather,
    name: data.name,
    country: data.sys.country,
  }
}