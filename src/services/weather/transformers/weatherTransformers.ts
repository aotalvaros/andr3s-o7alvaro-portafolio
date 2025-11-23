/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForecastItem, HourlyForecast, CurrentWeather, OneCallWeatherData } from "@/types/weather.interface"
import { OpenWeatherCurrentResponse, OpenWeatherForecastResponse } from "../models/weatherApiResponse.interface"


export function transformCurrentWeather(data: OpenWeatherCurrentResponse): CurrentWeather {
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

export function convertHourlyToDaily(hourlyData: any[]): ForecastItem[] {
  const dailyMap = new Map<string, any[]>()

  hourlyData.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString()
    if (!dailyMap.has(date)) {
      dailyMap.set(date, [])
    }
    dailyMap.get(date)?.push(item)
  })

  return Array.from(dailyMap.entries())
    .slice(0, 7)
    .map(([, items]) => {
      const temps = items.map((i) => i.main.temp)
      const firstItem = items[0]

      return {
        dt: firstItem.dt,
        temp: {
          day: temps.reduce((a, b) => a + b, 0) / temps.length,
          min: Math.min(...temps),
          max: Math.max(...temps),
          night: temps[temps.length - 1] || temps[0],
          eve: temps[Math.floor(temps.length * 0.75)] || temps[0],
          morn: temps[0],
        },
        feels_like: {
          day: firstItem.main.feels_like,
          night: firstItem.main.feels_like,
          eve: firstItem.main.feels_like,
          morn: firstItem.main.feels_like,
        },
        pressure: firstItem.main.pressure,
        humidity: firstItem.main.humidity,
        weather: firstItem.weather,
        speed: firstItem.wind.speed,
        deg: firstItem.wind.deg,
        clouds: firstItem.clouds.all,
        pop: firstItem.pop || 0,
        rain: firstItem.rain?.["3h"],
      }
    })
}

export function transformHourlyForecast(forecastData: OpenWeatherForecastResponse): HourlyForecast[] {
  return forecastData.list.slice(0, 8).map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    feels_like: item.main.feels_like,
    pressure: item.main.pressure,
    humidity: item.main.humidity,
    weather: item.weather,
    pop: item.pop || 0,
    wind_speed: item.wind.speed,
    wind_deg: item.wind.deg,
    uvi: 0, // Not available in free tier
  }))
}

export function transformOneCallWeather(
  currentData: OpenWeatherCurrentResponse,
  forecastData: OpenWeatherForecastResponse
): OneCallWeatherData {
  const dailyForecast = convertHourlyToDaily(forecastData.list)
  const hourly = transformHourlyForecast(forecastData)

  return {
    current: {
      dt: currentData.dt,
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset,
      temp: currentData.main.temp,
      feels_like: currentData.main.feels_like,
      pressure: currentData.main.pressure,
      humidity: currentData.main.humidity,
      dew_point: currentData.main.temp - (100 - currentData.main.humidity) / 5,
      uvi: 0,
      clouds: currentData.clouds.all,
      visibility: currentData.visibility,
      wind_speed: currentData.wind.speed,
      wind_deg: currentData.wind.deg,
      weather: currentData.weather,
    },
    hourly,
    daily: dailyForecast,
  }
}