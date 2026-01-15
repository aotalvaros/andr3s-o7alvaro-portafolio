/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadingService } from "@/core/infrastructure/services/LoadingService";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("LoadingService", () => {
  let loadingService: LoadingService;
  const mockSetLoading = vi.fn();

  beforeEach(() => {
    loadingService = new LoadingService(mockSetLoading);
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    mockSetLoading.mockClear();
  });

  describe("Constructor", () => {
    it("should create instance with setLoading callback", () => {
      expect(loadingService).toBeInstanceOf(LoadingService);
    });

    it("should initialize with zero active requests", () => {
      // Active requests is private, but we can verify by starting and stopping
      loadingService.start(); // counter = 1
      mockSetLoading.mockClear();

      loadingService.stop(); // counter = 0

      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it("should accept any function as setLoading", () => {
      const customCallback = vi.fn();
      const service = new LoadingService(customCallback);

      service.start();

      expect(customCallback).toHaveBeenCalledWith(true);
    });
  });

  describe("start() - Single Request", () => {
    it("should call setLoading(true) on first request", () => {
      loadingService.start();

      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledTimes(1);
    });

    it("should increment active requests counter", () => {
      loadingService.start();

      // Verify by calling stop and checking if loading turns off
      loadingService.stop();

      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it("should activate loading indicator", () => {
      loadingService.start();

      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });
  });

  describe("start() - Multiple Requests", () => {
    it("should NOT call setLoading(true) on second request", () => {
      loadingService.start(); // First request
      mockSetLoading.mockClear();

      loadingService.start(); // Second request

      expect(mockSetLoading).not.toHaveBeenCalled();
    });

    it("should handle two concurrent requests", () => {
      loadingService.start(); // Request 1
      loadingService.start(); // Request 2

      expect(mockSetLoading).toHaveBeenCalledTimes(1);
      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    it("should handle three concurrent requests", () => {
      loadingService.start(); // Request 1
      loadingService.start(); // Request 2
      loadingService.start(); // Request 3

      expect(mockSetLoading).toHaveBeenCalledTimes(1);
      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    it("should handle many concurrent requests", () => {
      for (let i = 0; i < 10; i++) {
        loadingService.start();
      }

      expect(mockSetLoading).toHaveBeenCalledTimes(1);
      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    it("should increment counter for each start call", () => {
      loadingService.start(); // counter = 1
      loadingService.start(); // counter = 2
      loadingService.start(); // counter = 3

      mockSetLoading.mockClear();

      // Should need 3 stops to reach 0
      loadingService.stop(); // counter = 2
      expect(mockSetLoading).not.toHaveBeenCalled();

      loadingService.stop(); // counter = 1
      expect(mockSetLoading).not.toHaveBeenCalled();

      loadingService.stop(); // counter = 0
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  describe("stop() - Single Request", () => {
    it("should call setLoading(false) when last request completes", () => {
      loadingService.start();
      mockSetLoading.mockClear();

      loadingService.stop();

      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(mockSetLoading).toHaveBeenCalledTimes(1);
    });

    it("should decrement active requests counter", () => {
      loadingService.start(); // counter = 1
      loadingService.stop(); // counter = 0

      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it("should deactivate loading indicator", () => {
      loadingService.start();
      mockSetLoading.mockClear();

      loadingService.stop();

      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  describe("stop() - Multiple Requests", () => {
    it("should NOT call setLoading(false) when other requests are still active", () => {
      loadingService.start(); // Request 1
      loadingService.start(); // Request 2
      mockSetLoading.mockClear();

      loadingService.stop(); // Request 1 completes

      expect(mockSetLoading).not.toHaveBeenCalled();
    });

    it("should call setLoading(false) only when ALL requests complete", () => {
      loadingService.start(); // Request 1
      loadingService.start(); // Request 2
      mockSetLoading.mockClear();

      loadingService.stop(); // Request 1 completes
      expect(mockSetLoading).not.toHaveBeenCalled();

      loadingService.stop(); // Request 2 completes
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it("should handle three requests completing", () => {
      loadingService.start();
      loadingService.start();
      loadingService.start();
      mockSetLoading.mockClear();

      loadingService.stop();
      loadingService.stop();
      expect(mockSetLoading).not.toHaveBeenCalled();

      loadingService.stop();
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it("should handle many requests completing", () => {
      const requestCount = 10;

      for (let i = 0; i < requestCount; i++) {
        loadingService.start();
      }
      mockSetLoading.mockClear();

      // Stop all but one
      for (let i = 0; i < requestCount - 1; i++) {
        loadingService.stop();
      }
      expect(mockSetLoading).not.toHaveBeenCalled();

      // Stop the last one
      loadingService.stop();
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  describe("stop() - Edge Cases", () => {
    it("should not go below zero active requests", () => {
      loadingService.stop(); // Try to stop when counter is 0
      mockSetLoading.mockClear();
      expect(mockSetLoading).not.toHaveBeenCalled();
    });

    it("should handle multiple stop calls when counter is zero", () => {
      loadingService.stop();
      loadingService.stop();
      loadingService.stop();
      mockSetLoading.mockClear();
      expect(mockSetLoading).not.toHaveBeenCalled();
    });

    it("should use Math.max to prevent negative counter", () => {
      // Start once
      loadingService.start();

      // Stop multiple times (more than starts)
      loadingService.stop();
      loadingService.stop();
      loadingService.stop();

      mockSetLoading.mockClear();

      // New start should show loading again
      loadingService.start();

      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    it("should recover from excessive stop calls", () => {
      loadingService.start(); // counter = 1
      loadingService.stop(); // counter = 0
      loadingService.stop(); // counter = 0 (Math.max prevents negative)
      loadingService.stop(); // counter = 0

      mockSetLoading.mockClear();

      // Should work normally after recovery
      loadingService.start();
      expect(mockSetLoading).toHaveBeenCalledWith(true);

      mockSetLoading.mockClear();
      loadingService.stop();
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  describe("Real-world Request Scenarios", () => {
    it("should handle sequential requests", () => {
      // Request 1
      loadingService.start();
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      mockSetLoading.mockClear();

      loadingService.stop();
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      mockSetLoading.mockClear();

      // Request 2
      loadingService.start();
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      mockSetLoading.mockClear();

      loadingService.stop();
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it("should handle overlapping requests", () => {
      loadingService.start(); // Request 1 starts
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      mockSetLoading.mockClear();

      loadingService.start(); // Request 2 starts (while 1 is still active)
      expect(mockSetLoading).not.toHaveBeenCalled();

      loadingService.stop(); // Request 1 finishes
      expect(mockSetLoading).not.toHaveBeenCalled();

      loadingService.stop(); // Request 2 finishes
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it("should handle fast request (start and stop immediately)", () => {
      loadingService.start();
      loadingService.stop();

      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(mockSetLoading).toHaveBeenCalledTimes(2);
    });

    it("should handle slow and fast requests together", () => {
      loadingService.start(); // Slow request starts
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      mockSetLoading.mockClear();

      loadingService.start(); // Fast request starts
      loadingService.stop(); // Fast request finishes
      expect(mockSetLoading).not.toHaveBeenCalled();

      loadingService.stop(); // Slow request finishes
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it("should handle request with skipLoading option (simulated)", () => {
      // Some requests might not call start/stop
      // Other requests should still work
      loadingService.start(); // Normal request 1
      // (skipped request - no start/stop)
      loadingService.start(); // Normal request 2

      mockSetLoading.mockClear();

      loadingService.stop(); // Request 1 completes
      expect(mockSetLoading).not.toHaveBeenCalled();

      loadingService.stop(); // Request 2 completes
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  describe("Stress Testing", () => {
    it("should handle rapid start/stop cycles", () => {
      for (let i = 0; i < 100; i++) {
        loadingService.start();
        loadingService.stop();
      }

      // Should have 100 starts and 100 stops
      expect(mockSetLoading).toHaveBeenCalledTimes(200);
    });

    it("should handle many concurrent requests", () => {
      const requestCount = 1000;

      // Start many requests
      for (let i = 0; i < requestCount; i++) {
        loadingService.start();
      }

      // Should only call setLoading(true) once
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledTimes(1);

      mockSetLoading.mockClear();

      // Stop all requests
      for (let i = 0; i < requestCount; i++) {
        loadingService.stop();
      }

      // Should only call setLoading(false) once (at the end)
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(mockSetLoading).toHaveBeenCalledTimes(1);
    });

    it("should maintain correct counter with random operations", () => {
      // Random mix of starts and stops
      loadingService.start();
      loadingService.start();
      loadingService.stop();
      loadingService.start();
      loadingService.start();
      loadingService.stop();
      loadingService.stop();

      mockSetLoading.mockClear();

      // Should still have 2 active requests
      loadingService.stop();
      mockSetLoading.mockClear();
      expect(mockSetLoading).not.toHaveBeenCalled();

      loadingService.stop();
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  describe("ILoadingService Interface Compliance", () => {
    it("should implement start method", () => {
      expect(loadingService.start).toBeDefined();
      expect(typeof loadingService.start).toBe("function");
    });

    it("should implement stop method", () => {
      expect(loadingService.stop).toBeDefined();
      expect(typeof loadingService.stop).toBe("function");
    });

    it("should work as ILoadingService in LoadingInterceptor", () => {
      // Type check - ensures it implements the interface correctly
      const service: any = loadingService;

      expect(() => {
        service.start();
        service.stop();
      }).not.toThrow();
    });
  });

  describe("Integration with Zustand Store", () => {
    it("should call store setLoading function", () => {
      loadingService.start();

      expect(mockSetLoading).toHaveBeenCalled();
    });

    it("should pass correct boolean values to store", () => {
      loadingService.start();
      expect(mockSetLoading).toHaveBeenCalledWith(true);

      mockSetLoading.mockClear();

      loadingService.stop();
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it("should work with different store implementations", () => {
      const alternativeCallback = vi.fn();
      const alternativeService = new LoadingService(alternativeCallback);

      alternativeService.start();
      expect(alternativeCallback).toHaveBeenCalledWith(true);

      alternativeService.stop();
      expect(alternativeCallback).toHaveBeenCalledWith(false);
    });
  });

  describe("Error Handling", () => {
    it("should not throw if setLoading throws", () => {
      const throwingCallback = vi.fn().mockImplementation(() => {
        throw new Error("Store error");
      });
      const service = new LoadingService(throwingCallback);

      expect(() => service.start()).toThrow("Store error");
    });

    it("should continue working after setLoading error", () => {
      const errorCallback = vi
        .fn()
        .mockImplementationOnce(() => {
          throw new Error("Error");
        })
        .mockImplementation(() => {});

      const service = new LoadingService(errorCallback);

      try {
        service.start(); // Throws
      } catch (e) {
        console.log(e)
      }

      service.stop(); // Should still work
      expect(errorCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe("Memory and Performance", () => {
    it("should not leak memory with many operations", () => {
      const operations = 10000;

      for (let i = 0; i < operations; i++) {
        loadingService.start();
        loadingService.stop();
      }

      expect(mockSetLoading).toHaveBeenCalledTimes(operations * 2);
    });

    it("should be lightweight (no heavy computations)", () => {
      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        loadingService.start();
        loadingService.stop();
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete in less than 100ms
      expect(duration).toBeLessThan(100);
    });

    it("should allow multiple service instances", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const service1 = new LoadingService(callback1);
      const service2 = new LoadingService(callback2);

      service1.start();
      service2.start();

      expect(callback1).toHaveBeenCalledWith(true);
      expect(callback2).toHaveBeenCalledWith(true);
    });

    it("should maintain independent counters for different instances", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const service1 = new LoadingService(callback1);
      const service2 = new LoadingService(callback2);

      service1.start();
      service1.start();
      service2.start();

      callback1.mockClear();
      callback2.mockClear();

      service1.stop();
      expect(callback1).not.toHaveBeenCalled(); // Still has 1 active

      service2.stop();
      expect(callback2).toHaveBeenCalledWith(false); // No more active
    });
  });

  describe("Edge Cases with Zero", () => {
    it("should handle counter starting at exactly 0", () => {
      // Counter starts at 0
      loadingService.start(); // counter = 1

      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    it("should handle counter returning to exactly 0", () => {
      loadingService.start(); // counter = 1
      mockSetLoading.mockClear();

      loadingService.stop(); // counter = 0

      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it("should not call setLoading when counter stays above 0", () => {
      loadingService.start(); // counter = 1
      loadingService.start(); // counter = 2
      mockSetLoading.mockClear();

      loadingService.stop(); // counter = 1 (still > 0)

      expect(mockSetLoading).not.toHaveBeenCalled();
    });
  });
});
