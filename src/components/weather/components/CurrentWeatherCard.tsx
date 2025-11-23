'use client'

import { Wind, Droplets, Eye, Gauge, Sunrise, Sunset, MapPin } from "lucide-react"
import { WeatherDetail } from "./WeatherDetail";
import { FallbackImage } from "@/components/layout/FallbackImage";
import { CurrentWeather } from "@/types/weather.interface";
import { getWeatherIcon } from "@/services/weather/utils/weatherHelpers";
import { formatTime, getWindDirection } from "@/services/weather/utils/weatherFormatters";

interface CurrentWeatherCardProps {
  weather: CurrentWeather
}

export function CurrentWeatherCard({ weather }: Readonly<CurrentWeatherCardProps>) {
  const weatherCondition = weather.weather[0]

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background/80 via-background/60 to-background/80 backdrop-blur-xl p-6 shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">{weather.name}</h2>
              <p className="text-sm text-muted-foreground">{weather.country}</p>
            </div>
          </div>

           <FallbackImage
              src={getWeatherIcon(weatherCondition.icon)}
              alt='Weather Icon'
              className="h-20 w-20"
            />
        </div>

        <div className="flex items-end gap-2 mb-2">
          <span className="text-6xl font-bold">
            {Math.round(weather.temp)}°
          </span>
          <span className="text-2xl text-muted-foreground mb-2">C</span>
        </div>

        <p className="text-lg capitalize mb-1">{weatherCondition.description}</p>
        <p className="text-sm text-muted-foreground mb-6">Sensación térmica: {Math.round(weather.feels_like)}°C</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <WeatherDetail
            icon={<Wind className="h-4 w-4" />}
            label="Viento"
            value={`${weather.wind_speed} m/s ${getWindDirection(weather.wind_deg)}`}
          />
          <WeatherDetail icon={<Droplets className="h-4 w-4" />} label="Humedad" value={`${weather.humidity}%`} />
          <WeatherDetail
            icon={<Eye className="h-4 w-4" />}
            label="Visibilidad"
            value={`${(weather.visibility / 1000).toFixed(1)} km`}
          />
          <WeatherDetail icon={<Gauge className="h-4 w-4" />} label="Presión" value={`${weather.pressure} hPa`} />
          <WeatherDetail icon={<Sunrise className="h-4 w-4" />} label="Amanecer" value={formatTime(weather.sunrise)} />
          <WeatherDetail icon={<Sunset className="h-4 w-4" />} label="Atardecer" value={formatTime(weather.sunset)} />
        </div>
      </div>
    </div>
  )
}