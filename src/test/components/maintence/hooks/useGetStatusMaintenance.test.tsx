import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetStatusMaintenance } from '@/components/maintenance/hooks/useGetStatusMaintenance';
import { getMaintenanceStatus } from '@/services/maintenance/maintenace.service';
import { MaintenanceResponseStatus } from '@/services/maintenance/models/maintenaceResponseStatus.interface';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock the service
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


const responseDataMaintences: MaintenanceResponseStatus = {
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
}

describe('useGetStatusMaintenance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return isInMaintenance as false when no data is available', async () => {
    mockGetMaintenanceStatus.mockResolvedValue(responseDataMaintences);

    const { result } = renderHook(() => useGetStatusMaintenance(), {
      wrapper: createWrapper()
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
            isActive: true,
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
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isInMaintenance).toBe(true);
  });

//   it('should return isInMaintenance as false when no modules are active', async () => {
//     mockGetMaintenanceStatus.mockResolvedValue({
//       data: [
//         { id: 1, name: 'module1', isActive: false },
//         { id: 2, name: 'module2', isActive: false },
//         { id: 3, name: 'module3', isActive: false },
//       ]
//     });

//     const { result } = renderHook(() => useGetStatusMaintenance(), {
//       wrapper: createWrapper(),
//     });

//     await waitFor(() => {
//       expect(result.current.isSuccess).toBe(true);
//     });

//     expect(result.current.isInMaintenance).toBe(false);
//   });

//   it('should return isInMaintenance as false when data is undefined', async () => {
//     mockGetMaintenanceStatus.mockResolvedValue({});

//     const { result } = renderHook(() => useGetStatusMaintenance(), {
//       wrapper: createWrapper(),
//     });

//     await waitFor(() => {
//       expect(result.current.isSuccess).toBe(true);
//     });

//     expect(result.current.isInMaintenance).toBe(false);
//   });

//   it('should call getMaintenanceStatus service function', () => {
//     mockGetMaintenanceStatus.mockResolvedValue({
//       data: []
//     });

//     renderHook(() => useGetStatusMaintenance(), {
//       wrapper: createWrapper(),
//     });

//     expect(mockGetMaintenanceStatus).toHaveBeenCalledTimes(1);
//   });

//   it('should use correct query key', async () => {
//     mockGetMaintenanceStatus.mockResolvedValue({
//       data: []
//     });

//     const { result } = renderHook(() => useGetStatusMaintenance(), {
//       wrapper: createWrapper(),
//     });

//     await waitFor(() => {
//       expect(result.current.isSuccess).toBe(true);
//     });

//     expect(result.current.queryKey).toEqual(['maintenanceStatus']);
//   });

//   it('should handle loading state correctly', () => {
//     mockGetMaintenanceStatus.mockImplementation(() => new Promise(() => {}));

//     const { result } = renderHook(() => useGetStatusMaintenance(), {
//       wrapper: createWrapper(),
//     });

//     expect(result.current.isLoading).toBe(true);
//     expect(result.current.isInMaintenance).toBe(false);
//   });

//   it('should handle error state correctly', async () => {
//     const mockError = new Error('Service error');
//     mockGetMaintenanceStatus.mkRejectedValue(mockError);

//     const { result } = renderHook(() => useGetStatusMaintenance(), {
//       wrapper: createWrapper(),
//     });

//     await waitFor(() => {
//       expect(result.current.isError).toBe(true);
//     });

//     expect(result.current.isInMaintenance).toBe(false);
//     expect(result.current.error).toBe(mockError);
//   });

//   it('should spread all useQuery properties', async () => {
//     mockGetMaintenanceStatus.mockResolvedValue({
//       data: []
//     });

//     const { result } = renderHook(() => useGetStatusMaintenance(), {
//       wrapper: createWrapper(),
//     });

//     await waitFor(() => {
//       expect(result.current.isSuccess).toBe(true);
//     });

//     // Check that useQuery properties are available
//     expect(result.current).toHaveProperty('data');
//     expect(result.current).toHaveProperty('isLoading');
//     expect(result.current).toHaveProperty('isError');
//     expect(result.current).toHaveProperty('isSuccess');
//     expect(result.current).toHaveProperty('error');
//     expect(result.current).toHaveProperty('refetch');
//     expect(result.current).toHaveProperty('isInMaintenance');
//   });

//   it('should return isInMaintenance as false when data.data is null', async () => {
//     mockGetMaintenanceStatus.mockResolvedValue({
//       data: null
//     });

//     const { result } = renderHook(() => useGetStatusMaintenance(), {
//       wrapper: createWrapper(),
//     });

//     await waitFor(() => {
//       expect(result.current.isSuccess).toBe(true);
//     });

//     expect(result.current.isInMaintenance).toBe(false);
//   });
});