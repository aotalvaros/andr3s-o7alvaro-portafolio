import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { usePostContact } from '@/components/contact/hook/usePostContact'
import { useLoadingStore } from '@/store/loadingStore'
import { httpClient } from '@/core/infrastructure/http/httpClientFactory'

vi.mock('@/core/infrastructure/http/httpClientFactory', () => ({
  httpClient: {
    post: vi.fn(),
  },
}))

vi.mock('@/store/loadingStore')

describe('usePostContact', () => {
  let queryClient: QueryClient
  const mockSetLoading = vi.fn()
  const mockHttpPost = vi.mocked(httpClient.post)

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    vi.mocked(useLoadingStore).mockImplementation((selector: any) => {
      const state = {
        setLoading: mockSetLoading,
        isLoading: false,
      }
      return selector ? selector(state) : state
    })

    vi.clearAllMocks()
  })

  afterEach(() => {
    queryClient.clear()
  })

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => usePostContact(), { wrapper })

      expect(result.current.sendEmail).toBeDefined()
      expect(typeof result.current.sendEmail).toBe('function')
      expect(result.current.isLoading).toBe(false)
    })

    it('should call setLoading with false on mount', () => {
      renderHook(() => usePostContact(), { wrapper })

      expect(mockSetLoading).toHaveBeenCalledWith(false)
    })

    it('should call useLoadingStore with correct selector', () => {
      renderHook(() => usePostContact(), { wrapper })

      expect(useLoadingStore).toHaveBeenCalled()
    })
  })

  describe('Successful submission', () => {
    const mockContactData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message',
    }

    const mockResponse = {
      success: true,
      message: 'Message sent successfully',
    }

    beforeEach(() => {
      mockHttpPost.mockResolvedValue(mockResponse)
    })

    it('should call httpClient.post with correct endpoint and payload', async () => {
      const { result } = renderHook(() => usePostContact(), { wrapper })

      await result.current.sendEmail(mockContactData)

      expect(mockHttpPost).toHaveBeenCalledWith('/contact', mockContactData)
      expect(mockHttpPost).toHaveBeenCalledTimes(1)
    })

    it('should return response data from httpClient.post', async () => {
      const { result } = renderHook(() => usePostContact(), { wrapper })

      const response = await result.current.sendEmail(mockContactData)

      expect(response).toEqual(mockResponse)
    })

    it('should update loading state during submission', async () => {
      mockHttpPost.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 50))
      )

      const { result } = renderHook(() => usePostContact(), { wrapper })

      const sendPromise = result.current.sendEmail(mockContactData)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
        expect(mockSetLoading).toHaveBeenCalledWith(true)
      })

      await sendPromise

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(mockSetLoading).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('Failed submission', () => {
    const mockContactData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message',
    }

    it('should handle network errors', async () => {
      const networkError = new Error('Network error')
      mockHttpPost.mockRejectedValue(networkError)

      const { result } = renderHook(() => usePostContact(), { wrapper })

      await expect(result.current.sendEmail(mockContactData)).rejects.toThrow('Network error')
    })

    it('should handle server errors', async () => {
      const serverError = new Error('Internal server error')
      mockHttpPost.mockRejectedValue(serverError)

      const { result } = renderHook(() => usePostContact(), { wrapper })

      await expect(result.current.sendEmail(mockContactData)).rejects.toThrow('Internal server error')
    })

    it('should handle validation errors', async () => {
      const validationError = new Error('Invalid email format')
      mockHttpPost.mockRejectedValue(validationError)

      const { result } = renderHook(() => usePostContact(), { wrapper })

      await expect(result.current.sendEmail(mockContactData)).rejects.toThrow('Invalid email format')
    })

    it('should set loading to false after error', async () => {
      mockHttpPost.mockRejectedValue(new Error('Error'))

      const { result } = renderHook(() => usePostContact(), { wrapper })

      try {
        await result.current.sendEmail(mockContactData)
      } catch (error) {
        // Expected error
      }

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(mockSetLoading).toHaveBeenCalledWith(false)
      })
    })

    it('should maintain consistent state after error', async () => {
      mockHttpPost.mockRejectedValue(new Error('First error'))

      const { result } = renderHook(() => usePostContact(), { wrapper })

      try {
        await result.current.sendEmail(mockContactData)
      } catch (error) {
        // Expected error
      }

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Should be able to send again after error
      mockHttpPost.mockResolvedValue({ success: true, message: 'Success' })

      const response = await result.current.sendEmail(mockContactData)

      expect(response).toEqual({ success: true, message: 'Success' })
    })
  })

  describe('Multiple submissions', () => {
    const mockResponse = { success: true, message: 'Success' }

    beforeEach(() => {
      mockHttpPost.mockResolvedValue(mockResponse)
    })

    it('should handle multiple sequential submissions', async () => {
      const { result } = renderHook(() => usePostContact(), { wrapper })

      await result.current.sendEmail({
        name: 'User 1',
        email: 'user1@example.com',
        message: 'Message 1',
      })

      await result.current.sendEmail({
        name: 'User 2',
        email: 'user2@example.com',
        message: 'Message 2',
      })

      expect(mockHttpPost).toHaveBeenCalledTimes(2)
      expect(mockHttpPost).toHaveBeenNthCalledWith(1, '/contact', {
        name: 'User 1',
        email: 'user1@example.com',
        message: 'Message 1',
      })
      expect(mockHttpPost).toHaveBeenNthCalledWith(2, '/contact', {
        name: 'User 2',
        email: 'user2@example.com',
        message: 'Message 2',
      })
    })

    it('should reset loading state between submissions', async () => {
      const { result } = renderHook(() => usePostContact(), { wrapper })

      await result.current.sendEmail({
        name: 'User 1',
        email: 'user1@example.com',
        message: 'Message 1',
      })

      expect(result.current.isLoading).toBe(false)

      await result.current.sendEmail({
        name: 'User 2',
        email: 'user2@example.com',
        message: 'Message 2',
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('Edge cases', () => {
    beforeEach(() => {
      mockHttpPost.mockResolvedValue({ success: true, message: 'Success' })
    })

    it('should handle empty message', async () => {
      const { result } = renderHook(() => usePostContact(), { wrapper })

      await result.current.sendEmail({
        name: 'John',
        email: 'john@example.com',
        message: '',
      })

      expect(mockHttpPost).toHaveBeenCalledWith('/contact', {
        name: 'John',
        email: 'john@example.com',
        message: '',
      })
    })

    it('should handle very long messages', async () => {
      const longMessage = 'A'.repeat(10000)
      const { result } = renderHook(() => usePostContact(), { wrapper })

      await result.current.sendEmail({
        name: 'John',
        email: 'john@example.com',
        message: longMessage,
      })

      expect(mockHttpPost).toHaveBeenCalledWith('/contact', 
        expect.objectContaining({ message: longMessage })
      )
    })

    it('should handle special characters in all fields', async () => {
      const specialData = {
        name: 'John O\'Brien <test@test.com>',
        email: 'john+test@example.com',
        message: 'Message with chars: & < > " \' / \\ \n \t',
      }

      const { result } = renderHook(() => usePostContact(), { wrapper })

      await result.current.sendEmail(specialData)

      expect(mockHttpPost).toHaveBeenCalledWith('/contact', specialData)
    })

    it('should handle unicode characters', async () => {
      const unicodeData = {
        name: 'José María',
        email: 'jose@example.com',
        message: '你好世界 مرحبا العالم 🌍',
      }

      const { result } = renderHook(() => usePostContact(), { wrapper })

      await result.current.sendEmail(unicodeData)

      expect(mockHttpPost).toHaveBeenCalledWith('/contact', unicodeData)
    })

    it('should handle whitespace-only fields', async () => {
      const whitespaceData = {
        name: '   ',
        email: 'test@example.com',
        message: '     ',
      }

      const { result } = renderHook(() => usePostContact(), { wrapper })

      await result.current.sendEmail(whitespaceData)

      expect(mockHttpPost).toHaveBeenCalledWith('/contact', whitespaceData)
    })
  })

  describe('React Query integration', () => {

    it('should respect QueryClient retry configuration', async () => {
      mockHttpPost.mockRejectedValue(new Error('Failed'))

      const { result } = renderHook(() => usePostContact(), { wrapper })

      try {
        await result.current.sendEmail({
          name: 'John',
          email: 'john@example.com',
          message: 'Test',
        })
      } catch (error) {
        // Expected
      }

      // Should only be called once because retry is false
      expect(mockHttpPost).toHaveBeenCalledTimes(1)
    })
  })

  describe('useEffect synchronization', () => {
    it('should sync loading state with Zustand store on every isLoading change', async () => {
      mockHttpPost.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 50))
      )

      const { result } = renderHook(() => usePostContact(), { wrapper })

      mockSetLoading.mockClear()

      const sendPromise = result.current.sendEmail({
        name: 'John',
        email: 'john@example.com',
        message: 'Test',
      })

      await waitFor(() => {
        expect(mockSetLoading).toHaveBeenCalledWith(true)
      })

      await sendPromise

      await waitFor(() => {
        expect(mockSetLoading).toHaveBeenCalledWith(false)
      })

      // Should have been called at least twice: true and false
      expect(mockSetLoading.mock.calls.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Type safety', () => {
    it('should accept valid contact data structure', async () => {
      mockHttpPost.mockResolvedValue({ success: true })

      const { result } = renderHook(() => usePostContact(), { wrapper })

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Valid message',
      }

      await expect(result.current.sendEmail(validData)).resolves.toBeDefined()
    })

    it('should return proper response type', async () => {
      const mockResponse = {
        success: true,
        message: 'Sent successfully',
      }

      mockHttpPost.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => usePostContact(), { wrapper })

      const response = await result.current.sendEmail({
        name: 'John',
        email: 'john@example.com',
        message: 'Test',
      })

      expect(response).toHaveProperty('success')
      expect(response).toHaveProperty('message')
    })
  })
})