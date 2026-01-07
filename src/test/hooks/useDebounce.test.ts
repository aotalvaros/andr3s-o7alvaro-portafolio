import { useDebounce } from '../../hooks/useDebounce';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('Test useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('debe retornar el valor inicial inmediatamente', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    
    act(() => {
        expect(result.current).toBe('initial')
    })
  })

  it('debe actualizar el valor después del delay especificado', async () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay),
        {
            initialProps: { value: 'initial', delay: 500 }
        }
    )
    act(() => {
        expect(result.current).toBe('initial')
    })
    rerender({ value: 'updated', delay: 500 })

    act(() => {
        expect(result.current).toBe('initial')
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(result.current).toBe('updated')
  })

  it('debe cancelar el timeout previo cuando el valor cambia antes del delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'first', delay: 500 }
      }
    )
        
    rerender({ value: 'second', delay: 500 })
    vi.advanceTimersByTime(200)

    rerender({ value: 'third', delay: 500 })
    vi.advanceTimersByTime(200)

    expect(result.current).toBe('first')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(result.current).toBe('third')
  })

  it('debe funcionar con diferentes tipos de datos', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 42, delay: 300 }
      }
    )

    expect(result.current).toBe(42)

    rerender({ value: 100, delay: 300 })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })

    expect(result.current).toBe(100)
  })

  it('debe funcionar con objetos', async () => {
    const obj1 = { name: 'John', age: 30 }
    const obj2 = { name: 'Jane', age: 25 }

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: obj1, delay: 400 }
      }
    )

    expect(result.current).toBe(obj1)

    rerender({ value: obj2, delay: 400 })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    expect(result.current).toBe(obj2)
  })

  it('debe funcionar con arrays', async () => {
    const arr1 = [1, 2, 3]
    const arr2 = [4, 5, 6]

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: arr1, delay: 300 }
      }
    )

    expect(result.current).toEqual(arr1)

    rerender({ value: arr2, delay: 300 })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })

    expect(result.current).toEqual(arr2)

  })

  it('debe respetar cambios en el delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'test', delay: 500 }
      }
    )

    rerender({ value: 'new value', delay: 200 })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200)
    })

    expect(result.current).toBe('new value')
  })

  it('debe limpiar el timeout al desmontar el componente', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    const { unmount } = renderHook(() => useDebounce('value', 500))

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('debe manejar múltiples cambios rápidos y solo aplicar el último', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'v1', delay: 500 }
      }
    )

    rerender({ value: 'v2', delay: 500 })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    rerender({ value: 'v3', delay: 500 })
     await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    rerender({ value: 'v4', delay: 500 })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    rerender({ value: 'v5', delay: 500 })

    expect(result.current).toBe('v1')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(result.current).toBe('v5')
  })

  it('debe funcionar con delay de 0', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 }
      }
    )

    rerender({ value: 'instant', delay: 0 })
    
     await act(async () => {
      await vi.advanceTimersByTimeAsync(0)
    })

    expect(result.current).toBe('instant')
  })
})