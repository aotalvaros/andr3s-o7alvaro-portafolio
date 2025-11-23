"use client"

import { Card } from "@/components/ui/card"
import { Clock, Droplets } from 'lucide-react'

import { FallbackImage } from "@/components/layout/FallbackImage"
import { HourlyForecast } from "@/types/weather.interface"
import { formatTime } from "@/services/weather/utils/weatherFormatters"
import { getWeatherIcon } from "@/services/weather/utils/weatherHelpers"

interface HourlyForecastProps {
  hourly: HourlyForecast[]
}

export function HourlyForecastComponent({ hourly }: HourlyForecastProps) {
  const next24Hours = hourly.slice(0, 24)

  return (
    <Card className="p-6 bg-gradient-to-br from-background to-muted/30 border-2">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Pronóstico por Hora</h3>
        <span className="text-sm text-muted-foreground ml-auto">Próximas 24 horas</span>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <div className="flex gap-3 pb-2 min-w-max">
          {next24Hours.map((hour) => (
            <div
              key={hour.dt}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors min-w-[80px]"
            >
              <div className="text-sm font-medium">{formatTime(hour.dt)}</div>
                <FallbackImage 
                  src={getWeatherIcon(hour.weather[0].icon)} 
                  alt={`icon-weather-${hour.weather[0].icon}`}
                  className="w-10 h-10"
                  width={40}
                  height={40}
                />
              <div className="text-lg font-bold">{Math.round(hour.temp)}°</div>
              {hour.pop > 0 && (
                <div className="flex items-center gap-1 text-xs text-blue-500">
                  <Droplets className="h-3 w-3" />
                  <span>{Math.round(hour.pop * 100)}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
