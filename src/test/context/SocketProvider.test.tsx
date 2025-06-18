import { SocketProvider, useSocketContext } from "@/context/SocketContext";
import { useSocket } from "@/hooks/useSocket";
import { render, screen } from "@testing-library/react";
import { Socket } from "socket.io-client";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/hooks/useSocket");

const mockUseSocket = vi.mocked(useSocket);

const MockComponent = () => {
  const { socket } = useSocketContext();
  return <div data-testid="socket-component">{socket ? "Connected" : "Disconnected"}</div>;
};

describe("SocketProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides socket context to children", () => {
    mockUseSocket.mockReturnValue({ socket: { connected: true } as Socket, online: false });
    render(
      <SocketProvider>
        <MockComponent />
      </SocketProvider>
    );
    expect(screen.getByTestId("socket-component")).toHaveTextContent("Connected");
  });

  it("handles socket disconnection", () => {
    mockUseSocket.mockReturnValue({ socket: null as unknown as Socket, online: false });
    render(
      <SocketProvider>
        <MockComponent />
      </SocketProvider>
    );
    expect(screen.getByTestId("socket-component")).toHaveTextContent("Disconnected");
  });
});
