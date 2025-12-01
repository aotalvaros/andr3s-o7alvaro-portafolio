import { WIND_DIRECTIONS } from '../constants/weatherConstants';

export function getWindDirection(deg: number): string {
  const directions = WIND_DIRECTIONS
  const index = Math.round(deg / 45) % 8
  return directions[index]
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("es-ES", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}
