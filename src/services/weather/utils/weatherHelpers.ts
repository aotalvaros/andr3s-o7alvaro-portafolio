import { WEATHER_ICONS_BASE_URL } from "../constants/weatherConstants";

export function getWeatherIcon(iconCode: string): string {
  return `${WEATHER_ICONS_BASE_URL}/${iconCode}@2x.png`
}

export function getAQILevel(aqi: number): { label: string; color: string; description: string } {
  switch (aqi) {
    case 1:
      return { label: "Buena", color: "text-green-500", description: "Calidad del aire ideal" }
    case 2:
      return { label: "Regular", color: "text-yellow-500", description: "Calidad aceptable" }
    case 3:
      return { label: "Moderada", color: "text-orange-500", description: "Grupos sensibles pueden verse afectados" }
    case 4:
      return { label: "Mala", color: "text-red-500", description: "Puede afectar a la salud general" }
    case 5:
      return { label: "Muy Mala", color: "text-purple-500", description: "Alerta de salud, evita actividades al aire libre" }
    default:
      return { label: "Desconocida", color: "text-muted-foreground", description: "Sin datos" }
  }
}


export function getMoonPhase(phase: number): { name: string; emoji: string } {
  if (phase === 0 || phase === 1) return { name: "Luna Nueva", emoji: "🌑" }
  if (phase < 0.25) return { name: "Luna Creciente", emoji: "🌒" }
  if (phase === 0.25) return { name: "Cuarto Creciente", emoji: "🌓" }
  if (phase < 0.5) return { name: "Creciente Gibosa", emoji: "🌔" }
  if (phase === 0.5) return { name: "Luna Llena", emoji: "🌕" }
  if (phase < 0.75) return { name: "Menguante Gibosa", emoji: "🌖" }
  if (phase === 0.75) return { name: "Cuarto Menguante", emoji: "🌗" }
  return { name: "Luna Menguante", emoji: "🌘" }
}