import { WEATHER_CONFIG } from './../../../services/weather/constants/weatherConfig';
import { getForecast } from "@/services/weather";
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { convertHourlyToDaily } from '../../../services/weather/transformers/weatherTransformers';

vi.mock('../../../services/weather/transformers/weatherTransformers', () => ({
  convertHourlyToDaily: vi.fn(),
}))

global.fetch = vi.fn()
const fetchMock = global.fetch as Mock
const convertMock = convertHourlyToDaily as Mock

describe('getForecast', () => {
  const mockLat = 6.2442
  const mockLon = -75.5812

  const mockDailyForecast = [
    {
      dt: 1678900000,
      temp: {
        day: 25.5,
        min: 20.0,
        max: 28.0,
        night: 22.0,
        eve: 26.0,
        morn: 21.0,
      },
      feels_like: {
        day: 26.0,
        night: 22.5,
        eve: 26.5,
        morn: 21.5,
      },
      pressure: 1015,
      humidity: 65,
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      speed: 3.5,
      deg: 180,
      clouds: 20,
      pop: 0.1,
    },
    {
      dt: 1678986400,
      temp: {
        day: 24.0,
        min: 19.0,
        max: 27.0,
        night: 21.0,
        eve: 25.0,
        morn: 20.0,
      },
      feels_like: {
        day: 24.5,
        night: 21.5,
        eve: 25.5,
        morn: 20.5,
      },
      pressure: 1013,
      humidity: 70,
      weather: [
        {
          id: 801,
          main: 'Clouds',
          description: 'few clouds',
          icon: '02d',
        },
      ],
      speed: 2.8,
      deg: 190,
      clouds: 25,
      pop: 0.2,
    },
  ]

  const mockHourlyForecast = [
    {
      dt: 1678900000,
      main: {
        temp: 25.5,
        feels_like: 26.0,
        temp_min: 24.0,
        temp_max: 27.0,
        pressure: 1015,
        humidity: 60,
      },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      wind: { speed: 3.5, deg: 180 },
      clouds: { all: 20 },
      pop: 0.1,
    },
    {
      dt: 1678910800,
      main: {
        temp: 24.0,
        feels_like: 24.5,
        temp_min: 23.0,
        temp_max: 25.0,
        pressure: 1014,
        humidity: 65,
      },
      weather: [
        {
          id: 801,
          main: 'Clouds',
          description: 'few clouds',
          icon: '02d',
        },
      ],
      wind: { speed: 3.0, deg: 185 },
      clouds: { all: 25 },
      pop: 0.15,
    },
  ]

  const mockConvertedDailyForecast = [
    {
      dt: 1678900000,
      temp: {
        day: 24.75,
        min: 23.0,
        max: 27.0,
        night: 24.0,
        eve: 25.5,
        morn: 25.5,
      },
      feels_like: {
        day: 25.25,
        night: 24.5,
        eve: 26.0,
        morn: 26.0,
      },
      pressure: 1014.5,
      humidity: 62.5,
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      speed: 3.25,
      deg: 182.5,
      clouds: 22.5,
      pop: 0.125,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Successful daily forecast', () => {
    it('should return daily forecast when primary API call succeeds', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ list: mockDailyForecast }),
      })

      const result = await getForecast(mockLat, mockLon)

      expect(result).toEqual(mockDailyForecast)
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(
        `${WEATHER_CONFIG.BASE_URL}/forecast/daily?lat=${mockLat}&lon=${mockLon}&units=metric&cnt=7&appid=${WEATHER_CONFIG.API_KEY}`,
        { next: { revalidate: 3600 } }
      )
    })

    it('should handle empty daily forecast list', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ list: [] }),
      })

      const result = await getForecast(mockLat, mockLon)

      expect(result).toEqual([])
    })

    it('should handle different coordinate formats', async () => {
      const testCases = [
        { lat: 0, lon: 0 },
        { lat: -90, lon: -180 },
        { lat: 90, lon: 180 },
        { lat: 45.5678, lon: -123.4567 },
      ]

      for (const coords of testCases) {
        fetchMock.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ list: mockDailyForecast }),
        })

        await getForecast(coords.lat, coords.lon)

        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining(`lat=${coords.lat}&lon=${coords.lon}`),
          expect.any(Object)
        )
      }
    })
  })

  describe('Fallback to hourly forecast', () => {
    it('should fallback to hourly forecast when daily API fails', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ list: mockHourlyForecast }),
        })

      convertMock.mockReturnValue(mockConvertedDailyForecast)

      const result = await getForecast(mockLat, mockLon)

      expect(result).toEqual(mockConvertedDailyForecast)
      expect(fetchMock).toHaveBeenCalledTimes(2)

      // First call - daily forecast
      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        `${WEATHER_CONFIG.BASE_URL}/forecast/daily?lat=${mockLat}&lon=${mockLon}&units=metric&cnt=7&appid=${WEATHER_CONFIG.API_KEY}`,
        { next: { revalidate: 3600 } }
      )

      // Second call - hourly forecast
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        `${WEATHER_CONFIG.BASE_URL}/forecast?lat=${mockLat}&lon=${mockLon}&units=metric&appid=${WEATHER_CONFIG.API_KEY}`,
        { next: { revalidate: 3600 } }
      )

      expect(convertMock).toHaveBeenCalledWith(mockHourlyForecast)
    })

    it('should handle different HTTP error statuses for daily API', async () => {
      const errorStatuses = [400, 401, 403, 404, 500, 502, 503]

      for (const status of errorStatuses) {
        fetchMock
          .mockResolvedValueOnce({
            ok: false,
            status,
          })
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ list: mockHourlyForecast }),
          })

        convertMock.mockReturnValue(mockConvertedDailyForecast)

        const result = await getForecast(mockLat, mockLon)

        expect(result).toEqual(mockConvertedDailyForecast)

        vi.clearAllMocks()
      }
    })

    it('should call convertHourlyToDaily with correct data structure', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ list: mockHourlyForecast }),
        })

      convertMock.mockReturnValue(mockConvertedDailyForecast)

      await getForecast(mockLat, mockLon)

      expect(convertMock).toHaveBeenCalledTimes(1)
      expect(convertMock).toHaveBeenCalledWith(mockHourlyForecast)
    })
  })

  describe('Error handling', () => {
    it('should throw error when both daily and hourly APIs fail', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
        })

      await expect(getForecast(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch forecast'
      )

      expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('should throw error when daily API fails and hourly API returns 401', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        })

      await expect(getForecast(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch forecast'
      )
    })

    it('should throw error when daily API fails and hourly API returns 403', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 403,
        })

      await expect(getForecast(mockLat, mockLon)).rejects.toThrow(
        'Failed to fetch forecast'
      )
    })

    it('should handle network errors on daily API', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      await expect(getForecast(mockLat, mockLon)).rejects.toThrow('Network error')
    })

    it('should handle network errors on hourly API after daily fails', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockRejectedValueOnce(new Error('Network timeout'))

      await expect(getForecast(mockLat, mockLon)).rejects.toThrow('Network timeout')
    })

    it('should handle JSON parsing errors on daily API', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(getForecast(mockLat, mockLon)).rejects.toThrow('Invalid JSON')
    })

    it('should handle JSON parsing errors on hourly API', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error('Invalid JSON in hourly')
          },
        })

      await expect(getForecast(mockLat, mockLon)).rejects.toThrow(
        'Invalid JSON in hourly'
      )
    })
  })

  describe('Cache configuration', () => {
    it('should use correct revalidate time for daily API', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ list: mockDailyForecast }),
      })

      await getForecast(mockLat, mockLon)

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: { revalidate: 3600 },
        })
      )
    })

    it('should use correct revalidate time for hourly API fallback', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ list: mockHourlyForecast }),
        })

      convertMock.mockReturnValue(mockConvertedDailyForecast)

      await getForecast(mockLat, mockLon)

      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        expect.any(String),
        expect.objectContaining({
          next: { revalidate: 3600 },
        })
      )
    })
  })

  describe('API URL construction', () => {
    it('should construct correct daily forecast URL', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ list: mockDailyForecast }),
      })

      await getForecast(mockLat, mockLon)

      const expectedUrl = `${WEATHER_CONFIG.BASE_URL}/forecast/daily?lat=${mockLat}&lon=${mockLon}&units=metric&cnt=7&appid=${WEATHER_CONFIG.API_KEY}`

      expect(fetchMock).toHaveBeenCalledWith(expectedUrl, expect.any(Object))
    })

    it('should construct correct hourly forecast URL', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ list: mockHourlyForecast }),
        })

      convertMock.mockReturnValue(mockConvertedDailyForecast)

      await getForecast(mockLat, mockLon)

      const expectedUrl = `${WEATHER_CONFIG.BASE_URL}/forecast?lat=${mockLat}&lon=${mockLon}&units=metric&appid=${WEATHER_CONFIG.API_KEY}`

      expect(fetchMock).toHaveBeenNthCalledWith(2, expectedUrl, expect.any(Object))
    })

    it('should include all required query parameters for daily API', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ list: mockDailyForecast }),
      })

      await getForecast(mockLat, mockLon)

      const calledUrl = (fetchMock.mock.calls[0] as any)[0] as string

      expect(calledUrl).toContain('lat=')
      expect(calledUrl).toContain('lon=')
      expect(calledUrl).toContain('units=metric')
      expect(calledUrl).toContain('cnt=7')
      expect(calledUrl).toContain('appid=')
    })

    it('should include all required query parameters for hourly API', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ list: mockHourlyForecast }),
        })

      convertMock.mockReturnValue(mockConvertedDailyForecast)

      await getForecast(mockLat, mockLon)

      const calledUrl = (fetchMock.mock.calls[1] as any)[0] as string

      expect(calledUrl).toContain('lat=')
      expect(calledUrl).toContain('lon=')
      expect(calledUrl).toContain('units=metric')
      expect(calledUrl).toContain('appid=')
      expect(calledUrl).not.toContain('cnt=') // hourly doesn't have cnt
    })
  })

  describe('Data transformation', () => {
    it('should return data as-is from daily API without transformation', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ list: mockDailyForecast }),
      })

      const result = await getForecast(mockLat, mockLon)

      expect(result).toBe(mockDailyForecast)
      expect(convertMock).not.toHaveBeenCalled()
    })

    it('should transform hourly data to daily format', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ list: mockHourlyForecast }),
        })

      convertMock.mockReturnValue(mockConvertedDailyForecast)

      const result = await getForecast(mockLat, mockLon)

      expect(result).toEqual(mockConvertedDailyForecast)
      expect(convertMock).toHaveBeenCalledWith(mockHourlyForecast)
    })

    it('should handle empty hourly list in transformation', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ list: [] }),
        })

      convertMock.mockReturnValue([])

      const result = await getForecast(mockLat, mockLon)

      expect(result).toEqual([])
      expect(convertMock).toHaveBeenCalledWith([])
    })
  })

  describe('Edge cases', () => {
    it('should handle response without list property', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const result = await getForecast(mockLat, mockLon)

      expect(result).toBeUndefined()
    })

    it('should handle extreme coordinate values', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ list: mockDailyForecast }),
      })

      await getForecast(90, 180)

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('lat=90&lon=180'),
        expect.any(Object)
      )
    })

    it('should handle negative coordinate values', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ list: mockDailyForecast }),
      })

      await getForecast(-45.5, -120.3)

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('lat=-45.5&lon=-120.3'),
        expect.any(Object)
      )
    })

    it('should handle very precise coordinate decimals', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ list: mockDailyForecast }),
      })

      const preciseLat = 6.244203456789
      const preciseLon = -75.581234567890

      await getForecast(preciseLat, preciseLon)

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`lat=${preciseLat}&lon=${preciseLon}`),
        expect.any(Object)
      )
    })
  })

  describe('Multiple calls', () => {
    it('should handle multiple sequential successful calls', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ list: mockDailyForecast }),
      })

      await getForecast(10, 20)
      await getForecast(30, 40)
      await getForecast(50, 60)

      expect(fetchMock).toHaveBeenCalledTimes(3)
    })

    it('should handle mixed success and failure calls', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ list: mockDailyForecast }),
        })
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ list: mockHourlyForecast }),
        })

      convertMock.mockReturnValue(mockConvertedDailyForecast)

      const result1 = await getForecast(10, 20)
      const result2 = await getForecast(30, 40)

      expect(result1).toEqual(mockDailyForecast)
      expect(result2).toEqual(mockConvertedDailyForecast)
    })
  })
})