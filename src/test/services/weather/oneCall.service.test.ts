import { WEATHER_CONFIG } from './../../../services/weather/constants/weatherConfig';
import { getOneCallWeather } from '@/services/weather';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { transformOneCallWeather } from '../../../services/weather/transformers/weatherTransformers';
import { OpenWeatherCurrentResponse, OpenWeatherForecastResponse } from '../../../services/weather/models/weatherApiResponse.interface';
import { OneCallWeatherData } from '../../../types/weather.interface';

vi.mock('../../../services/weather/transformers/weatherTransformers', () => ({
  transformOneCallWeather: vi.fn(),
}))

global.fetch = vi.fn()
const fetchMock = global.fetch as Mock
const transformMock = transformOneCallWeather as Mock

describe('getOneCallWeather', () => {
  const mockLat = 6.2442
  const mockLon = -75.5812

  const mockCurrentResponse: OpenWeatherCurrentResponse = {
    coord: { lon: -75.5812, lat: 6.2442 },
    weather: [{
      id: 800,
      main: 'Clear',
      description: 'cielo claro',
      icon: '01d',
    }],
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
    wind: {
      speed: 3.5,
      deg: 180,
    },
    clouds: {
      all: 20,
    },
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

  const mockForecastResponse: OpenWeatherForecastResponse = {
    cod: '200',
    message: 0,
    cnt: 40,
    list: [
      {
        dt: 1678900000,
        main: {
          temp: 25.5,
          feels_like: 26.0,
          temp_min: 24.0,
          temp_max: 27.0,
          pressure: 1015,
          sea_level: 1015,
          grnd_level: 850,
          humidity: 60,
          temp_kf: 0,
        },
        weather: [{
          id: 800,
          main: 'Clear',
          description: 'cielo claro',
          icon: '01d',
        }],
        clouds: {
          all: 20,
        },
        wind: {
          speed: 3.5,
          deg: 180,
          gust: 5.0,
        },
        visibility: 10000,
        pop: 0.1,
        sys: {
          pod: 'd',
        },
        dt_txt: '2023-03-15 12:00:00',
      },
    ],
    city: {
      id: 3681493,
      name: 'Medellín',
      coord: {
        lat: 6.2442,
        lon: -75.5812,
      },
      country: 'CO',
      population: 2000000,
      timezone: -18000,
      sunrise: 1678870000,
      sunset: 1678910000,
    },
  }

  const mockTransformedData: OneCallWeatherData = {
    current: {
      dt: 1678900000,
      sunrise: 1678870000,
      sunset: 1678910000,
      temp: 25.5,
      feels_like: 26.0,
      pressure: 1015,
      humidity: 60,
      dew_point: 18.5,
      uvi: 5,
      clouds: 20,
      visibility: 10000,
      wind_speed: 3.5,
      wind_deg: 180,
      weather: [{
        id: 800,
        main: 'Clear',
        description: 'cielo claro',
        icon: '01d',
      }],
    },
    hourly: [],
    daily: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Successful weather data fetch', () => {
    it('should fetch and transform weather data successfully', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockCurrentResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockForecastResponse,
        })

      transformMock.mockReturnValue(mockTransformedData)

      const result = await getOneCallWeather(mockLat, mockLon)

      expect(result).toEqual(mockTransformedData)
      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(transformMock).toHaveBeenCalledWith(
        mockCurrentResponse,
        mockForecastResponse
      )
    })

    it('should call both APIs in parallel', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCurrentResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })

      transformMock.mockReturnValue(mockTransformedData)

      await getOneCallWeather(mockLat, mockLon)

      expect(fetchMock).toHaveBeenCalledTimes(2)
      
      // Both should be called with correct URLs
      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        `${WEATHER_CONFIG.BASE_URL}/weather?lat=${mockLat}&lon=${mockLon}&units=metric&lang=sp&appid=${WEATHER_CONFIG.API_KEY}`
      )
      
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        `${WEATHER_CONFIG.BASE_URL}/forecast?lat=${mockLat}&lon=${mockLon}&units=metric&lang=sp&appid=${WEATHER_CONFIG.API_KEY}`
      )
    })

    it('should use metric units', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      })

      transformMock.mockReturnValue(mockTransformedData)

      await getOneCallWeather(mockLat, mockLon)

      const calls = fetchMock.mock.calls
      calls.forEach((call: any) => {
        expect(call[0]).toContain('units=metric')
      })
    })

    it('should use Spanish language', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      })

      transformMock.mockReturnValue(mockTransformedData)

      await getOneCallWeather(mockLat, mockLon)

      const calls = fetchMock.mock.calls
      calls.forEach((call: any) => {
        expect(call[0]).toContain('lang=sp')
      })
    })

    it('should handle different coordinate values', async () => {
      const testCoords = [
        { lat: 0, lon: 0 },
        { lat: 90, lon: 180 },
        { lat: -90, lon: -180 },
        { lat: 45.5678, lon: -123.4567 },
      ]

      for (const coords of testCoords) {
        fetchMock.mockResolvedValue({
          ok: true,
          json: async () => ({}),
        })

        transformMock.mockReturnValue(mockTransformedData)

        await getOneCallWeather(coords.lat, coords.lon)

        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining(`lat=${coords.lat}&lon=${coords.lon}`),
        )

        vi.clearAllMocks()
      }
    })
  })

  describe('Rate limiting', () => {
    it('should throw RATE_LIMIT_EXCEEDED when current API returns 429', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'RATE_LIMIT_EXCEEDED'
      )
    })

    it('should throw RATE_LIMIT_EXCEEDED when forecast API returns 429', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCurrentResponse,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
        })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'RATE_LIMIT_EXCEEDED'
      )
    })

    it('should throw RATE_LIMIT_EXCEEDED when both APIs return 429', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 429,
      })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'RATE_LIMIT_EXCEEDED'
      )
    })

    it('should preserve RATE_LIMIT_EXCEEDED error through catch block', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 429,
      })

      try {
        await getOneCallWeather(mockLat, mockLon)
        expect.fail('Should have thrown RATE_LIMIT_EXCEEDED')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('RATE_LIMIT_EXCEEDED')
      }
    })
  })

  describe('Error handling - Current API failures', () => {
    it('should throw error when current API fails with 404', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })

    it('should throw error when current API fails with 401', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })

    it('should throw error when current API fails with 500', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })
  })

  describe('Error handling - Forecast API failures', () => {
    it('should throw error when forecast API fails with 404', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCurrentResponse,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })

    it('should throw error when forecast API fails with 401', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCurrentResponse,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })

    it('should throw error when forecast API fails with 500', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCurrentResponse,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
        })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })
  })

  describe('Error handling - Both APIs fail', () => {
    it('should throw error when both APIs fail', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
      })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })

    it('should throw error when both APIs return 404', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
      })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })
  })

  describe('Error handling - Network errors', () => {
    it('should handle network error on current API', async () => {
      fetchMock
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })

    it('should handle network error on forecast API', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCurrentResponse,
        })
        .mockRejectedValueOnce(new Error('Network error'))

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })

    it('should handle network errors on both APIs', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'))

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })

    it('should handle timeout errors', async () => {
      fetchMock.mockRejectedValue(new Error('Request timeout'))

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })

    it('should handle DNS resolution errors', async () => {
      fetchMock.mockRejectedValue(new Error('DNS resolution failed'))

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })
  })

  describe('Error handling - JSON parsing', () => {
    it('should handle JSON parsing error on current API', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error('Invalid JSON')
          },
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })

    it('should handle JSON parsing error on forecast API', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCurrentResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error('Invalid JSON')
          },
        })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })

    it('should handle malformed JSON response', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new SyntaxError('Unexpected token')
          },
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })
  })

  describe('Data transformation', () => {
    it('should call transformOneCallWeather with correct data', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCurrentResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })

      transformMock.mockReturnValue(mockTransformedData)

      await getOneCallWeather(mockLat, mockLon)

      expect(transformMock).toHaveBeenCalledTimes(1)
      expect(transformMock).toHaveBeenCalledWith(
        mockCurrentResponse,
        mockForecastResponse
      )
    })

    it('should return transformed data structure', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      })

      const customTransformedData: OneCallWeatherData = {
        current: {
          dt: 123456,
          temp: 30,
          sunrise: 111111,
          sunset: 222222,
          feels_like: 31,
          pressure: 1010,
          humidity: 50,
          dew_point: 15,
          uvi: 7,
          clouds: 30,
          visibility: 9000,
          wind_speed: 4.5,
          wind_deg: 200,
          weather: [],
        },
        hourly: [],
        daily: [],
      }

      transformMock.mockReturnValue(customTransformedData)

      const result = await getOneCallWeather(mockLat, mockLon)

      expect(result).toEqual(customTransformedData)
    })

    it('should handle transformation errors', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      })

      transformMock.mockImplementation(() => {
        throw new Error('Transformation failed')
      })

      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })
  })

  describe('Promise.all behavior', () => {
    it('should wait for both API calls to complete', async () => {
      let currentResolved = false
      let forecastResolved = false

      fetchMock
        .mockImplementationOnce(async () => {
          await new Promise(resolve => setTimeout(resolve, 50))
          currentResolved = true
          return {
            ok: true,
            json: async () => mockCurrentResponse,
          }
        })
        .mockImplementationOnce(async () => {
          await new Promise(resolve => setTimeout(resolve, 100))
          forecastResolved = true
          return {
            ok: true,
            json: async () => mockForecastResponse,
          }
        })

      transformMock.mockReturnValue(mockTransformedData)

      await getOneCallWeather(mockLat, mockLon)

      expect(currentResolved).toBe(true)
      expect(forecastResolved).toBe(true)
    })

    it('should fail fast if any request fails', async () => {
      fetchMock
        .mockImplementationOnce(async () => {
          await new Promise(resolve => setTimeout(resolve, 100))
          return {
            ok: false,
            status: 500,
          }
        })
        .mockImplementationOnce(async () => {
          await new Promise(resolve => setTimeout(resolve, 200))
          return {
            ok: true,
            json: async () => mockForecastResponse,
          }
        })

      const start = Date.now()
      
      await expect(getOneCallWeather(mockLat, mockLon)).rejects.toThrow()
      
      const duration = Date.now() - start
      
      // Should fail after first Promise.all completes (both requests)
      // Not wait for the second one to complete individually
      expect(duration).toBeLessThan(300)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty response objects', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      })

      transformMock.mockReturnValue(mockTransformedData)

      const result = await getOneCallWeather(mockLat, mockLon)

      expect(result).toEqual(mockTransformedData)
    })

    it('should handle response with null values', async () => {
      const responseWithNulls = {
        ...mockCurrentResponse,
        visibility: null,
        wind: {
          speed: null,
          deg: null,
        },
      }

      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => responseWithNulls,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })

      transformMock.mockReturnValue(mockTransformedData)

      const result = await getOneCallWeather(mockLat, mockLon)

      expect(result).toBeDefined()
    })

    it('should handle very precise decimal coordinates', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      })

      transformMock.mockReturnValue(mockTransformedData)

      await getOneCallWeather(6.24420123456789, -75.58120987654321)

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('lat=6.24420123456789&lon=-75.58120987654321'),
      )
    })

    it('should handle extreme coordinate values', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      })

      transformMock.mockReturnValue(mockTransformedData)

      await getOneCallWeather(90, 180)

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('lat=90&lon=180'),
      )
    })
  })

  describe('Multiple calls', () => {
    it('should handle multiple sequential calls', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      })

      transformMock.mockReturnValue(mockTransformedData)

      await getOneCallWeather(10, 20)
      await getOneCallWeather(30, 40)
      await getOneCallWeather(50, 60)

      expect(fetchMock).toHaveBeenCalledTimes(6) // 2 calls per getOneCallWeather
    })

    it('should handle concurrent calls', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      })

      transformMock.mockReturnValue(mockTransformedData)

      const promises = [
        getOneCallWeather(10, 20),
        getOneCallWeather(30, 40),
        getOneCallWeather(50, 60),
      ]

      const results = await Promise.all(promises)

      expect(results).toHaveLength(3)
      expect(fetchMock).toHaveBeenCalledTimes(6)
    })

    it('should handle mixed success and failure', async () => {
      fetchMock
        // First call - success
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCurrentResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })
        // Second call - failure
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })

      transformMock.mockReturnValue(mockTransformedData)

      const result1 = await getOneCallWeather(10, 20)
      expect(result1).toEqual(mockTransformedData)

      await expect(getOneCallWeather(30, 40)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })
  })
})