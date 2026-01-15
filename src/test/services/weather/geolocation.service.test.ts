/* eslint-disable @typescript-eslint/no-explicit-any */
import { WEATHER_CONFIG } from './../../../services/weather/constants/weatherConfig';
import { searchCities, getUserLocation } from '@/services/weather';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

global.fetch = vi.fn()
const fetchMock = global.fetch as Mock

describe('searchCities', () => {
  const mockCityResults = [
    {
      name: 'Medellin',
      lat: 6.2442,
      lon: -75.5812,
      country: 'CO',
      state: 'Antioquia',
    },
    {
      name: 'Bogota',
      lat: 4.711,
      lon: -74.0721,
      country: 'CO',
      state: 'Cundinamarca',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Successful search', () => {
    it('should return city results for valid query', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCityResults,
      })

      const result = await searchCities('Medellin')

      expect(result).toEqual(mockCityResults)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should construct correct API URL with encoded query', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCityResults,
      })

      await searchCities('New York')

      expect(fetchMock).toHaveBeenCalledWith(
        `${WEATHER_CONFIG.GEO_URL}/direct?q=${encodeURIComponent('New York')}&limit=5&appid=${WEATHER_CONFIG.API_KEY}`
      )
    })

    it('should handle queries with special characters', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCityResults,
      })

      const specialQuery = 'São Paulo'
      await searchCities(specialQuery)

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(specialQuery))
      )
    })

    it('should handle queries with spaces', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCityResults,
      })

      await searchCities('Los Angeles')

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('Los Angeles'))
      )
    })

    it('should return empty array for results', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      const result = await searchCities('NonExistentCity12345')

      expect(result).toEqual([])
    })

    it('should limit results to 5 cities', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCityResults,
      })

      await searchCities('London')

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('limit=5')
      )
    })

    it('should handle cities without state property', async () => {
      const citiesWithoutState = [
        {
          name: 'Paris',
          lat: 48.8566,
          lon: 2.3522,
          country: 'FR',
        },
      ]

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => citiesWithoutState,
      })

      const result = await searchCities('Paris')

      expect(result).toEqual(citiesWithoutState)
      expect(result[0].state).toBeUndefined()
    })

    it('should handle multiple cities with same name', async () => {
      const multipleResults = [
        {
          name: 'Springfield',
          lat: 39.7817,
          lon: -89.6501,
          country: 'US',
          state: 'Illinois',
        },
        {
          name: 'Springfield',
          lat: 42.1015,
          lon: -72.5898,
          country: 'US',
          state: 'Massachusetts',
        },
      ]

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => multipleResults,
      })

      const result = await searchCities('Springfield')

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Springfield')
      expect(result[1].name).toBe('Springfield')
      expect(result[0].state).not.toBe(result[1].state)
    })
  })

  describe('Query validation', () => {
    it('should return empty array for queries shorter than 2 characters', async () => {
      const result = await searchCities('a')

      expect(result).toEqual([])
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('should return empty array for empty string', async () => {
      const result = await searchCities('')

      expect(result).toEqual([])
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('should return empty array for single character', async () => {
      const result = await searchCities('M')

      expect(result).toEqual([])
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('should make API call for exactly 2 characters', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCityResults,
      })

      await searchCities('NY')

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should make API call for queries longer than 2 characters', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCityResults,
      })

      await searchCities('New York City')

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should handle whitespace in query length validation', async () => {
      const result = await searchCities(' ')

      expect(result).toEqual([])
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('Error handling', () => {
    it('should throw error when API returns non-ok response', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(searchCities('TestCity')).rejects.toThrow(
        'Failed to search cities'
      )
    })

    it('should throw error on 400 status', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
      })

      await expect(searchCities('Bad')).rejects.toThrow('Failed to search cities')
    })

    it('should throw error on 401 unauthorized', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      await expect(searchCities('Test')).rejects.toThrow('Failed to search cities')
    })

    it('should throw error on 500 server error', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(searchCities('Test')).rejects.toThrow('Failed to search cities')
    })

    it('should handle network errors', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      await expect(searchCities('TestCity')).rejects.toThrow('Network error')
    })

    it('should handle JSON parsing errors', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(searchCities('TestCity')).rejects.toThrow('Invalid JSON')
    })

    it('should handle timeout errors', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Request timeout'))

      await expect(searchCities('TestCity')).rejects.toThrow('Request timeout')
    })
  })

  describe('URL encoding', () => {
    it('should properly encode special URL characters', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      const specialChars = 'City&Name=Test'
      await searchCities(specialChars)

      const calledUrl = (fetchMock.mock.calls[0] as any)[0] as string
      expect(calledUrl).toContain(encodeURIComponent(specialChars))
      expect(calledUrl).not.toContain('&Name=') // Should be encoded
    })

    it('should encode hash symbols', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      await searchCities('City#Test')

      const calledUrl = (fetchMock.mock.calls[0] as any)[0] as string
      expect(calledUrl).toContain('%23') // # encoded
    })

    it('should encode plus signs', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      await searchCities('City+Test')

      const calledUrl = (fetchMock.mock.calls[0] as any)[0] as string
      expect(calledUrl).toContain('%2B') // + encoded
    })

    it('should encode question marks', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      await searchCities('City?Test')

      const calledUrl = (fetchMock.mock.calls[0] as any)[0] as string
      expect(calledUrl).toContain('%3F') // ? encoded
    })
  })

  describe('Edge cases', () => {
    it('should handle very long city names', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      const longName = 'A'.repeat(500)
      await searchCities(longName)

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should handle numeric queries', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      await searchCities('12345')

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should handle emoji in queries', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      await searchCities('City🌍')

      const calledUrl = (fetchMock.mock.calls[0] as any)[0] as string
      expect(calledUrl).toContain(encodeURIComponent('City🌍'))
    })

    it('should handle queries with multiple consecutive spaces', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCityResults,
      })

      await searchCities('New    York')

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Multiple calls', () => {
    it('should handle multiple sequential searches', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockCityResults,
      })

      await searchCities('Madrid')
      await searchCities('Barcelona')
      await searchCities('Valencia')

      expect(fetchMock).toHaveBeenCalledTimes(3)
    })

    it('should handle rapid consecutive searches', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockCityResults,
      })

      const searches = ['M', 'Me', 'Med', 'Mede', 'Medel', 'Medell']
      
      for (const query of searches) {
        await searchCities(query)
      }

      // Only queries >= 2 chars should trigger fetch
      expect(fetchMock).toHaveBeenCalledTimes(5)
    })
  })
})

