import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useImageFallback } from '@/hooks/useImageFallback';

describe('useImageFallback', () => {
  it('should use the initial image source by default', () => {
    const { result } = renderHook(() => useImageFallback('/initial.png', '/fallback.png'));

    expect(result.current.src).toBe('/initial.png');
  });

  it('should switch to the fallback source only when the main source fails', () => {
    const { result } = renderHook(() => useImageFallback('/initial.png', '/fallback.png'));

    act(() => {
      result.current.handleError();
    });

    expect(result.current.src).toBe('/fallback.png');
  });

  it('should not reassign the same fallback source repeatedly', () => {
    const { result } = renderHook(() => useImageFallback('/fallback.png', '/fallback.png'));

    act(() => {
      result.current.handleError();
    });

    expect(result.current.src).toBe('/fallback.png');
  });

  it('should reset the source when the initial src changes', () => {
    const { result, rerender } = renderHook(
      ({ initialSrc }) => useImageFallback(initialSrc, '/fallback.png'),
      { initialProps: { initialSrc: '/initial.png' } }
    );

    rerender({ initialSrc: '/updated.png' });

    expect(result.current.src).toBe('/updated.png');
  });
});
