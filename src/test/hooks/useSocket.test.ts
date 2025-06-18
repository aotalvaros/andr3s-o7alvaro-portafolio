/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSocket } from "@/hooks/useSocket";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { io } from "socket.io-client";

const onMock = vi.fn();
const offMock = vi.fn();
const disconnectMock = vi.fn();
const socketMock = {
    on: onMock,
    off: offMock,
    disconnect: disconnectMock,
};
const ioMock = vi.fn(() => socketMock);

vi.mock("socket.io-client");


describe("useSocket", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (global as any).window = {};

        vi.mocked(io).mockImplementation(ioMock as any) ;
    });

    it("returns a socket instance and online=false initially", () => {
        const { result } = renderHook(() => useSocket("ws://localhost"));
        expect(ioMock).toHaveBeenCalledWith("ws://localhost", { transports: ["websocket"] });
        expect(result.current.socket).toBe(socketMock);
        expect(result.current.online).toBe(false);
    });


    it("should set online=true on socket connect event", () => {
        let connectHandler: () => void = () => {};
        onMock.mockImplementation((event, cb) => {
            if (event === "connect") connectHandler = cb;
        });

        const { result } = renderHook(() => useSocket("ws://localhost"));
        expect(result.current.online).toBe(false);

        act(() => {
            connectHandler();
        });
        expect(result.current.online).toBe(true);
    });

    it("should set online=false on socket disconnect event", () => {
        let disconnectHandler: () => void = () => {};
        onMock.mockImplementation((event, cb) => {
            if (event === "disconnect") disconnectHandler = cb;
        });

        const { result } = renderHook(() => useSocket("ws://localhost"));
        act(() => {
            disconnectHandler();
        });

        expect(result.current.online).toBe(false);
    });

    it("should clean up event listeners on unmount", () => {
        const handleConnect = vi.fn();
        const handleDisconnect = vi.fn();
        onMock.mockImplementation((event, cb) => {
            if (event === "connect") handleConnect.mockImplementation(cb);
            if (event === "disconnect") handleDisconnect.mockImplementation(cb);
        });

        const { unmount } = renderHook(() => useSocket("ws://localhost"));
        unmount();
        expect(offMock).toHaveBeenCalledWith("connect", expect.any(Function));
        expect(offMock).toHaveBeenCalledWith("disconnect", expect.any(Function));
    });


    it("should create a new socket if serverPath changes", () => {
        const { rerender } = renderHook(
            ({ path }) => useSocket(path),
            { initialProps: { path: "ws://localhost" } }
        );
        expect(ioMock).toHaveBeenCalledWith("ws://localhost", { transports: ["websocket"] });

        rerender({ path: "ws://otherhost" });
        expect(ioMock).toHaveBeenCalledWith("ws://otherhost", { transports: ["websocket"] });
    });


    it("should not fail if disconnect is not defined on socket", () => {
        const socketWithoutDisconnect = {
            on: onMock,
            off: offMock,
        };
        ioMock.mockReturnValueOnce(socketWithoutDisconnect as any);
        const { unmount } = renderHook(() => useSocket("ws://localhost"));
        expect(() => unmount()).not.toThrow();
    });

    it("should keep the same socket instance if serverPath does not change", () => {
        const { result, rerender } = renderHook(
            ({ path }) => useSocket(path),
            { initialProps: { path: "ws://localhost" } }
        );
        const firstSocket = result.current.socket;
        rerender({ path: "ws://localhost" });
        expect(result.current.socket).toBe(firstSocket);
    });

    it("should handle multiple connect/disconnect events", () => {
        let connectHandler: () => void = () => {};
        let disconnectHandler: () => void = () => {};
        onMock.mockImplementation((event, cb) => {
            if (event === "connect") connectHandler = cb;
            if (event === "disconnect") disconnectHandler = cb;
        });

        const { result } = renderHook(() => useSocket("ws://localhost"));
        expect(result.current.online).toBe(false);

        act(() => {
            connectHandler();
        });
        expect(result.current.online).toBe(true);

        act(() => {
            disconnectHandler();
        });
        expect(result.current.online).toBe(false);

        act(() => {
            connectHandler();
        });
        expect(result.current.online).toBe(true);
    });
});