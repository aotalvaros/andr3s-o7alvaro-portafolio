/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMaintenance } from "@/components/maintenance/hooks/useMaintenance";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useGetStatusMaintenance } from "@/components/maintenance/hooks/useGetStatusMaintenance";
import React from "react";
import { MaintenanceResponseStatus } from "@/services/maintenance/models/maintenaceResponseStatus.interface";
import { SocketContext } from "@/context/SocketContext";

// Mock de usePathname
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/test-path')
}));

// Mock de useGetStatusMaintenance
vi.mock("@/components/maintenance/hooks/useGetStatusMaintenance");

// Mock de la función paths
vi.mock('@/constants/path.constants', () => ({
  paths: vi.fn(() => 'testModule')
}));

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
                moduleName: "testModule",
                __v: 0,
                _id: "1",
                name: "Test Module"
            },
            {
                isActive: false,
                moduleName: "allAplications",
                __v: 0,
                _id: "2",
                name: "All Applications"
            }
        ],
        status: "ok",
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useGetStatusMaintenance).mockReturnValue({
            data: mockResponderData,
            isLoading: false,
            isFetched: true,
            isError: false,
            error: null
        } as unknown as ReturnType<typeof useGetStatusMaintenance>);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should return maintenance status based on maintenanceData", async () => {
        const { result } = renderHook(() => useMaintenance(), {
            wrapper: ({ children }: { children: React.ReactNode }) => (
                <SocketContext.Provider value={{ socket: mockSocket as any, online: true }}>
                    {children}
                </SocketContext.Provider>
            ),
        });

        // Esperar a que el useEffect se ejecute
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

        // Verificar que se registraron los event listeners del socket
        expect(mockSocket.on).toHaveBeenCalledWith('init-module-status', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('update-module', expect.any(Function));
    });

    it("should handle socket update-module event", async () => {
        const { result } = renderHook(() => useMaintenance(), {
            wrapper: ({ children }: { children: React.ReactNode }) => (
                <SocketContext.Provider value={{ socket: mockSocket as any, online: true }}>
                    {children}
                </SocketContext.Provider>
            ),
        });

        // Obtener el handler del evento 'update-module'
        const updateModuleHandler = mockSocket.on.mock.calls.find(
            call => call[0] === 'update-module'
        )?.[1];

        expect(updateModuleHandler).toBeDefined();

        // Simular evento de actualización
        await act(async () => {
            updateModuleHandler?.({ moduleName: 'testModule', status: false });
        })

        await waitFor(() => {
            expect(result.current.isInMaintenance).toBe(false);
        });
    });

    it("should cleanup socket listeners on unmount", () => {
        const { unmount } = renderHook(() => useMaintenance(), {
            wrapper: ({ children }: { children: React.ReactNode }) => (
                <SocketContext.Provider value={{ socket: mockSocket as any, online: true }}>
                    {children}
                </SocketContext.Provider>
            ),
        });

        unmount();

        expect(mockSocket.off).toHaveBeenCalledWith('init-module-status', expect.any(Function));
        expect(mockSocket.off).toHaveBeenCalledWith('update-module');
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
});