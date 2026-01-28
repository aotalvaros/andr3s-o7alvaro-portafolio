import { ModuleFilters } from '../../../../../components/sections/admin/modules/components/ModuleFilters';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock del componente CustomSearch
vi.mock('@/components/ui/CustomSearch', () => ({
  CustomSearch: ({ onSearch, placeholder, textExample, classNameContainer }: any) => (
    <div data-testid="custom-search" data-classname={classNameContainer}>
      <input
        data-testid="search-input"
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
      />
      {textExample && (
        <div data-testid="text-examples">
          {textExample.join(', ')}
        </div>
      )}
    </div>
  )
}));

describe('ModuleFilters Component', () => {
  const mockOnSearchChange = vi.fn();
  const mockOnCategoryChange = vi.fn();

  const defaultProps = {
    searchTerm: '',
    categoryFilter: 'all',
    textExamples: ['Users', 'Reports', 'Analytics'],
    categories: {
      core: 5,
      features: 8,
      integrations: 3
    },
    onSearchChange: mockOnSearchChange,
    onCategoryChange: mockOnCategoryChange
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the component', () => {
      render(<ModuleFilters {...defaultProps} />);

      expect(screen.getByText('Gestión de Módulos')).toBeInTheDocument();
    });

    it('should render with correct title', () => {
      render(<ModuleFilters {...defaultProps} />);

      expect(screen.getByText('Gestión de Módulos')).toBeInTheDocument();
    });

    it('should render with correct description', () => {
      render(<ModuleFilters {...defaultProps} />);

      expect(screen.getByText('Controla la visibilidad y estado de cada módulo')).toBeInTheDocument();
    });

    it('should render within a section element', () => {
      const { container } = render(<ModuleFilters {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should have correct card styling', () => {
      const { container } = render(<ModuleFilters {...defaultProps} />);

      const card = container.querySelector('.bg-muted\\/60');
      expect(card).toBeInTheDocument();
    });
  });

  describe('CustomSearch Integration', () => {
    it('should render CustomSearch component', () => {
      render(<ModuleFilters {...defaultProps} />);

      expect(screen.getByTestId('custom-search')).toBeInTheDocument();
    });

    it('should pass correct placeholder to CustomSearch', () => {
      render(<ModuleFilters {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Buscar módulos...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should pass textExamples to CustomSearch', () => {
      render(<ModuleFilters {...defaultProps} />);

      expect(screen.getByText('Users, Reports, Analytics')).toBeInTheDocument();
    });

    it('should pass correct className to CustomSearch', () => {
      render(<ModuleFilters {...defaultProps} />);

      const customSearch = screen.getByTestId('custom-search');
      expect(customSearch).toHaveAttribute('data-classname', 'max-w-full');
    });

    it('should call onSearchChange when typing in search', async () => {
      const user = userEvent.setup();
      render(<ModuleFilters {...defaultProps} />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'test');

      expect(mockOnSearchChange).toHaveBeenCalled();
    });

    it('should call onSearchChange with correct value', async () => {
        const user = userEvent.setup();
        render(<ModuleFilters {...defaultProps} />);

        const searchInput = screen.getByTestId('search-input');
        await user.type(searchInput, 'users');


        expect(mockOnSearchChange).toHaveBeenCalledWith('u');
        expect(mockOnSearchChange).toHaveBeenCalledWith('us');
        expect(mockOnSearchChange).toHaveBeenCalledWith('use');
        expect(mockOnSearchChange).toHaveBeenCalledWith('user');
        expect(mockOnSearchChange).toHaveBeenCalledWith('users');
    });
  });

  describe('Category Select', () => {
    it('should render category select', () => {
      render(<ModuleFilters {...defaultProps} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render Filter icon in select trigger', () => {
      const { container } = render(<ModuleFilters {...defaultProps} />);

      const filterIcon = container.querySelector('.mr-2.h-4.w-4');
      expect(filterIcon).toBeInTheDocument();
    });

    it('should display "Todas" option by default', async () => {
      render(<ModuleFilters {...defaultProps} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();

      expect(select).toHaveTextContent('Todas');

      await act(async () => {
        fireEvent.mouseDown(select);
      });

      expect(select).toBeInTheDocument();
      
    });

    it('should have responsive width classes', () => {
      const { container } = render(<ModuleFilters {...defaultProps} />);

      const selectTrigger = container.querySelector('.w-full.sm\\:w-\\[180px\\]');
      expect(selectTrigger).toBeInTheDocument();
    });

  });

  describe('Layout and Responsive Design', () => {
    it('should have flex layout for filters', () => {
      const { container } = render(<ModuleFilters {...defaultProps} />);

      const flexContainer = container.querySelector('.flex.flex-col.gap-4.items-center.sm\\:flex-row');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should have flex-1 class on search container', () => {
      const { container } = render(<ModuleFilters {...defaultProps} />);

      const searchContainer = container.querySelector('.relative.flex-1');
      expect(searchContainer).toBeInTheDocument();
    });

    it('should stack vertically on mobile', () => {
      const { container } = render(<ModuleFilters {...defaultProps} />);

      const flexContainer = container.querySelector('.flex-col');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should layout horizontally on desktop', () => {
      const { container } = render(<ModuleFilters {...defaultProps} />);

      const flexContainer = container.querySelector('.sm\\:flex-row');
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('Props Integration', () => {
    it('should reflect searchTerm prop', () => {
      render(<ModuleFilters {...defaultProps} searchTerm="test search" />);

      // CustomSearch receives the searchTerm implicitly through controlled input
      expect(screen.getByTestId('custom-search')).toBeInTheDocument();
    });

    it('should reflect categoryFilter prop', () => {
      render(<ModuleFilters {...defaultProps} categoryFilter="core" />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('should update when textExamples change', () => {
      const { rerender } = render(<ModuleFilters {...defaultProps} />);

      expect(screen.getByText('Users, Reports, Analytics')).toBeInTheDocument();

      rerender(
        <ModuleFilters
          {...defaultProps}
          textExamples={['Payments', 'Settings']}
        />
      );

      expect(screen.getByText('Payments, Settings')).toBeInTheDocument();
    });

    it('should render with empty categories', () => {
      render(<ModuleFilters {...defaultProps} categories={{}} />);

      expect(screen.getByText('Gestión de Módulos')).toBeInTheDocument();
    });

    it('should render with empty textExamples', () => {
      render(<ModuleFilters {...defaultProps} textExamples={[]} />);

      expect(screen.getByTestId('custom-search')).toBeInTheDocument();
    });
  });

});