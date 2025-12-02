import { FallbackImage } from "@/components/layout/FallbackImage";
import { formatDate } from "@/services/weather/utils/weatherFormatters";
import { getWeatherIcon } from "@/services/weather/utils/weatherHelpers";
import { ForecastItem } from "@/types/weather.interface";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ForecastCardProps {
  forecast: ForecastItem[];
}

export function ForecastCard({ forecast }: ForecastCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-background/80 via-background/60 to-background/80 backdrop-blur-xl p-6 shadow-2xl">
      <h3 className="text-xl font-bold mb-6">Pronóstico de 7 días</h3>

      <div className="space-y-2">
        {forecast.map((item) => (
          <div
            key={item.dt}
            className="grid grid-cols-5 items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors"
          >
            {/* Fecha */}
            <span className="col-span-2 sm:col-span-1 text-sm font-medium">
              {formatDate(item.dt)}
            </span>

            {/* Icono + descripción */}
            <div className="col-span-3 flex items-center gap-3">
              <FallbackImage
                src={getWeatherIcon(item.weather[0].icon)}
                alt={`icon-weather-${item.dt}`}
                className="h-8 w-8"
              />
              <span className="text-sm capitalize text-muted-foreground">
                {item.weather[0].description}
              </span>
            </div>

            {/* Max Min */}
            <div className="col-span-3 sm:col-span-1 flex items-center gap-3 min-w-[120px] justify-end">
              <div className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3 text-red-400" />
                <span className="text-sm font-medium">
                  {Math.round(item.temp.max)}°
                </span>
              </div>

              <div className="flex items-center gap-1">
                <ArrowDown className="h-3 w-3 text-blue-400" />
                <span className="text-sm text-muted-foreground">
                  {Math.round(item.temp.min)}°
                </span>
              </div>
            </div>
            <div className="col-span-5 border-t border-border mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
