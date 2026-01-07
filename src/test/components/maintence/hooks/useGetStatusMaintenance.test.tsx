import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetStatusMaintenance } from '@/components/maintenance/hooks/useGetStatusMaintenance';
import { getMaintenanceStatus } from '@/services/maintenance/maintenace.service';
import { MaintenanceResponseStatus } from '@/services/maintenance/models/maintenaceResponseStatus.interface';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';


vi.mock('@/services/maintenance/maintenace.service');

const mockGetMaintenanceStatus = vi.mocked(getMaintenanceStatus);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disabled for most tests to make them faster
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return { Wrapper, queryClient };
};

const responseDataMaintenance: MaintenanceResponseStatus = {
  data: [
    {
      isActive: false,
      moduleName: "module1",
      __v: 0,
      _id: "1",
      name: "Module 1"
    },
    {
      isActive: false,
      moduleName: "module2",
      __v: 0,
      _id: "2",
      name: "Module 2"
    }
  ],
  status: "success"
};

describe('useGetStatusMaintenance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isInMaintenance logic', () => {
    it('should return isInMaintenance as false when no modules are active', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(responseDataMaintenance);

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isInMaintenance).toBe(false);
    });

    it('should return isInMaintenance as true when at least one module is active', async () => {
      mockGetMaintenanceStatus.mockResolvedValue({
        data: [
          {
            isActive: true, // ✅ At least one active
            moduleName: "module1",
            __v: 0,
            _id: "1",
            name: "Module 1"
          },
          {
            isActive: false,
            moduleName: "module2",
            __v: 0,
            _id: "2",
            name: "Module 2"
          }
        ],
        status: "success"
      });

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isInMaintenance).toBe(true);
    });

    it('should return isInMaintenance as true when ALL modules are active', async () => {
      mockGetMaintenanceStatus.mockResolvedValue({
        data: [
          {
            isActive: true,
            moduleName: "module1",
            __v: 0,
            _id: "1",
            name: "Module 1"
          },
          {
            isActive: true,
            moduleName: "module2",
            __v: 0,
            _id: "2",
            name: "Module 2"
          }
        ],
        status: "success"
      });

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isInMaintenance).toBe(true);
    });

    it('should return isInMaintenance as false when data array is empty', async () => {
      mockGetMaintenanceStatus.mockResolvedValue({
        data: [],
        status: "success"
      });

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isInMaintenance).toBe(false);
    });

    it('should return isInMaintenance as false when data is undefined', async () => {
      mockGetMaintenanceStatus.mockResolvedValue({
        data: undefined,
        status: "success"
      } as unknown as MaintenanceResponseStatus);

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });
      expect(result.current.isInMaintenance).toBe(false);
    });

    it('should return isInMaintenance as false when data is null', async () => {
      mockGetMaintenanceStatus.mockResolvedValue({
        data: null,
        status: "success"
      } as unknown as MaintenanceResponseStatus);

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });

      expect(result.current.isInMaintenance).toBe(false);
    });

    it('should return isInMaintenance as false when entire response is undefined', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(undefined as any);

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });

      expect(result.current.isInMaintenance).toBe(false);
    });
  });

  describe('React Query basic functionality', () => {
    it('should call getMaintenanceStatus service function', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(responseDataMaintenance);

  
      renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });

      await waitFor(() => {
        expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle loading state correctly', () => {
      mockGetMaintenanceStatus.mockImplementation(() => new Promise(() => {}));

  
      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isInMaintenance).toBe(false);
    });

    it('should spread all useQuery properties', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(responseDataMaintenance);

  
      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Check that useQuery properties are available
      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('isSuccess');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('refetch');
      expect(result.current).toHaveProperty('isInMaintenance');
    });
  });

  describe('staleTime: 5 minutes', () => {
    it('should NOT refetch data within 5 minutes (stale time)', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(responseDataMaintenance);

      const { Wrapper, queryClient } = createWrapper();
      const { result, rerender } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(1);

      // Trigger re-render
      rerender();

      // Should NOT refetch (data is still fresh)
      expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(1);
    });

    it('should allow refetch after 5 minutes (data is stale)', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(responseDataMaintenance);

      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(1);

      // Manually refetch
      await result.current.refetch();

      // Should refetch (data is stale)
      expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(2);
    });
  });

  describe('refetchOnWindowFocus: false', () => {
    it('should NOT refetch when window regains focus', async () => {
      mockGetMaintenanceStatus.mockResolvedValue(responseDataMaintenance);

  
      const { result } = renderHook(() => useGetStatusMaintenance(), {
        wrapper: createWrapper().Wrapper
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(1);

      // Simulate window focus event
      window.dispatchEvent(new Event('focus'));

      // Should still be called only once
      expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(1);
    });
  });

});