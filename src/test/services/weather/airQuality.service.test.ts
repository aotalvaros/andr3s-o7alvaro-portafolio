import { getAirQuality } from "@/services/weather";
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('../../../services/weather/constants/weatherConfig', () => ({
  WEATHER_CONFIG: {
    API_KEY: 'test-api-key',
  },
}))

global.fetch = vi.fn()

const fetchMock = global.fetch as Mock

describe('getAirQuality Service', () => {
  const mockApiResponse = {
    list: [
      {
        main: { aqi: 1 },
        components: { co: 200, no: 0, no2: 0, o3: 0, so2: 0, pm2_5: 0, pm10: 0, nh3: 0 },
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call the API with the correct URL and parameters', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    })

    const lat = 6.24
    const lon = -75.57

    await getAirQuality(lat, lon)


    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&lang=es&appid=test-api-key`,
      { next: { revalidate: 3600 } }
    )
  })

  it('should return formatted data correctly when the response is successful', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    })

    const result = await getAirQuality(10, 20)

    expect(result).toEqual({
      aqi: 1,
      components: mockApiResponse.list[0].components,
    })
  })

  it('Should throw an error when the API response is not ok (e.g., 404 or 500)', async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      ok: false, // Simulamos fallo
      status: 500,
      json: async () => ({}),
    })

    await expect(getAirQuality(10, 20)).rejects.toThrow('Failed to fetch air quality data')
  })

  it('should throw an error if fetch fails due to network issues (e.g., no internet)', async () => {
    const networkError = new Error('Network Error')
    fetchMock.mockRejectedValue(networkError)

    await expect(getAirQuality(10, 20)).rejects.toThrow('Network Error')
  })
})