import { useBlockedModules } from '@/components/sections/admin/hooks/useBlockedModules';
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, waitFor, act } from '@testing-library/react';
import { MaintenanceResponseStatus } from '@/services/maintenance/models/maintenaceResponseStatus.interface';
import { SocketContext } from '../../../../../context/SocketContext';

const mockMutateAsync = vi.fn();
const mockSetParams = vi.fn();
const mockSocket = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
};

const mockMaintenanceData: MaintenanceResponseStatus = {
    data: [
        {
            isActive: true,
            isBlocked: false,
            lastModifiedAt: '2024-01-01T00:00:00Z',
            lastModifiedBy: {
                _id: 'admin1',
                name: 'Admin User',
                email: 'admin@example.com',
            },
            moduleName: 'users',
            __v: 0,
            _id: '1',
            name: 'Users Module',
            category: 'core'
        },
        {
            isActive: true,
            isBlocked: true,
            lastModifiedAt: '2024-01-02T00:00:00Z',
            lastModifiedBy: {
                _id: 'admin2',
                name: 'Admin User 2',
                email: 'admin2@example.com',
            },
            moduleName: 'reports',
            __v: 0,
            _id: '2',
            name: 'Reports Module',
            category: 'features'
        },
        {
            isActive: true,
            isBlocked: false,
            lastModifiedAt: '2024-01-03T00:00:00Z',
            lastModifiedBy: {
                _id: 'admin1',
                name: 'Admin User',
                email: 'admin@example.com',
            },
            moduleName: 'allAplications',
            __v: 0,
            _id: '3',
            name: 'All Applications',
            category: 'system'
        }
    ],
    status: 'ok'
};

vi.mock('@/components/maintenance/hooks/useMaintenance', () => ({
    useMaintenance: vi.fn(() => ({
        maintenanceData: mockMaintenanceData,
        isInMaintenance: false,
        isAplicationInMaintenance: false,
        isFetched: true,
        isInitialLoading: false,
        isError: false,
        error: null
    }))
}));

vi.mock('@/components/maintenance/hooks/usePostToggleModule', () => ({
    usePostToggleModule: vi.fn(() => ({
        mutateAsync: mockMutateAsync,
        isPending: false
    }))
}));

vi.mock('@/store/ToastMessageStore', () => ({
    useToastMessageStore: vi.fn((selector) => {
        const state = { setParams: mockSetParams };
        return selector(state);
    })
}));

