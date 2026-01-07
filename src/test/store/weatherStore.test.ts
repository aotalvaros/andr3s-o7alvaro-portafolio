import { useWeatherStore } from '../../store/weatherStore';
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { OneCallWeatherData, AirQuality, CitySearchResult } from '@/types/weather.interface'

describe('useWeatherStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useWeatherStore())
    act(() => {
      result.current.reset()
    })
  })

  describe('Initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useWeatherStore())

      expect(result.current.weatherData).toBeNull()
      expect(result.current.airQuality).toBeNull()
      expect(result.current.searchResults).toEqual([])
      expect(result.current.cityName).toBe('Medellin')
      expect(result.current.query).toBe('')
      expect(result.current.isNighttime).toBe(false)
      expect(result.current.isLoading).toBe(true)
      expect(result.current.isSearching).toBe(false)
      expect(result.current.isLoadingLocation).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.isRateLimited).toBe(false)
    })
  })

  describe('setWeatherData', () => {
    it('should update weatherData correctly', () => {
      const { result } = renderHook(() => useWeatherStore())
      
      const mockWeatherData: OneCallWeatherData = {
        current: {
          dt: 1234567890,
          sunrise: 1234567000,
          sunset: 1234598000,
          temp: 22,
          feels_like: 21,
          pressure: 1013,
          humidity: 80,
          dew_point: 18,
          uvi: 5,
          clouds: 40,
          visibility: 10000,
          wind_speed: 3.5,
          wind_deg: 180,
          weather: [{
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }]
        },
        hourly: [],
        daily: []
      }

      act(() => {
        result.current.setWeatherData(mockWeatherData)
      })

      expect(result.current.weatherData).toEqual(mockWeatherData)
    })

    it('should allow setting weatherData to null', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setWeatherData(null)
      })

      expect(result.current.weatherData).toBeNull()
    })

    it('should handle weather data with hourly and daily forecasts', () => {
      const { result } = renderHook(() => useWeatherStore())

      const mockWeatherData: OneCallWeatherData = {
        current: {
          dt: 1234567890,
          sunrise: 1234567000,
          sunset: 1234598000,
          temp: 22,
          feels_like: 21,
          pressure: 1013,
          humidity: 80,
          dew_point: 18,
          uvi: 5,
          clouds: 40,
          visibility: 10000,
          wind_speed: 3.5,
          wind_deg: 180,
          weather: [{
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }]
        },
        hourly: [{
          dt: 1234567890,
          temp: 23,
          feels_like: 22,
          pressure: 1013,
          humidity: 75,
          weather: [{
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }],
          pop: 0.1,
          wind_speed: 3.5,
          wind_deg: 180,
          uvi: 5
        }],
        daily: [{
          dt: 1234567890,
          temp: {
            day: 25,
            min: 18,
            max: 28,
            night: 20,
            eve: 24,
            morn: 19
          },
          feels_like: {
            day: 24,
            night: 19,
            eve: 23,
            morn: 18
          },
          pressure: 1013,
          humidity: 70,
          weather: [{
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }],
          speed: 3.5,
          deg: 180,
          clouds: 20,
          pop: 0.2
        }]
      }

      act(() => {
        result.current.setWeatherData(mockWeatherData)
      })

      expect(result.current.weatherData?.hourly).toHaveLength(1)
      expect(result.current.weatherData?.daily).toHaveLength(1)
    })
  })

  describe('setAirQuality', () => {
    it('should update airQuality correctly', () => {
      const { result } = renderHook(() => useWeatherStore())
      
      const mockAirQuality: AirQuality = {
        aqi: 2,
        components: {
          co: 250.5,
          no: 0.5,
          no2: 15.2,
          o3: 60.3,
          so2: 5.1,
          pm2_5: 12.3,
          pm10: 20.5,
          nh3: 2.1
        }
      }

      act(() => {
        result.current.setAirQuality(mockAirQuality)
      })

      expect(result.current.airQuality).toEqual(mockAirQuality)
    })

    it('should allow setting airQuality to null', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setAirQuality(null)
      })

      expect(result.current.airQuality).toBeNull()
    })

    it('should handle different air quality index values', () => {
      const { result } = renderHook(() => useWeatherStore())

      const goodAirQuality: AirQuality = {
        aqi: 1,
        components: {
          co: 200.0,
          no: 0.3,
          no2: 10.0,
          o3: 50.0,
          so2: 4.0,
          pm2_5: 8.0,
          pm10: 15.0,
          nh3: 1.5
        }
      }

      act(() => {
        result.current.setAirQuality(goodAirQuality)
      })

      expect(result.current.airQuality?.aqi).toBe(1)
    })
  })

  describe('setSearchResults', () => {
    it('should update searchResults with array of cities', () => {
      const { result } = renderHook(() => useWeatherStore())
      
      const mockResults: CitySearchResult[] = [
        {
          name: 'Medellin',
          lat: 6.2442,
          lon: -75.5812,
          country: 'CO',
          state: 'Antioquia'
        },
        {
          name: 'Bogota',
          lat: 4.7110,
          lon: -74.0721,
          country: 'CO',
          state: 'Cundinamarca'
        }
      ]

      act(() => {
        result.current.setSearchResults(mockResults)
      })

      expect(result.current.searchResults).toEqual(mockResults)
      expect(result.current.searchResults).toHaveLength(2)
    })

    it('should allow setting empty array', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setSearchResults([])
      })

      expect(result.current.searchResults).toEqual([])
    })

    it('should handle cities without state property', () => {
      const { result } = renderHook(() => useWeatherStore())

      const mockResults: CitySearchResult[] = [
        {
          name: 'Paris',
          lat: 48.8566,
          lon: 2.3522,
          country: 'FR'
        }
      ]

      act(() => {
        result.current.setSearchResults(mockResults)
      })

      expect(result.current.searchResults[0].state).toBeUndefined()
    })
  })

  describe('setCityName', () => {
    it('should update city name', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setCityName('Bogota')
      })

      expect(result.current.cityName).toBe('Bogota')
    })

    it('should allow empty strings', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setCityName('')
      })

      expect(result.current.cityName).toBe('')
    })

    it('should handle city names with special characters', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setCityName('São Paulo')
      })

      expect(result.current.cityName).toBe('São Paulo')
    })
  })

  describe('setQuery', () => {
    it('should update search query', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setQuery('Cali')
      })

      expect(result.current.query).toBe('Cali')
    })

    it('should handle queries with spaces', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setQuery('New York')
      })

      expect(result.current.query).toBe('New York')
    })

    it('should handle empty query', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setQuery('')
      })

      expect(result.current.query).toBe('')
    })
  })

  describe('Boolean states', () => {
    it('should update isNighttime', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setIsNighttime(true)
      })

      expect(result.current.isNighttime).toBe(true)

      act(() => {
        result.current.setIsNighttime(false)
      })

      expect(result.current.isNighttime).toBe(false)
    })

    it('should update isLoading', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setIsLoading(false)
      })

      expect(result.current.isLoading).toBe(false)

      act(() => {
        result.current.setIsLoading(true)
      })

      expect(result.current.isLoading).toBe(true)
    })

    it('should update isSearching', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setIsSearching(true)
      })

      expect(result.current.isSearching).toBe(true)
    })

    it('should update isLoadingLocation', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setIsLoadingLocation(true)
      })

      expect(result.current.isLoadingLocation).toBe(true)
    })

    it('should update isRateLimited', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setIsRateLimited(true)
      })

      expect(result.current.isRateLimited).toBe(true)
    })
  })

  describe('setError', () => {
    it('should set error message', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setError('Failed to load weather data')
      })

      expect(result.current.error).toBe('Failed to load weather data')
    })

    it('should allow clearing error by setting to null', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setError('Temporary error')
      })

      expect(result.current.error).toBe('Temporary error')

      act(() => {
        result.current.setError(null)
      })

      expect(result.current.error).toBeNull()
    })

    it('should handle multiple error updates', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setError('First error')
      })

      expect(result.current.error).toBe('First error')

      act(() => {
        result.current.setError('Second error')
      })

      expect(result.current.error).toBe('Second error')
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useWeatherStore())

      // Modify multiple states
      act(() => {
        result.current.setCityName('Bogota')
        result.current.setQuery('test query')
        result.current.setIsNighttime(true)
        result.current.setIsLoading(false)
        result.current.setError('Test error')
        result.current.setIsRateLimited(true)
      })

      // Verify states changed
      expect(result.current.cityName).toBe('Bogota')
      expect(result.current.query).toBe('test query')
      expect(result.current.error).toBe('Test error')

      // Reset
      act(() => {
        result.current.reset()
      })

      // Verify everything returned to initial state
      expect(result.current.weatherData).toBeNull()
      expect(result.current.airQuality).toBeNull()
      expect(result.current.searchResults).toEqual([])
      expect(result.current.cityName).toBe('Medellin')
      expect(result.current.query).toBe('')
      expect(result.current.isNighttime).toBe(false)
      expect(result.current.isLoading).toBe(true)
      expect(result.current.isSearching).toBe(false)
      expect(result.current.isLoadingLocation).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.isRateLimited).toBe(false)
    })
  })

  describe('Real-world scenarios', () => {
    it('should handle complete city search flow', () => {
      const { result } = renderHook(() => useWeatherStore())

      // User starts searching
      act(() => {
        result.current.setQuery('Med')
        result.current.setIsSearching(true)
      })

      expect(result.current.query).toBe('Med')
      expect(result.current.isSearching).toBe(true)

      // Results arrive
      const mockResults: CitySearchResult[] = [
        {
          name: 'Medellin',
          lat: 6.2442,
          lon: -75.5812,
          country: 'CO',
          state: 'Antioquia'
        }
      ]

      act(() => {
        result.current.setSearchResults(mockResults)
        result.current.setIsSearching(false)
      })

      expect(result.current.searchResults).toHaveLength(1)
      expect(result.current.isSearching).toBe(false)

      // User selects a city
      act(() => {
        result.current.setCityName('Medellin')
        result.current.setIsLoading(true)
        result.current.setSearchResults([])
      })

      expect(result.current.cityName).toBe('Medellin')
      expect(result.current.isLoading).toBe(true)
      expect(result.current.searchResults).toEqual([])
    })

    it('should handle error flow when loading data', () => {
      const { result } = renderHook(() => useWeatherStore())

      // Start loading
      act(() => {
        result.current.setIsLoading(true)
        result.current.setError(null)
      })

      // Error occurs
      act(() => {
        result.current.setError('Could not connect to server')
        result.current.setIsLoading(false)
      })

      expect(result.current.error).toBe('Could not connect to server')
      expect(result.current.isLoading).toBe(false)

      // User retries
      act(() => {
        result.current.setError(null)
        result.current.setIsLoading(true)
      })

      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(true)
    })

    it('should handle rate limiting scenario', () => {
      const { result } = renderHook(() => useWeatherStore())

      act(() => {
        result.current.setIsRateLimited(true)
        result.current.setError('Too many requests. Please try again later.')
        result.current.setIsLoading(false)
      })

      expect(result.current.isRateLimited).toBe(true)
      expect(result.current.error).toBeTruthy()
      expect(result.current.isLoading).toBe(false)
    })

    it('should toggle between day and night correctly', () => {
      const { result } = renderHook(() => useWeatherStore())

      // It's daytime
      act(() => {
        result.current.setIsNighttime(false)
      })

      expect(result.current.isNighttime).toBe(false)

      // Night falls
      act(() => {
        result.current.setIsNighttime(true)
      })

      expect(result.current.isNighttime).toBe(true)
    })

    it('should handle successful weather data load', () => {
      const { result } = renderHook(() => useWeatherStore())

      const mockWeatherData: OneCallWeatherData = {
        current: {
          dt: 1234567890,
          sunrise: 1234567000,
          sunset: 1234598000,
          temp: 22,
          feels_like: 21,
          pressure: 1013,
          humidity: 80,
          dew_point: 18,
          uvi: 5,
          clouds: 40,
          visibility: 10000,
          wind_speed: 3.5,
          wind_deg: 180,
          weather: [{
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }]
        },
        hourly: [],
        daily: []
      }

      const mockAirQuality: AirQuality = {
        aqi: 2,
        components: {
          co: 250.5,
          no: 0.5,
          no2: 15.2,
          o3: 60.3,
          so2: 5.1,
          pm2_5: 12.3,
          pm10: 20.5,
          nh3: 2.1
        }
      }

      act(() => {
        result.current.setIsLoading(true)
      })

      act(() => {
        result.current.setWeatherData(mockWeatherData)
        result.current.setAirQuality(mockAirQuality)
        result.current.setIsLoading(false)
        result.current.setError(null)
      })

      expect(result.current.weatherData).toEqual(mockWeatherData)
      expect(result.current.airQuality).toEqual(mockAirQuality)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('Data persistence across updates', () => {
    it('should maintain multiple updated states simultaneously', () => {
      const { result } = renderHook(() => useWeatherStore())

      const mockWeatherData: OneCallWeatherData = {
        current: {
          dt: 1234567890,
          sunrise: 1234567000,
          sunset: 1234598000,
          temp: 22,
          feels_like: 21,
          pressure: 1013,
          humidity: 80,
          dew_point: 18,
          uvi: 5,
          clouds: 40,
          visibility: 10000,
          wind_speed: 3.5,
          wind_deg: 180,
          weather: [{
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }]
        },
        hourly: [],
        daily: []
      }

      const mockAirQuality: AirQuality = {
        aqi: 2,
        components: {
          co: 250.5,
          no: 0.5,
          no2: 15.2,
          o3: 60.3,
          so2: 5.1,
          pm2_5: 12.3,
          pm10: 20.5,
          nh3: 2.1
        }
      }

      act(() => {
        result.current.setWeatherData(mockWeatherData)
        result.current.setAirQuality(mockAirQuality)
        result.current.setCityName('Medellin')
        result.current.setIsLoading(false)
      })

      // All states should persist
      expect(result.current.weatherData).toEqual(mockWeatherData)
      expect(result.current.airQuality).toEqual(mockAirQuality)
      expect(result.current.cityName).toBe('Medellin')
      expect(result.current.isLoading).toBe(false)
    })
  })
})