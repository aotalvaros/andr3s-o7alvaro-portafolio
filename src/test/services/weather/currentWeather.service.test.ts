import { getCurrentWeather } from "@/services/weather";
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';


vi.mock('./constants/weatherConfig', () => ({
  WEATHER_CONFIG: {
    BASE_URL: 'https://api.mock.com',
    API_KEY: 'test-api-key-123',
  },
}))

global.fetch = vi.fn()
const fetchMock = global.fetch as Mock

describe('getCurrentWeather Service', () => {
  const mockApiSuccessResponse = {
    coord: { lon: -75.57, lat: 6.24 },
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    base: 'stations',
    main: {
      temp: 25.5,
      feels_like: 26.0,
      temp_min: 24.0,
      temp_max: 27.0,
      pressure: 1015,
      humidity: 60,
    },
    visibility: 10000,
    wind: { speed: 3.5, deg: 90 },
    clouds: { all: 20 },
    dt: 1678900000,
    sys: {
      type: 1,
      id: 8590,
      country: 'CO',
      sunrise: 1678870000,
      sunset: 1678910000,
    },
    timezone: -18000,
    id: 3681493,
    name: 'Medellín',
    cod: 200,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should construct the correct URL and pass revalidation options', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockApiSuccessResponse,
    })
    const lat = 6.24
    const lon = -75.57

    await getCurrentWeather(lat, lon)

    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.openweathermap.org/data/2.5/weather?lat=6.24&lon=-75.57&units=metric&appid=demo`,
      { next: { revalidate: 600 } }
    )
  })

  it('should correctly map the complex API response to the CurrentWeather interface', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockApiSuccessResponse,
    })

    const result = await getCurrentWeather(6.24, -75.57)

    expect(result).toEqual({
      temp: mockApiSuccessResponse.main.temp,
      feels_like: mockApiSuccessResponse.main.feels_like,
      temp_min: mockApiSuccessResponse.main.temp_min,
      temp_max: mockApiSuccessResponse.main.temp_max,
      pressure: mockApiSuccessResponse.main.pressure,
      humidity: mockApiSuccessResponse.main.humidity,
      visibility: mockApiSuccessResponse.visibility,
      wind_speed: mockApiSuccessResponse.wind.speed,
      wind_deg: mockApiSuccessResponse.wind.deg,
      clouds: mockApiSuccessResponse.clouds.all, // Critical check: nested property
      dt: mockApiSuccessResponse.dt,
      sunrise: mockApiSuccessResponse.sys.sunrise, // Critical check: nested property
      sunset: mockApiSuccessResponse.sys.sunset,
      weather: mockApiSuccessResponse.weather,
      name: mockApiSuccessResponse.name,
      country: mockApiSuccessResponse.sys.country,
    })
  })

  it('should throw a specific error if the API responds with a non-ok status', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ message: 'city not found' }),
    })

    await expect(getCurrentWeather(0, 0)).rejects.toThrow('Failed to fetch current weather')
  })

  it('should propagate network errors if fetch fails', async () => {
    const networkError = new Error('Network Error / API Down')
    fetchMock.mockRejectedValue(networkError)

    await expect(getCurrentWeather(0, 0)).rejects.toThrow('Network Error / API Down')
  })
})