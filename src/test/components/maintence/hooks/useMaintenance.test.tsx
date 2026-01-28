/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useGetStatusMaintenance } from "@/components/maintenance/hooks/useGetStatusMaintenance";
import React from "react";
import { MaintenanceResponseStatus } from "@/services/maintenance/models/maintenaceResponseStatus.interface";
import { SocketContext } from "@/context/SocketContext";
import { useLoadingStore } from '../../../../store/loadingStore';

const mockUsePathname = vi.fn(() => '/test-path');
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname()
}));


vi.mock("@/components/maintenance/hooks/useGetStatusMaintenance");

const mockPaths = vi.fn(() => 'testModule');
vi.mock('@/constants/path.constants', () => ({
  paths: (pathname: string) => mockPaths()
}));


const mockRefetch = vi.fn();
const mockSetLoading = vi.fn();
const mockGetState = vi.fn(() => ({ setLoading: mockSetLoading }));

vi.mock("@/store/loadingStore");

describe("useMaintenance", () => {
    const mockSocket = {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
    };

    const mockResponderData: MaintenanceResponseStatus = {
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
                moduleName: "testModule",
                __v: 0,
                _id: "1",
                name: "Test Module",
                category: "testing"
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
                moduleName: "allAplications",
                __v: 0,
                _id: "2",
                name: "All Applications",
                category: "general"
            }
        ],
        status: "ok",
    };

    const createWrapper = (socket: any = mockSocket, online: boolean = true) => {
        return ({ children }: { children: React.ReactNode }) => (
            <SocketContext.Provider value={{ socket, online }}>
                {children}
            </SocketContext.Provider>
        );
    };


    beforeEach(() => {
        vi.clearAllMocks();
        mockRefetch.mockResolvedValue({});

        vi.mocked(useGetStatusMaintenance).mockReturnValue({
            data: mockResponderData,
            isLoading: false,
            isFetched: true,
            isError: false,
            error: null,
            refetch: mockRefetch
        } as unknown as ReturnType<typeof useGetStatusMaintenance>);

        vi.mocked(useLoadingStore).mockImplementation((selector: any) => {
            const state = {
                setLoading: mockSetLoading,
                isLoading: false,
            }
            return selector ? selector(state) : state
        })
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should handle when socket is not available", () => {
        const { result } = renderHook(() => useMaintenance(), {
            wrapper: ({ children }: { children: React.ReactNode }) => (
                <SocketContext.Provider value={{ socket: null, online: false }}>
                    {children}
                </SocketContext.Provider>
            ),
        });

        expect(result.current.isInMaintenance).toBe(true);
        expect(mockSocket.on).not.toHaveBeenCalled();
    });

    describe("Initialization", () => {
        it("should set loading to false on mount", async () => {
            renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(mockSetLoading).toHaveBeenCalledWith(false);
            });
        });

        it("should return correct initial state when module is in maintenance", async () => {
            const { result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isInMaintenance).toBe(true);
            });

            expect(result.current).toEqual({
                isAplicationInMaintenance: false,
                isInMaintenance: true,
                maintenanceData: mockResponderData,
                isFetched: true,
                isInitialLoading: false,
                isError: false,
                error: null,
            });
        });

        it("should register socket event listeners on mount", async () => {
            renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(mockSocket.on).toHaveBeenCalledWith('init-module-status', expect.any(Function));
                expect(mockSocket.on).toHaveBeenCalledWith('update-module', expect.any(Function));
            });
        });
    });

    describe("Maintenance Status Detection", () => {
        it("should detect maintenance when current module is blocked", async () => {
            const { result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isInMaintenance).toBe(true);
            });
        });

        it("should not be in maintenance when module is not blocked", async () => {
            mockPaths.mockReturnValue('otherModule');
            
            const { result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isInMaintenance).toBe(false);
            });
        });

        it("should detect when all applications are in maintenance", async () => {
            vi.mocked(useGetStatusMaintenance).mockReturnValue({
                data: {
                    data:[
                        {
                            isActive: true,
                            isBlocked: true,
                            lastModifiedAt: '2024-01-01T00:00:00Z',
                            lastModifiedBy: {
                                _id: 'admin2',
                                name: 'Admin User 2',
                                email: 'admin2@example.com',
                            },
                            moduleName: "allAplications",
                            __v: 0,
                            _id: "2",
                            name: "All Applications",
                            category: "general"
                        }
                    ]
                },
                isLoading: false,
                isFetched: true,
                isError: false,
                error: null,
                refetch: mockRefetch
            } as unknown as ReturnType<typeof useGetStatusMaintenance>);

            const { result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isAplicationInMaintenance).toBe(true);
            });
        });

        it("should set maintenance when API returns error status", async () => {
            vi.mocked(useGetStatusMaintenance).mockReturnValue({
                data: {
                    ...mockResponderData,
                    status: "error"
                },
                isLoading: false,
                isFetched: true,
                isError: false,
                error: null,
                refetch: mockRefetch
            } as unknown as ReturnType<typeof useGetStatusMaintenance>);

            const { result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isInMaintenance).toBe(true);
            });
        });
    });

    describe("Socket Events", () => {
        it("should handle init-module-status event", async () => {
            const { result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            const initHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'init-module-status'
            )?.[1];

            expect(initHandler).toBeDefined();

            await act(async () => {
                initHandler?.({ 
                    testModule: false, 
                    allAplications: true 
                });
            });

            await waitFor(() => {
                expect(result.current.isInMaintenance).toBe(false);
                expect(result.current.isAplicationInMaintenance).toBe(true);
            });
        });

        it("should handle update-module event for current module", async () => {
            const { result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            const updateHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'update-module'
            )?.[1];

            expect(updateHandler).toBeDefined();

            await act(async () => {
                updateHandler?.({ moduleName: 'testModule', status: false });
            });

            await waitFor(() => {
                expect(result.current.isInMaintenance).toBe(false);
                expect(mockRefetch).toHaveBeenCalledTimes(1);
            });
        });

        it("should handle update-module event for allAplications", async () => {
            const { result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            const updateHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'update-module'
            )?.[1];

            await act(async () => {
                updateHandler?.({ moduleName: 'allAplications', status: true });
            });

            await waitFor(() => {
                expect(result.current.isAplicationInMaintenance).toBe(true);
                expect(mockRefetch).toHaveBeenCalledTimes(1);
            });
        });

        it("should not update state when update-module is for different module", async () => {
            const { result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            const initialMaintenance = result.current.isInMaintenance;

            const updateHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'update-module'
            )?.[1];

            await act(async () => {
                updateHandler?.({ moduleName: 'differentModule', status: false });
            });

            // Debe llamar refetch pero no cambiar el estado del módulo actual
            await waitFor(() => {
                expect(mockRefetch).toHaveBeenCalledTimes(1);
            });

            expect(result.current.isInMaintenance).toBe(initialMaintenance);
        });
    });

    describe("Socket Cleanup", () => {
        it("should cleanup socket listeners on unmount", () => {
            const { unmount } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            unmount();

            expect(mockSocket.off).toHaveBeenCalledWith('init-module-status', expect.any(Function));
            expect(mockSocket.off).toHaveBeenCalledWith('update-module');
        });

        it("should re-register listeners when pathname changes", async () => {
            const { rerender } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            mockUsePathname.mockReturnValue('/new-path');
            mockPaths.mockReturnValue('newModule');

            rerender();

            await waitFor(() => {
                expect(mockSocket.off).toHaveBeenCalled();
                expect(mockSocket.on).toHaveBeenCalledTimes(4); // 2 inicial + 2 después del cambio
            });
        });

    });

    describe("Edge Cases", () => {
        it("should handle when maintenanceData is undefined", () => {
            vi.mocked(useGetStatusMaintenance).mockReturnValue({
                data: undefined,
                isLoading: true,
                isFetched: false,
                isError: false,
                error: null,
                refetch: mockRefetch
            } as unknown as ReturnType<typeof useGetStatusMaintenance>);

            const { result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isInMaintenance).toBe(false);
            expect(result.current.maintenanceData).toBeUndefined();
        });

        it("should handle error state from useGetStatusMaintenance", () => {
            const mockError = new Error('Network error');
            vi.mocked(useGetStatusMaintenance).mockReturnValue({
                data: undefined,
                isLoading: false,
                isFetched: true,
                isError: true,
                error: mockError,
                refetch: mockRefetch
            } as unknown as ReturnType<typeof useGetStatusMaintenance>);

            const { result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isError).toBe(true);
            expect(result.current.error).toBe(mockError);
        });

        it("should handle loading state", () => {
            vi.mocked(useGetStatusMaintenance).mockReturnValue({
                data: undefined,
                isLoading: true,
                isFetched: false,
                isError: false,
                error: null,
                refetch: mockRefetch
            } as unknown as ReturnType<typeof useGetStatusMaintenance>);

            const { result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isInitialLoading).toBe(true);
            expect(result.current.isFetched).toBe(false);
        });
    });

    describe("Path Integration", () => {
        it("should update maintenance status when pathname changes", async () => {
            mockUsePathname.mockReturnValue('/test-path');
            mockPaths.mockReturnValue('testModule');

            const { rerender, result } = renderHook(() => useMaintenance(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isInMaintenance).toBe(true);
            });

            // Cambiar pathname a un módulo no bloqueado
            mockUsePathname.mockReturnValue('/other-path');
            mockPaths.mockReturnValue('otherModule');

            rerender();

            await waitFor(() => {
                expect(result.current.isInMaintenance).toBe(false);
            });
        });
    });
});