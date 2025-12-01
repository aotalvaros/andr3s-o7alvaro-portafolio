
import { AlertCircle, ExternalLink } from 'lucide-react'
import { Card } from "@/components/ui/card"

export function APILimitWarning() {
  return (
    <div className="mb-6">
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-2 border-yellow-300 dark:border-yellow-900">
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-full bg-yellow-500/20 flex-shrink-0"
          >
            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" data-testid="alert-circle-icon"/>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-300 mb-2">
              Límite de API Alcanzado
            </h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-3">
              Este módulo utiliza la API gratuita de OpenWeatherMap, que tiene un límite de 1,000 llamadas por día. 
              El límite ha sido alcanzado temporalmente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="text-xs text-yellow-700 dark:text-yellow-300 p-3 rounded-lg bg-yellow-500/10">
                <strong>💡 Tip:</strong> El límite se restablece cada 24 horas. Vuelve más tarde para continuar explorando el clima.
              </div>
              <a
                href="https://openweathermap.org/price"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium transition-colors"
                data-testid="openweathermap-plans-link"
              >
                Ver planes de OpenWeatherMap
                <ExternalLink className="h-4 w-4" data-testid="external-link-icon"/>
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
