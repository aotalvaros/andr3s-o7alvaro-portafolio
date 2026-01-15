/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetStatusMaintenance } from '@/components/maintenance/hooks/useGetStatusMaintenance';
import { getMaintenanceStatus } from '@/services/maintenance/maintenace.service';
import { MaintenanceResponseStatus } from '@/services/maintenance/models/maintenaceResponseStatus.interface';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

vi.mock('@/services/maintenance/maintenace.service', () => ({
  getMaintenanceStatus: vi.fn(),
}));

const mockGetMaintenanceStatus = vi.mocked(getMaintenanceStatus);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return Wrapper;
};


const mockMaintenanceData: MaintenanceResponseStatus = {
  data: [
    {
      isActive: false,
      isBlocked: false,
      lastModifiedAt: '2024-01-01T00:00:00Z',
      lastModifiedBy: {
        _id: 'admin1',
        name: 'Admin User',
        email: 'admin@example.com',
      },
      moduleName: 'module1',
      __v: 0,
      _id: '1',
      name: 'Module 1',
    },
    {
      isActive: false,
      isBlocked: false,
      lastModifiedAt: '2024-01-01T00:00:00Z',
      lastModifiedBy: {
        _id: 'admin2',
        name: 'Admin User 2',
        email: 'admin2@example.com',
      },
      moduleName: 'module2',
      __v: 0,
      _id: '2',
      name: 'Module 2',
    },
  ],
  status: 'success',
}