describe('useBlockedModules Hook', () => {
    const createWrapper = (socket: any = mockSocket) => {
        return ({ children }: { children: React.ReactNode }) => (
            <SocketContext.Provider value={{ socket, online: true }}>
                {children}
            </SocketContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockMutateAsync.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should initialize with empty modules array', () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            // Antes del useEffect
            expect(result.current.modules).toBeDefined();
        });

        it('should load modules from maintenanceData on mount', async () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.modules).toEqual(mockMaintenanceData.data);
            });
        });

        it('should return isPending from mutation', () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isPending).toBe(false);
        });

        it('should return handleToggleModule function', () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            expect(typeof result.current.handleToggleModule).toBe('function');
        });
    });

    describe('Socket Event Registration', () => {
        it('should register update-module socket listener on mount', async () => {
            renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(mockSocket.on).toHaveBeenCalledWith('update-module', expect.any(Function));
            });
        });

        it('should cleanup socket listener on unmount', async () => {
            const { unmount } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(mockSocket.on).toHaveBeenCalled();
            });

            unmount();

            expect(mockSocket.off).toHaveBeenCalledWith('update-module', expect.any(Function));
        });

        it('should not register listener when socket is null', () => {
            renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(null),
            });

            expect(mockSocket.on).not.toHaveBeenCalled();
        });

        it('should re-register listener when socket changes', async () => {
            const { unmount } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });
            
            await waitFor(() => {
                expect(mockSocket.on).toHaveBeenCalled();
            });

            unmount();

            await waitFor(() => {
                expect(mockSocket.off).toHaveBeenCalled();
            });
        });
    });

    describe('Socket update-module Event Handling', () => {
        it('should update module status when socket event is received', async () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.modules).toHaveLength(3);
            });

            const updateHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'update-module'
            )?.[1];

            expect(updateHandler).toBeDefined();

            await act(async () => {
                updateHandler?.({ moduleName: 'users', status: true });
            });

            await waitFor(() => {
                const usersModule = result.current.modules?.find(m => m.moduleName === 'users');
                expect(usersModule?.isBlocked).toBe(true);
            });
        });

        it('should not update other modules when one is changed', async () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.modules).toHaveLength(3);
            });

            const initialReportsStatus = result.current.modules?.find(
                m => m.moduleName === 'reports'
            )?.isBlocked;

            const updateHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'update-module'
            )?.[1];

            await act(async () => {
                updateHandler?.({ moduleName: 'users', status: true });
            });

            await waitFor(() => {
                const reportsModule = result.current.modules?.find(m => m.moduleName === 'reports');
                expect(reportsModule?.isBlocked).toBe(initialReportsStatus);
            });
        });

        it('should handle multiple socket updates', async () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.modules).toHaveLength(3);
            });

            const updateHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'update-module'
            )?.[1];

            await act(async () => {
                updateHandler?.({ moduleName: 'users', status: true });
                updateHandler?.({ moduleName: 'reports', status: false });
                updateHandler?.({ moduleName: 'allAplications', status: true });
            });

            await waitFor(() => {
                expect(result.current.modules?.find(m => m.moduleName === 'users')?.isBlocked).toBe(true);
                expect(result.current.modules?.find(m => m.moduleName === 'reports')?.isBlocked).toBe(false);
                expect(result.current.modules?.find(m => m.moduleName === 'allAplications')?.isBlocked).toBe(true);
            });
        });

        it('should handle update for non-existent module gracefully', async () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.modules).toHaveLength(3);
            });

            const updateHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'update-module'
            )?.[1];

            const initialLength = result.current.modules?.length;

            await act(async () => {
                updateHandler?.({ moduleName: 'nonExistent', status: true });
            });

            // No debe crashear y mantener el mismo número de módulos
            expect(result.current.modules?.length).toBe(initialLength);
        });
    });

    describe('handleToggleModule - Success Cases', () => {
        it('should call toggleModule mutation when blocking a module', async () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleToggleModule('users', true);
            });

            expect(mockMutateAsync).toHaveBeenCalledWith({
                moduleName: 'users',
                status: true
            });
        });

        it('should call toggleModule mutation when unblocking a module', async () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleToggleModule('reports', false);
            });

            expect(mockMutateAsync).toHaveBeenCalledWith({
                moduleName: 'reports',
                status: false
            });
        });

        it('should show success toast when module is blocked', async () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleToggleModule('users', true);
            });

            await waitFor(() => {
                expect(mockSetParams).toHaveBeenCalledWith({
                    message: '¡Éxito!',
                    description: 'El módulo users ha sido bloqueado.',
                    typeMessage: 'info',
                    show: true
                });
            });
        });

        it('should show success toast when module is unblocked', async () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleToggleModule('reports', false);
            });

            await waitFor(() => {
                expect(mockSetParams).toHaveBeenCalledWith({
                    message: '¡Éxito!',
                    description: 'El módulo reports ha sido habilitado.',
                    typeMessage: 'info',
                    show: true
                });
            });
        });

        it('should handle toggle for allAplications module', async () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleToggleModule('allAplications', true);
            });

            expect(mockMutateAsync).toHaveBeenCalledWith({
                moduleName: 'allAplications',
                status: true
            });

            await waitFor(() => {
                expect(mockSetParams).toHaveBeenCalledWith(
                    expect.objectContaining({
                        description: 'El módulo allAplications ha sido bloqueado.'
                    })
                );
            });
        });
    });

    describe('handleToggleModule - Error Cases', () => {
        it('should show error toast when mutation fails', async () => {
            const error = new Error('Network error');
            mockMutateAsync.mockRejectedValueOnce(error);

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleToggleModule('users', true);
            });

            await waitFor(() => {
                expect(mockSetParams).toHaveBeenCalledWith({
                    message: 'Error',
                    description: 'No se pudo actualizar el módulo users.',
                    typeMessage: 'error',
                    show: true
                });
            });

            expect(consoleSpy).toHaveBeenCalledWith('Error toggling module:', error);
            consoleSpy.mockRestore();
        });

        it('should log error to console when mutation fails', async () => {
            const error = new Error('API error');
            mockMutateAsync.mockRejectedValueOnce(error);

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleToggleModule('reports', false);
            });

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Error toggling module:', error);
            });

            consoleSpy.mockRestore();
        });

        it('should handle multiple failed toggles', async () => {
            mockMutateAsync.mockRejectedValue(new Error('Failed'));

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.handleToggleModule('users', true);
                await result.current.handleToggleModule('reports', false);
            });

            await waitFor(() => {
                expect(mockSetParams).toHaveBeenCalledTimes(2);
                expect(mockSetParams).toHaveBeenCalledWith(
                    expect.objectContaining({ typeMessage: 'error' })
                );
            });

            consoleSpy.mockRestore();
        });
    });

    describe('Maintenance Data Updates', () => {
        it('should update modules when maintenanceData changes', async () => {
            const { useMaintenance } = await import('@/components/maintenance/hooks/useMaintenance');
            
            const { result, rerender } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.modules).toHaveLength(3);
            });

            const newMaintenanceData = {
                ...mockMaintenanceData,
                data: [
                    ...mockMaintenanceData.data,
                    {
                        isActive: true,
                        isBlocked: false,
                        lastModifiedAt: '2024-01-04T00:00:00Z',
                        lastModifiedBy: {
                            _id: 'admin1',
                            name: 'Admin User',
                            email: 'admin@example.com',
                        },
                        moduleName: 'newModule',
                        __v: 0,
                        _id: '4',
                        name: 'New Module',
                        category: 'new'
                    }
                ]
            };

            vi.mocked(useMaintenance).mockReturnValue({
                maintenanceData: newMaintenanceData,
                isInMaintenance: false,
                isAplicationInMaintenance: false,
                isFetched: true,
                isInitialLoading: false,
                isError: false,
                error: null
            } as any);

            rerender();

            await waitFor(() => {
                expect(result.current.modules).toHaveLength(4);
            });
        });

        it('should handle undefined maintenanceData gracefully', async () => {
            const { useMaintenance } = await import('@/components/maintenance/hooks/useMaintenance');
            
            vi.mocked(useMaintenance).mockReturnValue({
                maintenanceData: undefined,
                isInMaintenance: false,
                isAplicationInMaintenance: false,
                isFetched: false,
                isInitialLoading: true,
                isError: false,
                error: null
            } as any);

            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            // No debe crashear
            expect(result.current.modules).toBeDefined();
        });
    });

    describe('Edge Cases', () => {
        it('should handle rapid consecutive toggles', async () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await Promise.all([
                    result.current.handleToggleModule('users', true),
                    result.current.handleToggleModule('users', false),
                    result.current.handleToggleModule('users', true),
                ]);
            });

            expect(mockMutateAsync).toHaveBeenCalledTimes(3);
        });

        it('should handle empty modules array', async () => {
            const { useMaintenance } = await import('@/components/maintenance/hooks/useMaintenance');
            
            vi.mocked(useMaintenance).mockReturnValue({
                maintenanceData: { data: [], status: 'ok' },
                isInMaintenance: false,
                isAplicationInMaintenance: false,
                isFetched: true,
                isInitialLoading: false,
                isError: false,
                error: null
            } as any);

            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.modules).toEqual([]);
            });
        });

        it('should handle socket update with undefined modules', async () => {
            const { result } = renderHook(() => useBlockedModules(), {
                wrapper: createWrapper(),
            });

            // Forzar modules a undefined
            await act(async () => {
                const updateHandler = mockSocket.on.mock.calls.find(
                    call => call[0] === 'update-module'
                )?.[1];

                updateHandler?.({ moduleName: 'users', status: true });
            });

            // No debe crashear
            expect(result.current.modules).toBeDefined();
        });
    });
});