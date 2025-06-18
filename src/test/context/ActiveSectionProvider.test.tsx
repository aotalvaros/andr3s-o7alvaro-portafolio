import { ActiveSectionProvider, useActiveSection } from "@/context/ActiveSectionProvider";
import { act, renderHook } from "@testing-library/react";
import { describe, it, expect } from 'vitest';

describe('useActiveSection Hook', () => {
    it('should update activeSection when setActiveSection is called', () => {
        const wrapper = ({ children }: React.PropsWithChildren) => <ActiveSectionProvider>{children}</ActiveSectionProvider>;
        const { result } = renderHook(() => useActiveSection(), { wrapper });

        act(() => {
            result.current.setActiveSection('newSection');
        });

        expect(result.current.activeSection).toBe('newSection');
    });

    it('should persist activeSection state after rerender', () => {
        const wrapper = ({ children }: React.PropsWithChildren) => <ActiveSectionProvider>{children}</ActiveSectionProvider>;
        const { result, rerender } = renderHook(() => useActiveSection(), { wrapper });

        act(() => {
            result.current.setActiveSection('persistentSection');
        });

        rerender();

        expect(result.current.activeSection).toBe('persistentSection');
    });

    it('should recover state after an error and allow updating activeSection', () => {
        const wrapper = ({ children }: React.PropsWithChildren) => <ActiveSectionProvider>{children}</ActiveSectionProvider>;
        const { result } = renderHook(() => useActiveSection(), { wrapper });

        act(() => {
            try {
                result.current.setActiveSection('errorSection');
                throw new Error('Simulated error');
            } catch (e) {
                // Simulate error handling
                console.error(e);
            }
        });

        act(() => {
            result.current.setActiveSection('recoveredSection');
        });

        expect(result.current.activeSection).toBe('recoveredSection');
    });

    it('should throw error if useActiveSection is used outside provider', () => {
        const { result } = renderHook(() => {
            try {
                return useActiveSection();
            } catch (e) {
                return e;
            }
        });

        expect(result.current).toBeInstanceOf(Error);
        expect((result.current as Error).message).toBe('useActiveSection must be used within ActiveSectionProvider');
    });

    it('should initialize activeSection as empty string by default', () => {
        const wrapper = ({ children }: React.PropsWithChildren) => <ActiveSectionProvider>{children}</ActiveSectionProvider>;
        const { result } = renderHook(() => useActiveSection(), { wrapper });

        expect(result.current.activeSection).toBe('');
    });

    it('should allow setting activeSection to an empty string', () => {
        const wrapper = ({ children }: React.PropsWithChildren) => <ActiveSectionProvider>{children}</ActiveSectionProvider>;
        const { result } = renderHook(() => useActiveSection(), { wrapper });

        act(() => {
            result.current.setActiveSection('');
        });

        expect(result.current.activeSection).toBe('');
    });
});
