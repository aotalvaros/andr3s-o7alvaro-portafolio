
import { Wind, AlertTriangle } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { AirQuality } from '@/types/weather.interface'
import { getAQILevel } from '@/services/weather/utils/weatherHelpers'


interface AirQualityCardProps {
  airQuality: AirQuality
}

export function AirQualityCard({ airQuality }: AirQualityCardProps) {
  const aqiInfo = getAQILevel(airQuality.aqi)

  const pollutants = [
    { name: "PM2.5", value: airQuality.components.pm2_5, unit: "μg/m³", description: "Partículas finas" },
    { name: "PM10", value: airQuality.components.pm10, unit: "μg/m³", description: "Partículas gruesas" },
    { name: "O₃", value: airQuality.components.o3, unit: "μg/m³", description: "Ozono" },
    { name: "NO₂", value: airQuality.components.no2, unit: "μg/m³", description: "Dióxido de nitrógeno" },
    { name: "SO₂", value: airQuality.components.so2, unit: "μg/m³", description: "Dióxido de azufre" },
    { name: "CO", value: airQuality.components.co, unit: "μg/m³", description: "Monóxido de carbono" },
  ]

  return (
    <Card className="p-6 bg-gradient-to-br from-background to-muted/30 border-2">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wind className="h-5 w-5 text-primary" data-testid="wind-icon" />
            <h3 className="text-lg font-semibold">Calidad del Aire</h3>
          </div>
          <p className="text-sm text-muted-foreground">{aqiInfo.description}</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${aqiInfo.color}`}>{aqiInfo.label}</div>
          <div className="text-sm text-muted-foreground">ICA: {airQuality.aqi}/5</div>
        </div>
      </div>

      {airQuality.aqi >= 3 && (
        <div
          className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-start gap-2"
        >
          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" data-testid="alert-triangle-icon" />
          <p className="text-xs text-orange-700 dark:text-orange-300">
            Grupos sensibles deberían limitar actividades prolongadas al aire libre
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {pollutants.map((pollutant) => (
          <div
            key={pollutant.name}
            className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="text-xs text-muted-foreground mb-1" data-testid={`pollutant-description-${pollutant.name}`}>{pollutant.description}</div>
            <div className="font-semibold" data-testid={`pollutant-name-${pollutant.name}`}>{pollutant.name}</div>
            <div className="text-sm text-primary" data-testid={`pollutant-value-${pollutant.name}`}>
              {pollutant.value.toFixed(1)} {pollutant.unit}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
