import LabPage from '../../../../app/(public)/lab/page';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { useRouter } from 'next/navigation';


vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('LabPage', () => {
  const mockReplace = vi.fn();
  const mockUseRouter = useRouter as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
      push: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render the redirect message', () => {
      render(<LabPage />);

      expect(screen.getByText('Redirigiendo...')).toBeInTheDocument();
    });

    it('should apply correct CSS classes to container', () => {
      const { container } = render(<LabPage />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'min-h-screen'
      );
    });

    it('should apply text-lg class to text', () => {
      render(<LabPage />);

      const textElement = screen.getByText('Redirigiendo...');
      expect(textElement).toHaveClass('text-lg');
    });

    it('should render correctly in the DOM', () => {
      const { container } = render(<LabPage />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Redirect functionality', () => {
    it('should call router.replace with "/" on mount', () => {
      render(<LabPage />);

      expect(mockReplace).toHaveBeenCalledWith('/');
      expect(mockReplace).toHaveBeenCalledTimes(1);
    });

    it('should call useRouter exactly once', () => {
      render(<LabPage />);

      expect(mockUseRouter).toHaveBeenCalledTimes(1);
    });

    it('should execute redirect immediately after mounting', async () => {
      render(<LabPage />);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalled();
      });
    });

    it('should not call router.replace multiple times', () => {
      const { rerender } = render(<LabPage />);

      expect(mockReplace).toHaveBeenCalledTimes(1);

      rerender(<LabPage />);

      expect(mockReplace).toHaveBeenCalledTimes(1);
    });
  });

  describe('useEffect hook', () => {
    it('should execute useEffect with correct dependency', () => {
      const { unmount } = render(<LabPage />);

      expect(mockReplace).toHaveBeenCalled();

      unmount();

      expect(mockReplace).toHaveBeenCalledTimes(1);
    });

    it('should re-execute redirect if router changes', () => {
      const { rerender } = render(<LabPage />);

      expect(mockReplace).toHaveBeenCalledTimes(1);

      const newMockReplace = vi.fn();
      mockUseRouter.mockReturnValue({
        replace: newMockReplace,
        push: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
      });

      rerender(<LabPage />);

      expect(newMockReplace).toHaveBeenCalledWith('/');
    });
  });

  describe('Router state behavior', () => {
    it('should handle when router.replace is present', () => {
      mockUseRouter.mockReturnValue({
        replace: mockReplace,
      });

      render(<LabPage />);

      expect(mockReplace).toHaveBeenCalledWith('/');
    });

    it('should use replace and not push', () => {
      const mockPush = vi.fn();
      mockUseRouter.mockReturnValue({
        replace: mockReplace,
        push: mockPush,
      });

      render(<LabPage />);

      expect(mockReplace).toHaveBeenCalledWith('/');
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should keep message visible while redirecting', () => {
      render(<LabPage />);

      const message = screen.getByText('Redirigiendo...');
      expect(message).toBeInTheDocument();
      expect(message).toBeVisible();
    });

    it('should call replace before user sees changes', async () => {
      render(<LabPage />);

      // Replace should occur almost instantly
      await waitFor(
        () => {
          expect(mockReplace).toHaveBeenCalled();
        },
        { timeout: 100 }
      );
    });

    it('should handle multiple mounts and unmounts', () => {
      const { unmount: unmount1 } = render(<LabPage />);
      expect(mockReplace).toHaveBeenCalledTimes(1);

      unmount1();

      const { unmount: unmount2 } = render(<LabPage />);
      expect(mockReplace).toHaveBeenCalledTimes(2);

      unmount2();
    });

    it('should not have memory leaks when unmounting', () => {
      const { unmount } = render(<LabPage />);

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with screen readers', () => {
      render(<LabPage />);

      const message = screen.getByText('Redirigiendo...');
      expect(message).toBeInTheDocument();
      // Text is visible and readable for screen readers
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(<LabPage />);

      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should complete redirect flow successfully', async () => {
      const { container } = render(<LabPage />);

      // Verify component renders
      expect(container.firstChild).toBeInTheDocument();

      // Verify message is displayed
      expect(screen.getByText('Redirigiendo...')).toBeInTheDocument();

      // Verify redirect is initiated
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/');
      });
    });

    it('should keep UI stable while redirecting', () => {
      const { container } = render(<LabPage />);

      // Structure should not change
      const initialHTML = container.innerHTML;
      
      expect(mockReplace).toHaveBeenCalled();
      
      // Structure remains the same after redirect
      expect(container.innerHTML).toBe(initialHTML);
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<LabPage />);
      const endTime = performance.now();

      // Render should be almost instant (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should not cause unnecessary re-renders', () => {
      let renderCount = 0;
      
      const TestWrapper = () => {
        renderCount++;
        return <LabPage />;
      };

      render(<TestWrapper />);

      // Should only render once on initial mount
      expect(renderCount).toBe(1);
    });
  });
});