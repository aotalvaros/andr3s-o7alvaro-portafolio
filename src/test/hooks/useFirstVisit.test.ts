import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useFirstVisit } from '@/hooks/useFirstVisit';

describe('useFirstVisit', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should mark the first visit as pending when no localStorage flag exists', () => {
    const { result } = renderHook(() => useFirstVisit());

    expect(result.current.isFirstVisit).toBe(true);
  });

  it('should detect a repeated visit when the flag already exists', () => {
    localStorage.setItem('has-visited', 'true');

    const { result } = renderHook(() => useFirstVisit());

    expect(result.current.isFirstVisit).toBe(false);
  });

  it('should persist the visited state after calling markAsVisited', () => {
    const { result } = renderHook(() => useFirstVisit());

    act(() => {
      result.current.markAsVisited();
    });

    expect(result.current.isFirstVisit).toBe(false);
    expect(localStorage.getItem('has-visited')).toBe('true');
  });
});
