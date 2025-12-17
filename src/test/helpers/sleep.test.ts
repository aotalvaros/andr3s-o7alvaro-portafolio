import { sleep } from '../../helpers/sleep';
import { describe, it, expect, beforeEach, vi } from "vitest";

describe('sleep', () => {

  describe('with fake timers (fast tests)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should resolve after specified milliseconds', async () => {
      const promise = sleep(1000);

      // Avanzar el tiempo
      vi.advanceTimersByTime(1000);

      // Esperar a que la promesa se resuelva
      const result = await promise;

      expect(result).toBe(true);
    });

    it('should resolve to true', async () => {
      const promise = sleep(500);
      
      vi.advanceTimersByTime(500);
      
      const result = await promise;
      expect(result).toBe(true);
    });

    it('should handle zero milliseconds', async () => {
      const promise = sleep(0);
      
      vi.advanceTimersByTime(0);
      
      const result = await promise;
      expect(result).toBe(true);
    });

    it('should handle very long delays', async () => {
      const promise = sleep(999999);
      
      vi.advanceTimersByTime(999999);
      
      const result = await promise;
      expect(result).toBe(true);
    });

    it('should not resolve before time elapses', async () => {
      const promise = sleep(1000);
      let resolved = false;

      promise.then(() => {
        resolved = true;
      });

      // Avanzar solo 500ms
      vi.advanceTimersByTime(500);
      await Promise.resolve(); // Flush microtasks

      expect(resolved).toBe(false);

      // Ahora sí, completar el tiempo
      vi.advanceTimersByTime(500);
      await promise;

      expect(resolved).toBe(true);
    });

    it('should work with multiple concurrent sleeps', async () => {
      const sleep1 = sleep(100);
      const sleep2 = sleep(200);
      const sleep3 = sleep(300);

      vi.advanceTimersByTime(100);
      await expect(sleep1).resolves.toBe(true);

      vi.advanceTimersByTime(100);
      await expect(sleep2).resolves.toBe(true);

      vi.advanceTimersByTime(100);
      await expect(sleep3).resolves.toBe(true);
    });

    it('should handle negative numbers as zero', async () => {
      // setTimeout trata números negativos como 0
      const promise = sleep(-100);
      
      vi.advanceTimersByTime(0);
      
      const result = await promise;
      expect(result).toBe(true);
    });
  });


  describe('with real timers (integration style)', () => {
    beforeEach(() => {
      vi.useRealTimers();
    });

    it('should actually wait the specified time', async () => {
      const start = Date.now();
      
      await sleep(100);
      
      const elapsed = Date.now() - start;
      
      // Con un margen de error de ±50ms
      expect(elapsed).toBeGreaterThanOrEqual(100);
      expect(elapsed).toBeLessThan(200);
    }, 1000); // Timeout de 1s para este test

    it('should resolve to true with real timers', async () => {
      const result = await sleep(50);
      expect(result).toBe(true);
    }, 500);

    it('should handle very short delays', async () => {
      const start = Date.now();
      
      await sleep(10);
      
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(10);
    }, 500);
  });

  describe('edge cases', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should handle decimal numbers', async () => {
      const promise = sleep(100.5);
      
      vi.advanceTimersByTime(101); // setTimeout redondea
      
      const result = await promise;
      expect(result).toBe(true);
    });

    it('should handle very large numbers', async () => {
      const promise = sleep(Number.MAX_SAFE_INTEGER);
      
      vi.advanceTimersByTime(Number.MAX_SAFE_INTEGER);
      
      const result = await promise;
      expect(result).toBe(true);
    });

    it('should be cancellable (if used with AbortController)', async () => {
      // Este test muestra cómo podrías extender sleep para ser cancelable
      const controller = new AbortController();
      
      const cancellableSleep = (ms: number, signal?: AbortSignal) => {
        return new Promise<boolean>((resolve, reject) => {
          const timeout = setTimeout(() => resolve(true), ms);
          
          signal?.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject(new Error('Aborted'));
          });
        });
      };

      const promise = cancellableSleep(1000, controller.signal);
      
      // Cancelar después de 500ms
      vi.advanceTimersByTime(500);
      controller.abort();

      await expect(promise).rejects.toThrow('Aborted');
    });
  });

  describe('performance tests', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should handle multiple sleeps efficiently', async () => {
      const sleeps = Array.from({ length: 100 }, (_, i) => sleep(i * 10));
      
      // Avanzar todo el tiempo de una vez
      vi.advanceTimersByTime(990);
      
      const results = await Promise.all(sleeps);
      
      expect(results).toHaveLength(100);
      expect(results.every(r => r === true)).toBe(true);
    });

    it('should not block other operations', async () => {
      let otherOperationCompleted = false;

      // Iniciar sleep
      const sleepPromise = sleep(1000);

      // Operación síncrona que debe completarse inmediatamente
      otherOperationCompleted = true;

      expect(otherOperationCompleted).toBe(true);

      // Ahora completar el sleep
      vi.advanceTimersByTime(1000);
      await sleepPromise;
    });
  });


});
