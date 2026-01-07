import { getSecureRandomInRange } from '../../utils/randomValues';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('getSecureRandomInRange', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic functionality', () => {
    it('should return a number within the specified range', () => {
      const result = getSecureRandomInRange(0, 10)

      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(10)
      expect(typeof result).toBe('number')
    })

    it('should return a number within range for negative numbers', () => {
      const result = getSecureRandomInRange(-10, -5)

      expect(result).toBeGreaterThanOrEqual(-10)
      expect(result).toBeLessThanOrEqual(-5)
    })

    it('should handle range spanning negative to positive', () => {
      const result = getSecureRandomInRange(-5, 5)

      expect(result).toBeGreaterThanOrEqual(-5)
      expect(result).toBeLessThanOrEqual(5)
    })

    it('should handle very large numbers', () => {
      const result = getSecureRandomInRange(1000000, 2000000)

      expect(result).toBeGreaterThanOrEqual(1000000)
      expect(result).toBeLessThanOrEqual(2000000)
    })

    it('should handle decimal ranges', () => {
      const result = getSecureRandomInRange(0.5, 1.5)

      expect(result).toBeGreaterThanOrEqual(0.5)
      expect(result).toBeLessThanOrEqual(1.5)
    })

    it('should handle min and max being equal', () => {
      const result = getSecureRandomInRange(5, 5)

      expect(result).toBe(5)
    })
  })

  describe('Mocked crypto behavior', () => {
    it('should return min value when crypto returns 0', () => {
      const mockGetRandomValues = vi.fn((array: Uint32Array) => {
        array[0] = 0
        return array
      })

      vi.stubGlobal('crypto', {
        getRandomValues: mockGetRandomValues
      })

      const result = getSecureRandomInRange(10, 20)

      expect(result).toBe(10)
      expect(mockGetRandomValues).toHaveBeenCalledTimes(1)
      
      vi.unstubAllGlobals()
    })

    it('should return middle value when crypto returns half maximum', () => {
      const mockGetRandomValues = vi.fn((array: Uint32Array) => {
        array[0] = 0xffffffff / 2
        return array
      })

      vi.stubGlobal('crypto', {
        getRandomValues: mockGetRandomValues
      })

      const result = getSecureRandomInRange(0, 100)

      expect(result).toBeCloseTo(50, 0)
      
      vi.unstubAllGlobals()
    })

    it('should return quarter value when crypto returns quarter maximum', () => {
      const mockGetRandomValues = vi.fn((array: Uint32Array) => {
        array[0] = 0xffffffff / 4
        return array
      })

      vi.stubGlobal('crypto', {
        getRandomValues: mockGetRandomValues
      })

      const result = getSecureRandomInRange(0, 100)

      expect(result).toBeCloseTo(25, 0)
      
      vi.unstubAllGlobals()
    })

    it('should call crypto.getRandomValues with Uint32Array', () => {
      const mockGetRandomValues = vi.fn((array: Uint32Array) => {
        array[0] = 0x7fffffff
        return array
      })

      vi.stubGlobal('crypto', {
        getRandomValues: mockGetRandomValues
      })

      getSecureRandomInRange(0, 100)

      expect(mockGetRandomValues).toHaveBeenCalledTimes(1)
      const callArg = mockGetRandomValues.mock.calls[0][0]
      expect(callArg).toBeInstanceOf(Uint32Array)
      expect(callArg.length).toBe(1)
      
      vi.unstubAllGlobals()
    })
  })

  describe('Distribution and randomness', () => {
    it('should generate different values on multiple calls', () => {
      const results = new Set<number>()

      for (let i = 0; i < 100; i++) {
        results.add(getSecureRandomInRange(0, 1000000))
      }

      expect(results.size).toBeGreaterThan(90)
    })

    it('should maintain distribution across range', () => {
      const min = 0
      const max = 100
      const iterations = 1000
      const results: number[] = []

      for (let i = 0; i < iterations; i++) {
        results.push(getSecureRandomInRange(min, max))
      }

      results.forEach(result => {
        expect(result).toBeGreaterThanOrEqual(min)
        expect(result).toBeLessThanOrEqual(max)
      })

      const lowerHalf = results.filter(r => r < 50).length
      const upperHalf = results.filter(r => r >= 50).length

      expect(lowerHalf).toBeGreaterThan(iterations * 0.3)
      expect(upperHalf).toBeGreaterThan(iterations * 0.3)
    })
  })

  describe('Edge cases', () => {
    it('should handle zero as min', () => {
      const result = getSecureRandomInRange(0, 100)

      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(100)
    })

    it('should handle zero as max', () => {
      const result = getSecureRandomInRange(-100, 0)

      expect(result).toBeGreaterThanOrEqual(-100)
      expect(result).toBeLessThanOrEqual(0)
    })

    it('should handle very small ranges', () => {
      const result = getSecureRandomInRange(0, 0.001)

      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(0.001)
    })

    it('should handle reversed min/max (max < min)', () => {
      const result = getSecureRandomInRange(10, 5)

      expect(typeof result).toBe('number')
      expect(isNaN(result)).toBe(false)
    })
  })

  describe('Mathematical correctness', () => {
    it('should correctly map crypto value to range', () => {
      const mockGetRandomValues = vi.fn((array: Uint32Array) => {
        array[0] = 0x80000000
        return array
      })

      vi.stubGlobal('crypto', {
        getRandomValues: mockGetRandomValues
      })

      const result = getSecureRandomInRange(0, 100)

      expect(result).toBeCloseTo(50, 0)
      
      vi.unstubAllGlobals()
    })

    it('should handle the formula correctly for offset ranges', () => {
      const mockGetRandomValues = vi.fn((array: Uint32Array) => {
        array[0] = 0x80000000 // 0.5
        return array
      })

      vi.stubGlobal('crypto', {
        getRandomValues: mockGetRandomValues
      })

      const result = getSecureRandomInRange(50, 150)

      expect(result).toBeCloseTo(100, 0)
      
      vi.unstubAllGlobals()
    })
  })

  describe('Type safety', () => {
    it('should always return a finite number', () => {
      const result = getSecureRandomInRange(0, 100)

      expect(Number.isFinite(result)).toBe(true)
    })

    it('should not return NaN', () => {
      const result = getSecureRandomInRange(0, 100)

      expect(Number.isNaN(result)).toBe(false)
    })

    it('should not return Infinity', () => {
      const result = getSecureRandomInRange(0, 100)

      expect(result).not.toBe(Infinity)
      expect(result).not.toBe(-Infinity)
    })
  })
})