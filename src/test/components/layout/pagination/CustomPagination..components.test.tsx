/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { calculatePageNumbers } from '@/components/layout/pagination/helper/calculatePageNumbers';
import { renderPageItem } from '@/components/layout/pagination/helper/renderPageItem';
import { CustomPagination } from '@/components/layout/pagination/CustomPagination.components';


// Mocks
vi.mock('@/components/layout/pagination/helper/calculatePageNumbers');
vi.mock('@/components/layout/pagination/helper/renderPageItem');

// Mock del componente PaginationButton
vi.mock('@/components/pagination/components/PaginationButton', () => ({
  PaginationButton: ({ 
    children, 
    onClick, 
    disabled, 
    ariaLabel, 
    testId 
  }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {children}
    </button>
  ),
}));

describe('CustomPagination', () => {
  const mockOnPageChangeNext = vi.fn();

  beforeEach(() => {
    // Mock por defecto de calculatePageNumbers
    vi.mocked(calculatePageNumbers).mockReturnValue([1, 2, 3, 4, 5]);
    
    // Mock por defecto de renderPageItem
    vi.mocked(renderPageItem).mockImplementation((page, index) => (
      <button key={index} data-testid={`page-${page}`}>
        {page}
      </button>
    ));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render pagination component with correct attributes', () => {
      render(
        <CustomPagination
          currentPage={1}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const nav = screen.getByTestId('pagination-component');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('role', 'navigation');
      expect(nav).toHaveAttribute('aria-label', 'Navegación de páginas');
    });

    it('should render all navigation buttons', () => {
      render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(screen.getByTestId('pagination-first-page')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-prev-page')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-next-page')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-last-page')).toBeInTheDocument();
    });

    it('should render page numbers from calculatePageNumbers', () => {
      vi.mocked(calculatePageNumbers).mockReturnValue([1, 2, 3]);
      
      render(
        <CustomPagination
          currentPage={2}
          totalPages={3}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(screen.getByTestId('page-1')).toBeInTheDocument();
      expect(screen.getByTestId('page-2')).toBeInTheDocument();
      expect(screen.getByTestId('page-3')).toBeInTheDocument();
    });

    it('should call calculatePageNumbers with correct params', () => {
      render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(calculatePageNumbers).toHaveBeenCalledWith(5, 10);
    });

    it('should call renderPageItem for each page number', () => {
      vi.mocked(calculatePageNumbers).mockReturnValue([1, 2, 3]);
      
      render(
        <CustomPagination
          currentPage={2}
          totalPages={3}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(renderPageItem).toHaveBeenCalledTimes(3);
      expect(renderPageItem).toHaveBeenCalledWith(1, 0, 2, mockOnPageChangeNext);
      expect(renderPageItem).toHaveBeenCalledWith(2, 1, 2, mockOnPageChangeNext);
      expect(renderPageItem).toHaveBeenCalledWith(3, 2, 2, mockOnPageChangeNext);
    });
  });

  describe('First Page Behavior', () => {
    it('should disable first page button when on first page', () => {
      render(
        <CustomPagination
          currentPage={1}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const firstPageButton = screen.getByTestId('pagination-first-page');
      expect(firstPageButton).toBeDisabled();
    });

    it('should disable previous page button when on first page', () => {
      render(
        <CustomPagination
          currentPage={1}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const prevPageButton = screen.getByTestId('pagination-prev-page');
      expect(prevPageButton).toBeDisabled();
    });

    it('should enable next and last buttons when on first page', () => {
      render(
        <CustomPagination
          currentPage={1}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(screen.getByTestId('pagination-next-page')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-last-page')).not.toBeDisabled();
    });

    it('should not call onPageChangeNext when clicking disabled first page button', async () => {
      const user = userEvent.setup();
      
      render(
        <CustomPagination
          currentPage={1}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const firstPageButton = screen.getByTestId('pagination-first-page');
      await user.click(firstPageButton);

      expect(mockOnPageChangeNext).not.toHaveBeenCalled();
    });
  });

  describe('Last Page Behavior', () => {
    it('should disable last page button when on last page', () => {
      render(
        <CustomPagination
          currentPage={10}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const lastPageButton = screen.getByTestId('pagination-last-page');
      expect(lastPageButton).toBeDisabled();
    });

    it('should disable next page button when on last page', () => {
      render(
        <CustomPagination
          currentPage={10}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const nextPageButton = screen.getByTestId('pagination-next-page');
      expect(nextPageButton).toBeDisabled();
    });

    it('should enable first and previous buttons when on last page', () => {
      render(
        <CustomPagination
          currentPage={10}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(screen.getByTestId('pagination-first-page')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-prev-page')).not.toBeDisabled();
    });

    it('should not call onPageChangeNext when clicking disabled last page button', async () => {
      const user = userEvent.setup();
      
      render(
        <CustomPagination
          currentPage={10}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const lastPageButton = screen.getByTestId('pagination-last-page');
      await user.click(lastPageButton);

      expect(mockOnPageChangeNext).not.toHaveBeenCalled();
    });
  });

  describe('Middle Page Behavior', () => {
    it('should enable all buttons when on middle page', () => {
      render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(screen.getByTestId('pagination-first-page')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-prev-page')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-next-page')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-last-page')).not.toBeDisabled();
    });
  });

  describe('Navigation Actions', () => {
    it('should navigate to first page when clicking first page button', async () => {
      const user = userEvent.setup();
      
      render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const firstPageButton = screen.getByTestId('pagination-first-page');
      await user.click(firstPageButton);

      expect(mockOnPageChangeNext).toHaveBeenCalledWith(1);
    });

    it('should navigate to previous page when clicking previous button', async () => {
      const user = userEvent.setup();
      
      render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const prevButton = screen.getByTestId('pagination-prev-page');
      await user.click(prevButton);

      expect(mockOnPageChangeNext).toHaveBeenCalledWith(4);
    });

    it('should navigate to next page when clicking next button', async () => {
      const user = userEvent.setup();
      
      render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const nextButton = screen.getByTestId('pagination-next-page');
      await user.click(nextButton);

      expect(mockOnPageChangeNext).toHaveBeenCalledWith(6);
    });

    it('should navigate to last page when clicking last page button', async () => {
      const user = userEvent.setup();
      
      render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const lastButton = screen.getByTestId('pagination-last-page');
      await user.click(lastButton);

      expect(mockOnPageChangeNext).toHaveBeenCalledWith(10);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single page correctly', () => {
      render(
        <CustomPagination
          currentPage={1}
          totalPages={1}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(screen.getByTestId('pagination-first-page')).toBeDisabled();
      expect(screen.getByTestId('pagination-prev-page')).toBeDisabled();
      expect(screen.getByTestId('pagination-next-page')).toBeDisabled();
      expect(screen.getByTestId('pagination-last-page')).toBeDisabled();
    });

    it('should handle two pages correctly when on page 1', () => {
      render(
        <CustomPagination
          currentPage={1}
          totalPages={2}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(screen.getByTestId('pagination-first-page')).toBeDisabled();
      expect(screen.getByTestId('pagination-prev-page')).toBeDisabled();
      expect(screen.getByTestId('pagination-next-page')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-last-page')).not.toBeDisabled();
    });

    it('should handle two pages correctly when on page 2', () => {
      render(
        <CustomPagination
          currentPage={2}
          totalPages={2}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(screen.getByTestId('pagination-first-page')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-prev-page')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-next-page')).toBeDisabled();
      expect(screen.getByTestId('pagination-last-page')).toBeDisabled();
    });

    it('should handle large page numbers', () => {
      render(
        <CustomPagination
          currentPage={500}
          totalPages={1000}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(calculatePageNumbers).toHaveBeenCalledWith(500, 1000);
      expect(screen.getByTestId('pagination-component')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-labels for all buttons', () => {
      render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(screen.getByTestId('pagination-first-page')).toHaveAttribute(
        'aria-label',
        'Ir a la primera página'
      );
      expect(screen.getByTestId('pagination-prev-page')).toHaveAttribute(
        'aria-label',
        'Ir a la página anterior'
      );
      expect(screen.getByTestId('pagination-next-page')).toHaveAttribute(
        'aria-label',
        'Ir a la página siguiente'
      );
      expect(screen.getByTestId('pagination-last-page')).toHaveAttribute(
        'aria-label',
        'Ir a la última página'
      );
    });

    it('should have navigation role and aria-label', () => {
      render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Navegación de páginas');
    });
  });

  describe('useMemo Optimization', () => {
    it('should not recalculate page numbers when currentPage and totalPages are unchanged', () => {
      const { rerender } = render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const callCountAfterFirstRender = vi.mocked(calculatePageNumbers).mock.calls.length;

      // Rerender con las mismas props
      rerender(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      // No debería llamarse de nuevo gracias a useMemo
      expect(vi.mocked(calculatePageNumbers).mock.calls.length).toBe(callCountAfterFirstRender);
    });

    it('should recalculate page numbers when currentPage changes', () => {
      const { rerender } = render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const callCountAfterFirstRender = vi.mocked(calculatePageNumbers).mock.calls.length;

      rerender(
        <CustomPagination
          currentPage={6}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(vi.mocked(calculatePageNumbers).mock.calls.length).toBeGreaterThan(
        callCountAfterFirstRender
      );
    });

    it('should recalculate page numbers when totalPages changes', () => {
      const { rerender } = render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const callCountAfterFirstRender = vi.mocked(calculatePageNumbers).mock.calls.length;

      rerender(
        <CustomPagination
          currentPage={5}
          totalPages={20}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      expect(vi.mocked(calculatePageNumbers).mock.calls.length).toBeGreaterThan(
        callCountAfterFirstRender
      );
    });
  });

  describe('Styling', () => {
    it('should apply correct CSS classes to nav element', () => {
      render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const nav = screen.getByTestId('pagination-component');
      expect(nav).toHaveClass('flex', 'items-center', 'justify-center', 'gap-2', 'flex-wrap', 'mt-3');
    });

    it('should apply correct CSS classes to page numbers container', () => {
      render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const pageNumbersContainer = screen.getByTestId('pagination-component').querySelector('div');
      expect(pageNumbersContainer).toHaveClass('flex', 'gap-1');
    });
  });

  describe('Multiple Clicks', () => {
    it('should handle multiple rapid clicks correctly', async () => {
      const user = userEvent.setup();
      
      render(
        <CustomPagination
          currentPage={5}
          totalPages={10}
          onPageChangeNext={mockOnPageChangeNext}
        />
      );

      const nextButton = screen.getByTestId('pagination-next-page');
      
      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);

      expect(mockOnPageChangeNext).toHaveBeenCalledTimes(3);
      expect(mockOnPageChangeNext).toHaveBeenNthCalledWith(1, 6);
      expect(mockOnPageChangeNext).toHaveBeenNthCalledWith(2, 6);
      expect(mockOnPageChangeNext).toHaveBeenNthCalledWith(3, 6);
    });
  });
});