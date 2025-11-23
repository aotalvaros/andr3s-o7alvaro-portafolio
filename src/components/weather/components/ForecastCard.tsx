"use client"


import { FallbackImage } from "@/components/layout/FallbackImage"
import { formatDate } from "@/services/weather/utils/weatherFormatters"
import { getWeatherIcon } from "@/services/weather/utils/weatherHelpers"
import { ForecastItem } from "@/types/weather.interface"


interface ForecastCardProps {
  forecast: ForecastItem[]
}

export function ForecastCard({ forecast }: ForecastCardProps) {

  return (
    <div
      className="rounded-2xl border border-border bg-gradient-to-br from-background/80 via-background/60 to-background/80 backdrop-blur-xl p-6 shadow-2xl"
    >
      <h3 className="text-xl font-bold mb-6">Pronóstico de 7 días</h3>

      <div className="space-y-2">
        {forecast.map((item) => (
          <div
            key={item.dt}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
          >
            <span className="text-sm font-medium min-w-[80px]">{formatDate(item.dt)}</span>

            <FallbackImage 
              src={getWeatherIcon(item.weather[0].icon)}
              alt={`icon-weather-${item.dt}`}
              className="h-10 w-10 hover:scale-[1.02] transition-transform duration-200"
            />

            <span className="flex-1 text-sm capitalize text-muted-foreground group-hover:text-foreground transition-colors">
              {item.weather[0].description}
            </span>

            <div className="flex items-center gap-2 min-w-[100px] justify-end">
              <span className="text-sm font-medium">{Math.round(item.temp.max)}°</span>
              <span className="text-sm text-muted-foreground">{Math.round(item.temp.min)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