describe('useGetStatusMaintenance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

 describe('Initial state', () => {
    it('should start with loading state', () => {
      mockGetMaintenanceStatus.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )


      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.isSuccess).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.isInMaintenance).toBe(false)
    })

    it('should have correct initial data', () => {
      mockGetMaintenanceStatus.mockImplementation(
        () => new Promise(() => {})
      )

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.error).toBeNull()
    })
  })

  describe('Successful data fetching', () => {
    it('should return isInMaintenance as false when no modules are blocked', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(mockMaintenanceData)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isInMaintenance).toBe(false)
      expect(result.current.data).toEqual(mockMaintenanceData)
    })

    it('should return isInMaintenance as true when at least one module is blocked', async () => {
      const dataWithBlockedModule: MaintenanceResponseStatus = {
        data: [
          {
            isActive: true,
            isBlocked: true,
            lastModifiedAt: '2024-01-01T00:00:00Z',
            lastModifiedBy: {
              _id: 'admin1',
              name: 'Admin User',
              email: 'admin@example.com',
            },
            moduleName: 'module1',
            __v: 0,
            _id: '1',
            name: 'Module 1',
          },
          {
            isActive: false,
            isBlocked: false,
            lastModifiedAt: '2024-01-01T00:00:00Z',
            lastModifiedBy: {
              _id: 'admin2',
              name: 'Admin User 2',
              email: 'admin2@example.com',
            },
            moduleName: 'module2',
            __v: 0,
            _id: '2',
            name: 'Module 2',
          },
        ],
        status: 'success',
      }

      mockGetMaintenanceStatus.mockResolvedValue(dataWithBlockedModule)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isInMaintenance).toBe(true)
    })

    it('should return isInMaintenance as true when all modules are blocked', async () => {
      const allBlockedData: MaintenanceResponseStatus = {
        data: [
          {
            isActive: true,
            isBlocked: true,
            lastModifiedAt: '2024-01-01T00:00:00Z',
            lastModifiedBy: {
              _id: 'admin1',
              name: 'Admin User',
              email: 'admin@example.com',
            },
            moduleName: 'module1',
            __v: 0,
            _id: '1',
            name: 'Module 1',
          },
          {
            isActive: true,
            isBlocked: true,
            lastModifiedAt: '2024-01-01T00:00:00Z',
            lastModifiedBy: {
              _id: 'admin2',
              name: 'Admin User 2',
              email: 'admin2@example.com',
            },
            moduleName: 'module2',
            __v: 0,
            _id: '2',
            name: 'Module 2',
          },
        ],
        status: 'success',
      }

      mockGetMaintenanceStatus.mockResolvedValue(allBlockedData)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isInMaintenance).toBe(true)
    })

    it('should handle empty data array', async () => {
      const emptyData: MaintenanceResponseStatus = {
        data: [],
        status: 'success',
      }

      mockGetMaintenanceStatus.mockResolvedValue(emptyData)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isInMaintenance).toBe(false)
      expect(result.current.data?.data).toHaveLength(0)
    })

    it('should call getMaintenanceStatus service', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(mockMaintenanceData)

      renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('React Query configuration', () => {
    it('should have correct staleTime configuration', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(mockMaintenanceData)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // Data should not be stale immediately
      expect(result.current.isStale).toBe(false)
    })

    it('should not refetch on window focus', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(mockMaintenanceData)

      renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(1)
      })

      // Simulate window focus
      window.dispatchEvent(new Event('focus'))

      // Wait a bit to see if it refetches
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should still be called only once
      expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(1)
    })

    
    it('should not throw errors on failure', async () => {
      mockGetMaintenanceStatus.mockRejectedValue(new Error('Test error'))


      expect(() => {
        renderHook(() => useGetStatusMaintenance(), {
          wrapper: createWrapper()
        })
      }).not.toThrow()
    })
  })

  describe('Data transformation', () => {
    it('should correctly identify maintenance when first module is blocked', async () => {
      const data: MaintenanceResponseStatus = {
        data: [
          {
            ...mockMaintenanceData.data[0],
            isBlocked: true,
          },
          mockMaintenanceData.data[1],
        ],
        status: 'success',
      }

      mockGetMaintenanceStatus.mockResolvedValue(data)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isInMaintenance).toBe(true)
    })

    it('should correctly identify maintenance when last module is blocked', async () => {
      const data: MaintenanceResponseStatus = {
        data: [
          mockMaintenanceData.data[0],
          {
            ...mockMaintenanceData.data[1],
            isBlocked: true,
          },
        ],
        status: 'success',
      }

      mockGetMaintenanceStatus.mockResolvedValue(data)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isInMaintenance).toBe(true)
    })

    it('should correctly identify maintenance when middle module is blocked', async () => {
      const data: MaintenanceResponseStatus = {
        data: [
          mockMaintenanceData.data[0],
          {
            ...mockMaintenanceData.data[1],
            isBlocked: true,
          },
          {
            isActive: false,
            isBlocked: false,
            lastModifiedAt: '2024-01-01T00:00:00Z',
            lastModifiedBy: {
              _id: 'admin3',
              name: 'Admin User 3',
              email: 'admin3@example.com',
            },
            moduleName: 'module3',
            __v: 0,
            _id: '3',
            name: 'Module 3',
          },
        ],
        status: 'success',
      }

      mockGetMaintenanceStatus.mockResolvedValue(data)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isInMaintenance).toBe(true)
    })

    it('should handle large number of modules', async () => {
      const manyModules = Array.from({ length: 100 }, (_, i) => ({
        isActive: false,
        isBlocked: i === 50, // Only module 50 is blocked
        lastModifiedAt: '2024-01-01T00:00:00Z',
        lastModifiedBy: {
          _id: `admin${i}`,
          name: `Admin ${i}`,
          email: `admin${i}@example.com`,
        },
        moduleName: `module${i}`,
        __v: 0,
        _id: `${i}`,
        name: `Module ${i}`,
      }))

      mockGetMaintenanceStatus.mockResolvedValue({
        data: manyModules,
        status: 'success',
      })

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isInMaintenance).toBe(true)
    })
  })

  describe('Edge cases', () => {
    it('should handle null data gracefully', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(null as any)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isInMaintenance).toBe(false)
    })

    it('should handle module with isBlocked as undefined', async () => {
      const data: any = {
        data: [
          {
            ...mockMaintenanceData.data[0],
            isBlocked: undefined,
          },
        ],
        status: 'success',
      }

      mockGetMaintenanceStatus.mockResolvedValue(data)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isInMaintenance).toBe(false)
    })

    it('should handle module with isBlocked as null', async () => {
      const data: any = {
        data: [
          {
            ...mockMaintenanceData.data[0],
            isBlocked: null,
          },
        ],
        status: 'success',
      }

      mockGetMaintenanceStatus.mockResolvedValue(data)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isInMaintenance).toBe(false)
    })
  })

  describe('Return values', () => {
    it('should return all React Query properties', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(mockMaintenanceData)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current).toHaveProperty('data')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('isSuccess')
      expect(result.current).toHaveProperty('isError')
      expect(result.current).toHaveProperty('isInMaintenance')
      expect(result.current).toHaveProperty('refetch')
    })

    it('should allow manual refetch', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(mockMaintenanceData)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(1)

      // Manual refetch
      await result.current.refetch()

      expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(2)
    })

    it('should expose isStale property', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(mockMaintenanceData)

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current).toHaveProperty('isStale')
    })
  })

});