import { getForecast } from "@/services/weather";
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('./constants/weatherConfig', () => ({
  WEATHER_CONFIG: {
    BASE_URL: 'https://api.mock.com',
    API_KEY: 'test-key',
  },
}))

vi.mock('./transformers/weatherTransformers', () => ({
  convertHourlyToDaily: vi.fn(),
}))

global.fetch = vi.fn()
const fetchMock = global.fetch as Mock

// const convertMock = convertHourlyToDaily as Mock

describe('getForecast Service', () => {

    const mockDailyData = [{
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
    }]


  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return daily forecast directly if the primary API call succeeds', async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ list: mockDailyData }),
    })

    const lat = 10
    const lon = 20
    const result = await getForecast(lat, lon)


    expect(result).toEqual(mockDailyData)
    
    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.openweathermap.org/data/2.5/forecast/daily?lat=10&lon=20&units=metric&cnt=7&appid=demo`,
      { next: { revalidate: 3600 } }
    )
  })

})