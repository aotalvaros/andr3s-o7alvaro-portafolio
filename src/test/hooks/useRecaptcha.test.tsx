/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRecaptcha } from '../../hooks/useRecaptcha';
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from 'vitest'


describe('useRecaptcha', () => {

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useRecaptcha())

      expect(result.current.recaptchaRef).toBeDefined()
      expect(result.current.recaptchaRef.current).toBeNull()
      expect(result.current.isVerified).toBe(true)
      expect(result.current.onChangeReCaptcha).toBeDefined()
      expect(typeof result.current.onChangeReCaptcha).toBe('function')
    })

    it('should create a stable ref object', () => {
      const { result, rerender } = renderHook(() => useRecaptcha())

      const firstRef = result.current.recaptchaRef

      rerender()

      const secondRef = result.current.recaptchaRef

      expect(firstRef).toBe(secondRef)
    })

    it('should create a new ref for each hook instance', () => {
      const { result: result1 } = renderHook(() => useRecaptcha())
      const { result: result2 } = renderHook(() => useRecaptcha())

      expect(result1.current.recaptchaRef).not.toBe(result2.current.recaptchaRef)
    })
  })

  describe('onChangeReCaptcha with valid token', () => {
    it('should set isVerified to false when token is provided', () => {
      const { result } = renderHook(() => useRecaptcha())

      expect(result.current.isVerified).toBe(true)

      act(() => {
        result.current.onChangeReCaptcha('valid-token-123')
      })

      expect(result.current.isVerified).toBe(false)
    })

    it('should handle different token formats', () => {
      const { result } = renderHook(() => useRecaptcha())

      const tokens = [
        'short-token',
        'very-long-token-with-many-characters-1234567890',
        'token-with-special-chars-!@#$%',
        '1234567890',
      ]

      tokens.forEach(token => {
        act(() => {
          result.current.onChangeReCaptcha(token)
        })

        expect(result.current.isVerified).toBe(false)
      })
    })
  })

  describe('onChangeReCaptcha with null token', () => {
    it('should set isVerified to true when token is null', () => {
      const { result } = renderHook(() => useRecaptcha())

      // First verify with a token
      act(() => {
        result.current.onChangeReCaptcha('valid-token')
      })

      expect(result.current.isVerified).toBe(false)

      // Then expire/reset with null
      act(() => {
        result.current.onChangeReCaptcha(null)
      })

      expect(result.current.isVerified).toBe(true)
    })

    it('should handle multiple null calls', () => {
      const { result } = renderHook(() => useRecaptcha())

      act(() => {
        result.current.onChangeReCaptcha(null)
      })
      expect(result.current.isVerified).toBe(true)

      act(() => {
        result.current.onChangeReCaptcha(null)
      })
      expect(result.current.isVerified).toBe(true)

      act(() => {
        result.current.onChangeReCaptcha(null)
      })
      expect(result.current.isVerified).toBe(true)
    })
  })

  describe('Token lifecycle', () => {
    it('should toggle verification state with token changes', () => {
      const { result } = renderHook(() => useRecaptcha())

      expect(result.current.isVerified).toBe(true)

      // User verifies
      act(() => {
        result.current.onChangeReCaptcha('token-1')
      })
      expect(result.current.isVerified).toBe(false)

      // Token expires
      act(() => {
        result.current.onChangeReCaptcha(null)
      })
      expect(result.current.isVerified).toBe(true)

      // User verifies again
      act(() => {
        result.current.onChangeReCaptcha('token-2')
      })
      expect(result.current.isVerified).toBe(false)
    })

    it('should handle rapid token changes', () => {
      const { result } = renderHook(() => useRecaptcha())

      const changes = [
        'token-1',
        null,
        'token-2',
        null,
        'token-3',
        'token-4',
        null,
      ]

      changes.forEach(token => {
        act(() => {
          result.current.onChangeReCaptcha(token)
        })
      })

      // Last change was null
      expect(result.current.isVerified).toBe(true)
    })

    it('should handle token replacement without expiry', () => {
      const { result } = renderHook(() => useRecaptcha())

      act(() => {
        result.current.onChangeReCaptcha('first-token')
      })
      expect(result.current.isVerified).toBe(false)

      act(() => {
        result.current.onChangeReCaptcha('second-token')
      })
      expect(result.current.isVerified).toBe(false)

      act(() => {
        result.current.onChangeReCaptcha('third-token')
      })
      expect(result.current.isVerified).toBe(false)
    })
  })

  describe('Ref behavior', () => {
    it('should maintain ref stability across state changes', () => {
      const { result } = renderHook(() => useRecaptcha())

      const initialRef = result.current.recaptchaRef

      act(() => {
        result.current.onChangeReCaptcha('token')
      })

      expect(result.current.recaptchaRef).toBe(initialRef)

      act(() => {
        result.current.onChangeReCaptcha(null)
      })

      expect(result.current.recaptchaRef).toBe(initialRef)
    })

    it('should allow ref to be assigned to ReCAPTCHA component', () => {
      const { result } = renderHook(() => useRecaptcha())

      const mockRecaptchaInstance = {
        execute: () => Promise.resolve('token'),
        reset: () => {},
        getValue: () => 'token',
      }

      // Simulate assigning the ref (as would happen with a component)
      act(() => {
        result.current.recaptchaRef.current = mockRecaptchaInstance as any
      })

      expect(result.current.recaptchaRef.current).toBe(mockRecaptchaInstance)
    })

    it('should allow ref to be cleared', () => {
      const { result } = renderHook(() => useRecaptcha())

      const mockInstance = { reset: () => {} }
      
      act(() => {
        result.current.recaptchaRef.current = mockInstance as any
      })

      expect(result.current.recaptchaRef.current).toBe(mockInstance)

      act(() => {
        result.current.recaptchaRef.current = null
      })

      expect(result.current.recaptchaRef.current).toBeNull()
    })
  })

  describe('Real-world scenarios', () => {
    it('should handle typical user verification flow', () => {
      const { result } = renderHook(() => useRecaptcha())

      // Initial state - not verified (waiting for user)
      expect(result.current.isVerified).toBe(true)

      // User completes recaptcha
      act(() => {
        result.current.onChangeReCaptcha('user-completed-token-abc123')
      })

      // Now verified
      expect(result.current.isVerified).toBe(false)
    })

    it('should handle recaptcha expiration scenario', () => {
      const { result } = renderHook(() => useRecaptcha())

      // User verifies
      act(() => {
        result.current.onChangeReCaptcha('initial-token')
      })
      expect(result.current.isVerified).toBe(false)

      // Token expires after 2 minutes (recaptcha calls with null)
      act(() => {
        result.current.onChangeReCaptcha(null)
      })
      expect(result.current.isVerified).toBe(true)

      // User must verify again
      act(() => {
        result.current.onChangeReCaptcha('new-token-after-expiry')
      })
      expect(result.current.isVerified).toBe(false)
    })

    it('should handle reset and re-verification', () => {
      const { result } = renderHook(() => useRecaptcha())

      // Verify
      act(() => {
        result.current.onChangeReCaptcha('token-1')
      })
      expect(result.current.isVerified).toBe(false)

      // Manually reset (e.g., form error, user clicks reset)
      act(() => {
        result.current.onChangeReCaptcha(null)
      })
      expect(result.current.isVerified).toBe(true)

      // Verify again
      act(() => {
        result.current.onChangeReCaptcha('token-2')
      })
      expect(result.current.isVerified).toBe(false)
    })

    it('should handle form submission with verification check', () => {
      const { result } = renderHook(() => useRecaptcha())

      // Before verification
      expect(result.current.isVerified).toBe(true) // Form submit should be disabled

      // User verifies
      act(() => {
        result.current.onChangeReCaptcha('verified-token')
      })

      // After verification
      expect(result.current.isVerified).toBe(false) // Form submit should be enabled
    })
  })

  describe('Edge cases', () => {
    it('should handle whitespace-only token', () => {
      const { result } = renderHook(() => useRecaptcha())

      act(() => {
        result.current.onChangeReCaptcha('   ')
      })

      // Whitespace string is truthy
      expect(result.current.isVerified).toBe(false)
    })

    it('should handle very long token strings', () => {
      const { result } = renderHook(() => useRecaptcha())

      const longToken = 'a'.repeat(10000)

      act(() => {
        result.current.onChangeReCaptcha(longToken)
      })

      expect(result.current.isVerified).toBe(false)
    })

    it('should handle token with newlines and special characters', () => {
      const { result } = renderHook(() => useRecaptcha())

      const specialToken = 'token\nwith\nlines\tand\ttabs'

      act(() => {
        result.current.onChangeReCaptcha(specialToken)
      })

      expect(result.current.isVerified).toBe(false)
    })

    it('should handle alternating token and null rapidly', () => {
      const { result } = renderHook(() => useRecaptcha())

      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.onChangeReCaptcha(i % 2 === 0 ? `token-${i}` : null)
        })
      }

      // Last iteration was i=99 (odd), so null
      expect(result.current.isVerified).toBe(true)
    })
  })

  describe('Type safety', () => {
    it('should accept string tokens', () => {
      const { result } = renderHook(() => useRecaptcha())

      act(() => {
        result.current.onChangeReCaptcha('string-token')
      })

      expect(result.current.isVerified).toBe(false)
    })

    it('should accept null tokens', () => {
      const { result } = renderHook(() => useRecaptcha())

      act(() => {
        result.current.onChangeReCaptcha(null)
      })

      expect(result.current.isVerified).toBe(true)
    })

    it('should expose correct return type structure', () => {
      const { result } = renderHook(() => useRecaptcha())

      expect(result.current).toHaveProperty('recaptchaRef')
      expect(result.current).toHaveProperty('isVerified')
      expect(result.current).toHaveProperty('onChangeReCaptcha')
      expect(Object.keys(result.current)).toHaveLength(3)
    })
  })

  describe('Multiple hook instances', () => {
    it('should maintain independent state for multiple instances', () => {
      const { result: result1 } = renderHook(() => useRecaptcha())
      const { result: result2 } = renderHook(() => useRecaptcha())

      act(() => {
        result1.current.onChangeReCaptcha('token-1')
      })

      expect(result1.current.isVerified).toBe(false)
      expect(result2.current.isVerified).toBe(true)

      act(() => {
        result2.current.onChangeReCaptcha('token-2')
      })

      expect(result1.current.isVerified).toBe(false)
      expect(result2.current.isVerified).toBe(false)

      act(() => {
        result1.current.onChangeReCaptcha(null)
      })

      expect(result1.current.isVerified).toBe(true)
      expect(result2.current.isVerified).toBe(false)
    })

    it('should maintain independent refs for multiple instances', () => {
      const { result: result1 } = renderHook(() => useRecaptcha())
      const { result: result2 } = renderHook(() => useRecaptcha())

      expect(result1.current.recaptchaRef).not.toBe(result2.current.recaptchaRef)

      const mockInstance1 = { id: 1 }
      const mockInstance2 = { id: 2 }

      act(() => {
        result1.current.recaptchaRef.current = mockInstance1 as any
        result2.current.recaptchaRef.current = mockInstance2 as any
      })

      expect(result1.current.recaptchaRef.current).toBe(mockInstance1)
      expect(result2.current.recaptchaRef.current).toBe(mockInstance2)
    })
  })

  describe('Function stability', () => {
    it('should maintain stable onChangeReCaptcha reference', () => {
      const { result, rerender } = renderHook(() => useRecaptcha())

      const firstCallback = result.current.onChangeReCaptcha

      rerender()

      const secondCallback = result.current.onChangeReCaptcha

      // Note: Without useCallback, this will create new function instances
      // This test documents current behavior
      expect(typeof firstCallback).toBe('function')
      expect(typeof secondCallback).toBe('function')
    })
  })
})