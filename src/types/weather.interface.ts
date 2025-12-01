export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface CurrentWeather {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  visibility: number
  wind_speed: number
  wind_deg: number
  clouds: number
  dt: number
  sunrise: number
  sunset: number
  weather: WeatherCondition[]
  name: string
  country: string
}

export interface ForecastItem {
  dt: number
  temp: {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
  }
  feels_like: {
    day: number
    night: number
    eve: number
    morn: number
  }
  pressure: number
  humidity: number
  weather: WeatherCondition[]
  speed: number
  deg: number
  clouds: number
  pop: number
  rain?: number
}

export interface CitySearchResult {
  name: string
  country: string
  state?: string
  lat: number
  lon: number
}

export interface AirQuality {
  aqi: number
  components: {
    co: number
    no: number
    no2: number
    o3: number
    so2: number
    pm2_5: number
    pm10: number
    nh3: number
  }
}

export interface WeatherAlert {
  sender_name: string
  event: string
  start: number
  end: number
  description: string
}

export interface HourlyForecast {
  dt: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  weather: WeatherCondition[]
  pop: number
  wind_speed: number
  wind_deg: number
  uvi: number
}

export interface MinutelyForecast {
  dt: number
  precipitation: number
}

export interface OneCallWeatherData {
  current: {
    dt: number
    sunrise: number
    sunset: number
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    dew_point: number
    uvi: number
    clouds: number
    visibility: number
    wind_speed: number
    wind_deg: number
    weather: WeatherCondition[]
  }
  minutely?: MinutelyForecast[]
  hourly: HourlyForecast[]
  daily: ForecastItem[]
  alerts?: WeatherAlert[]
}