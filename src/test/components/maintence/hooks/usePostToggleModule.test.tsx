/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePostToggleModule } from "../../../../components/maintenance/hooks/usePostToggleModule";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  toggleModule,
  ToggleModuleResponse,
} from "../../../../services/maintenance/toggleModule.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ToggleModuleRequest } from "../../../../services/maintenance/models/toggleModuleRequest.interface";

// Mock de toggleModule
vi.mock("../../../../services/maintenance/toggleModule.service");

const mockToggleModule = vi.mocked(toggleModule);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { Wrapper, queryClient };
};

describe("usePostToggleModule", () => {
  const mockRequest: ToggleModuleRequest = {
    moduleName: "module-123",
    status: true,
  };

  const mockSuccessResponse: ToggleModuleResponse = {
    data: {
      moduleName: "testModule",
      status: true,
    },
    message: "Module toggled successfully",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {}); // Suppress logs
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with idle state", () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isIdle).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it("should expose mutate and mutateAsync functions", () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      expect(result.current.mutate).toBeDefined();
      expect(typeof result.current.mutate).toBe("function");
      expect(result.current.mutateAsync).toBeDefined();
      expect(typeof result.current.mutateAsync).toBe("function");
    });
  });

  describe("Successful toggle operations", () => {
    it("should toggle module to blocked state", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync(mockRequest);
      });

      expect(mockToggleModule).toHaveBeenCalledWith(mockRequest);
      expect(mockToggleModule).toHaveBeenCalledTimes(1);
      
      await waitFor(() => {
        expect(result.current.data).toEqual(mockSuccessResponse);
      })
    });

    it("should toggle module to unblocked state", async () => {
      const unblockRequest: ToggleModuleRequest = {
        moduleName: "module-123",
        status: false,
      };

      const unblockResponse: ToggleModuleResponse = {
        message: "Module unblocked successfully",
        data: {
          moduleName: "module-123",
          status: false,
        },
      };

      mockToggleModule.mockResolvedValue(unblockResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync(unblockRequest);
      });

      expect(mockToggleModule).toHaveBeenCalledWith(unblockRequest);
    });

    it("should handle different module IDs", async () => {
      const moduleNames = [
        "module-1",
        "module-2",
        "module-3",
        "module-abc-123",
      ];

      for (const moduleName of moduleNames) {
        mockToggleModule.mockResolvedValue({
          message: "Success",
          data: { moduleName: moduleName, status: true },
        });

        const { Wrapper } = createWrapper();
        const { result } = renderHook(() => usePostToggleModule(), {
          wrapper: Wrapper,
        });

        await act(async () => {
          await result.current.mutateAsync({
            moduleName: moduleName,
            status: true,
          });
        });

        expect(mockToggleModule).toHaveBeenCalledWith(
          expect.objectContaining({ moduleName: moduleName })
        );

        vi.clearAllMocks();
      }
    });

    it("should update isPending state during mutation", async () => {
      mockToggleModule.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockSuccessResponse), 50)
          )
      );

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      const mutationPromise = act(async () => {
        await result.current.mutateAsync(mockRequest);
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      await mutationPromise;

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it("should return response data", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      let response: ToggleModuleResponse | undefined;

      await act(async () => {
        response = await result.current.mutateAsync(mockRequest);
      });

      expect(response).toEqual(mockSuccessResponse);
    });
  });

  describe("Error handling", () => {
    it("should handle mutation errors", async () => {
      const error = new Error("Failed to toggle module");
      mockToggleModule.mockRejectedValue(error);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync(mockRequest);
        } catch (e) {
          console.log(e);
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBeDefined();
        expect(result.current.data).toBeUndefined();
      });
    });

    it("should handle network errors", async () => {
      mockToggleModule.mockRejectedValue(new Error("Network error"));

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await expect(
        act(async () => {
          await result.current.mutateAsync(mockRequest);
        })
      ).rejects.toThrow("Network error");

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      })
    });

    it("should handle 401 unauthorized errors", async () => {
      mockToggleModule.mockRejectedValue(new Error("Unauthorized"));

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await expect(
        act(async () => {
          await result.current.mutateAsync(mockRequest);
        })
      ).rejects.toThrow("Unauthorized");
    });

    it("should handle 403 forbidden errors", async () => {
      mockToggleModule.mockRejectedValue(new Error("Forbidden"));

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await expect(
        act(async () => {
          await result.current.mutateAsync(mockRequest);
        })
      ).rejects.toThrow("Forbidden");
    });

    it("should handle 404 not found errors", async () => {
      mockToggleModule.mockRejectedValue(new Error("Module not found"));

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await expect(
        act(async () => {
          await result.current.mutateAsync(mockRequest);
        })
      ).rejects.toThrow("Module not found");
    });

    it("should handle 500 server errors", async () => {
      mockToggleModule.mockRejectedValue(new Error("Internal server error"));

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await expect(
        act(async () => {
          await result.current.mutateAsync(mockRequest);
        })
      ).rejects.toThrow("Internal server error");
    });

    it("should set isPending to false after error", async () => {
      mockToggleModule.mockRejectedValue(new Error("Test error"));

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync(mockRequest);
        } catch (e) {
            console.log(e);
        }
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
        expect(result.current.isError).toBe(true);
      });
    });

    it("should allow retry after error", async () => {
      mockToggleModule
        .mockRejectedValueOnce(new Error("First attempt failed"))
        .mockResolvedValueOnce(mockSuccessResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      // First attempt - fails
      await act(async () => {
        try {
          await result.current.mutateAsync(mockRequest);
        } catch (e) {
          console.log(e)
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      })

      // Second attempt - succeeds
      await act(async () => {
        await result.current.mutateAsync(mockRequest);
      });

     await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data).toEqual(mockSuccessResponse);
     });
    });
  });

  describe("Mutation callbacks", () => {
    it("should call onSuccess callback", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const onSuccess = vi.fn();
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync(mockRequest, {
          onSuccess,
        });
      });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(
          mockSuccessResponse,
          mockRequest,
          undefined
        );
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it("should call onError callback", async () => {
      const error = new Error("Test error");
      mockToggleModule.mockRejectedValue(error);

      const onError = vi.fn();
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync(mockRequest, {
            onError,
          });
        } catch (e) {
          console.log(e)
        }
      });

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error, mockRequest, undefined);
        expect(onError).toHaveBeenCalledTimes(1);
      });
    });

    it("should call onSettled callback on success", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const onSettled = vi.fn();
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync(mockRequest, {
          onSettled,
        });
      });

      await waitFor(() => {
        expect(onSettled).toHaveBeenCalledWith(
          mockSuccessResponse,
          null,
          mockRequest,
          undefined
        );
        expect(onSettled).toHaveBeenCalledTimes(1);
      });
    });

    it("should call onSettled callback on error", async () => {
      const error = new Error("Test error");
      mockToggleModule.mockRejectedValue(error);

      const onSettled = vi.fn();
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync(mockRequest, {
            onSettled,
          });
        } catch (e) {
          console.log(e);
        }
      });

      await waitFor(() => {
        expect(onSettled).toHaveBeenCalledWith(
          undefined,
          error,
          mockRequest,
          undefined
        );
        expect(onSettled).toHaveBeenCalledTimes(1);
      });
    });

    it("should call multiple callbacks in correct order", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const callOrder: string[] = [];
      const onSuccess = vi.fn(() => callOrder.push("success"));
      const onSettled = vi.fn(() => callOrder.push("settled"));

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync(mockRequest, {
          onSuccess,
          onSettled,
        });
      });

      await waitFor(() => {
        expect(callOrder).toEqual(["success", "settled"]);
      });
    });
  });

  describe("Multiple mutations", () => {
    it("should handle sequential mutations", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({
          moduleName: "module-1",
          status: true,
        });
      });

      await act(async () => {
        await result.current.mutateAsync({
          moduleName: "module-2",
          status: false,
        });
      });

      await act(async () => {
        await result.current.mutateAsync({
          moduleName: "module-3",
          status: true,
        });
      });

      expect(mockToggleModule).toHaveBeenCalledTimes(3);
    });

    it("should handle rapid consecutive mutations", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      const mutations = [
        { moduleName: "module-1", status: true },
        { moduleName: "module-2", status: false },
        { moduleName: "module-3", status: true },
        { moduleName: "module-4", status: false },
      ];

      for (const mutation of mutations) {
        await act(async () => {
          await result.current.mutateAsync(mutation);
        });
      }

      expect(mockToggleModule).toHaveBeenCalledTimes(4);
    });

    it("should maintain state between mutations", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync(mockRequest);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      })

      await act(async () => {
        await result.current.mutateAsync({
          ...mockRequest,
          moduleName: "module-2",
        });
      });

      expect(result.current.isSuccess).toBe(true);
      expect(mockToggleModule).toHaveBeenCalledTimes(2);
    });
  });

  describe("Reset functionality", () => {
    it("should allow resetting mutation state", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync(mockRequest);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(false);
        expect(result.current.data).toBeDefined();
      });

      act(() => {
        result.current.reset();
      });

      await waitFor(() => {
        expect(result.current.isIdle).toBe(true);
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toBeNull();
      });
    });

    it("should reset error state", async () => {
      const error = new Error("Test error");
      mockToggleModule.mockRejectedValue(error);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync(mockRequest);
        } catch (e) {
          console.log(e);
        }
      });

      // Wait for error state to be set
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);

      act(() => {
        result.current.reset();
      });

      //   expect(result.current.isIdle).toBe(true)
      //   expect(result.current.error).toBeNull()
      await waitFor(() => {
        expect(result.current.isIdle).toBe(true);
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle empty moduleName", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({ moduleName: "", status: true });
      });

      expect(mockToggleModule).toHaveBeenCalledWith({
        moduleName: "",
        status: true,
      });
    });

    it("should handle very long moduleName", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      const longId = "a".repeat(1000);

      await act(async () => {
        await result.current.mutateAsync({ moduleName: longId, status: true });
      });

      expect(mockToggleModule).toHaveBeenCalledWith({
        moduleName: longId,
        status: true,
      });
    });

    it("should handle special characters in moduleName", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      const specialId = "module-!@#$%^&*()_+-=[]{}|;:,.<>?";

      await act(async () => {
        await result.current.mutateAsync({
          moduleName: specialId,
          status: true,
        });
      });

      expect(mockToggleModule).toHaveBeenCalledWith({
        moduleName: specialId,
        status: true,
      });
    });
  });

  describe("Using mutate (non-async)", () => {
    it("should work with mutate function", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current.mutate(mockRequest);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data).toEqual(mockSuccessResponse);
      });
    });

    it("should call mutate callbacks", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const onSuccess = vi.fn();
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current.mutate(mockRequest, { onSuccess });
      });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("Type safety", () => {
    it("should accept valid ToggleModuleRequest", async () => {
      mockToggleModule.mockResolvedValue(mockSuccessResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => usePostToggleModule(), {
        wrapper: Wrapper,
      });

      const validRequest: ToggleModuleRequest = {
        moduleName: "test-module",
        status: true,
      };

      await act(async () => {
        await result.current.mutateAsync(validRequest);
      });

      expect(mockToggleModule).toHaveBeenCalledWith(validRequest);
    });
  });
});