describe('getUserLocation', () => {
  let mockGeolocation: any

  beforeEach(() => {
    mockGeolocation = {
      getCurrentPosition: vi.fn(),
    }

    Object.defineProperty(global.navigator, 'geolocation', {
      writable: true,
      configurable: true,
      value: mockGeolocation,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Successful location retrieval', () => {
    it('should return user coordinates on success', async () => {
      const mockPosition = {
        coords: {
          latitude: 6.2442,
          longitude: -75.5812,
          accuracy: 100,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }

      mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
        success(mockPosition)
      })

      const result = await getUserLocation()

      expect(result).toEqual({
        lat: 6.2442,
        lon: -75.5812,
      })
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
    })

    it('should handle different coordinate values', async () => {
      const testCases = [
        { latitude: 0, longitude: 0 },
        { latitude: 90, longitude: 180 },
        { latitude: -90, longitude: -180 },
        { latitude: 45.5678, longitude: -123.4567 },
      ]

      for (const coords of testCases) {
        mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
          success({
            coords: { ...coords, accuracy: 100 },
            timestamp: Date.now(),
          })
        })

        const result = await getUserLocation()

        expect(result).toEqual({
          lat: coords.latitude,
          lon: coords.longitude,
        })
      }
    })

    it('should handle very precise coordinates', async () => {
      const mockPosition = {
        coords: {
          latitude: 6.24420123456789,
          longitude: -75.58120987654321,
          accuracy: 10,
        },
        timestamp: Date.now(),
      }

      mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
        success(mockPosition)
      })

      const result = await getUserLocation()

      expect(result.lat).toBe(6.24420123456789)
      expect(result.lon).toBe(-75.58120987654321)
    })

    it('should call getCurrentPosition with correct callbacks', async () => {
      const mockPosition = {
        coords: {
          latitude: 10,
          longitude: 20,
        },
      }

      mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
        success(mockPosition)
      })

      await getUserLocation()

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      )
    })
  })

  describe('Geolocation not supported', () => {
    it('should reject when geolocation is not supported', async () => {
      Object.defineProperty(global.navigator, 'geolocation', {
        writable: true,
        configurable: true,
        value: undefined,
      })

      await expect(getUserLocation()).rejects.toThrow(
        'Geolocation not supported'
      )
    })

    it('should reject when geolocation is null', async () => {
      Object.defineProperty(global.navigator, 'geolocation', {
        writable: true,
        configurable: true,
        value: null,
      })

      await expect(getUserLocation()).rejects.toThrow(
        'Geolocation not supported'
      )
    })
  })

  describe('Geolocation errors', () => {
    it('should reject with PERMISSION_DENIED error', async () => {
      const mockError = {
        code: 1, // PERMISSION_DENIED
        message: 'User denied geolocation',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      }

      mockGeolocation.getCurrentPosition.mockImplementation(
        (_: any, error: any) => {
          error(mockError)
        }
      )

      await expect(getUserLocation()).rejects.toEqual(mockError)
    })

    it('should reject with POSITION_UNAVAILABLE error', async () => {
      const mockError = {
        code: 2, // POSITION_UNAVAILABLE
        message: 'Position unavailable',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      }

      mockGeolocation.getCurrentPosition.mockImplementation(
        (_: any, error: any) => {
          error(mockError)
        }
      )

      await expect(getUserLocation()).rejects.toEqual(mockError)
    })

    it('should reject with TIMEOUT error', async () => {
      const mockError = {
        code: 3, // TIMEOUT
        message: 'Request timeout',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      }

      mockGeolocation.getCurrentPosition.mockImplementation(
        (_: any, error: any) => {
          error(mockError)
        }
      )

      await expect(getUserLocation()).rejects.toEqual(mockError)
    })

    it('should handle custom error messages', async () => {
      const mockError = {
        code: 1,
        message: 'Custom error message',
      }

      mockGeolocation.getCurrentPosition.mockImplementation(
        (_: any, error: any) => {
          error(mockError)
        }
      )

      await expect(getUserLocation()).rejects.toEqual(mockError)
    })
  })

  describe('Promise behavior', () => {
    it('should return a Promise', () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
        success({ coords: { latitude: 0, longitude: 0 } })
      })

      const result = getUserLocation()

      expect(result).toBeInstanceOf(Promise)
    })

    it('should resolve only once', async () => {
      const mockPosition = {
        coords: {
          latitude: 10,
          longitude: 20,
        },
      }

      mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
        success(mockPosition)
      })

      const promise = getUserLocation()
      const result1 = await promise
      const result2 = await promise

      expect(result1).toEqual(result2)
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
    })

    it('should reject only once on error', async () => {
      const mockError = new Error('Test error')

      mockGeolocation.getCurrentPosition.mockImplementation(
        (_: any, error: any) => {
          error(mockError)
        }
      )

      const promise = getUserLocation()

      await expect(promise).rejects.toThrow('Test error')
      await expect(promise).rejects.toThrow('Test error')
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge cases', () => {
    it('should handle coordinates at equator and prime meridian', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
        success({
          coords: {
            latitude: 0,
            longitude: 0,
          },
        })
      })

      const result = await getUserLocation()

      expect(result).toEqual({ lat: 0, lon: 0 })
    })

    it('should handle North Pole coordinates', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
        success({
          coords: {
            latitude: 90,
            longitude: 0,
          },
        })
      })

      const result = await getUserLocation()

      expect(result).toEqual({ lat: 90, lon: 0 })
    })

    it('should handle South Pole coordinates', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
        success({
          coords: {
            latitude: -90,
            longitude: 0,
          },
        })
      })

      const result = await getUserLocation()

      expect(result).toEqual({ lat: -90, lon: 0 })
    })

    it('should handle International Date Line coordinates', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
        success({
          coords: {
            latitude: 0,
            longitude: 180,
          },
        })
      })

      const result = await getUserLocation()

      expect(result).toEqual({ lat: 0, lon: 180 })
    })
  })

  describe('Multiple calls', () => {
    it('should handle multiple sequential location requests', async () => {
      const positions = [
        { latitude: 10, longitude: 20 },
        { latitude: 30, longitude: 40 },
        { latitude: 50, longitude: 60 },
      ]

      for (const coords of positions) {
        mockGeolocation.getCurrentPosition.mockImplementationOnce(
          (success: any) => {
            success({ coords })
          }
        )

        const result = await getUserLocation()
        expect(result).toEqual({ lat: coords.latitude, lon: coords.longitude })
      }

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(3)
    })

    it('should handle concurrent location requests independently', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
        setTimeout(() => {
          success({
            coords: {
              latitude: Math.random() * 180 - 90,
              longitude: Math.random() * 360 - 180,
            },
          })
        }, 10)
      })

      const promises = [
        getUserLocation(),
        getUserLocation(),
        getUserLocation(),
      ]

      const results = await Promise.all(promises)

      expect(results).toHaveLength(3)
      results.forEach(result => {
        expect(result).toHaveProperty('lat')
        expect(result).toHaveProperty('lon')
      })
    })
  })
})