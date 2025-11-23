export const WEATHER_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "demo",
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  GEO_URL: "https://api.openweathermap.org/geo/1.0",
  CACHE_TIME: {
    CURRENT: 600,
    FORECAST: 3600,
    AIR_QUALITY: 3600
  }
}
