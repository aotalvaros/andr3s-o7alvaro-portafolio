/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigationLinks } from '../../../../../components/layout/navbar/components/NavigationLinks';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href, onClick, className, 'data-testid': testId }: any) => (
    <a href={href} onClick={onClick} className={className} data-testid={testId}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className, loading }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
      loading={loading}
      data-testid="next-image"
    />
  ),
}));


// Mock ItemsMenu component
vi.mock('../../../../../components/layout/items.component', () => ({
  ItemsMenu: ({ handleClickLink }: any) => (
    <div data-testid="items-menu" onClick={handleClickLink}>
      Items Menu
    </div>
  ),
}));

// Mock UI Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, className, 'data-testid': testId }: any) => (
    <button 
      onClick={onClick} 
      className={className} 
      data-variant={variant}
      data-testid={testId}
    >
      {children}
    </button>
  ),
}));

describe('NavigationLinks', () => {
  const mockOnContactClick = vi.fn();
  const mockOnLinkClick = vi.fn();
  const mockOnThemeToggle = vi.fn();

  const defaultProps = {
    onContactClick: mockOnContactClick,
    onLinkClick: mockOnLinkClick,
    onThemeToggle: mockOnThemeToggle,
    isDarkMode: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render all navigation links', () => {
      render(<NavigationLinks {...defaultProps} />);

      expect(screen.getByTestId('contact-link')).toBeInTheDocument();
      expect(screen.getByTestId('api-lab-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('login-link')).toBeInTheDocument();
    });

    it('should render contact link with correct text', () => {
      render(<NavigationLinks {...defaultProps} />);

      expect(screen.getByText('Contacto')).toBeInTheDocument();
    });

    it('should render API Lab dropdown with correct text', () => {
      render(<NavigationLinks {...defaultProps} />);

      expect(screen.getByText('Lab. de APIs ▼')).toBeInTheDocument();
    });

    it('should render login link with settings icon', () => {
      render(<NavigationLinks {...defaultProps} />);

      const image = screen.getByAltText('Iniciar sesión');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/assets/settings_24dp.svg');
    });

  });

  describe('Contact link', () => {
    it('should have correct href attribute', () => {
      render(<NavigationLinks {...defaultProps} />);

      const contactLink = screen.getByTestId('contact-link');
      expect(contactLink).toHaveAttribute('href', '/#contact');
    });

    it('should call onContactClick when clicked', () => {
      render(<NavigationLinks {...defaultProps} />);

      const contactLink = screen.getByTestId('contact-link');
      fireEvent.click(contactLink);

      expect(mockOnContactClick).toHaveBeenCalledTimes(1);
    });

    it('should apply correct CSS classes in desktop variant', () => {
      render(<NavigationLinks {...defaultProps} variant="desktop" />);

      const contactLink = screen.getByTestId('contact-link');
      expect(contactLink).toHaveClass('hover:underline', 'dark:text-secondary');
    });

    it('should apply correct CSS classes in mobile variant', () => {
      render(<NavigationLinks {...defaultProps} variant="mobile" />);

      const contactLink = screen.getByTestId('contact-link');
      expect(contactLink).toHaveClass('hover:underline', 'dark:text-secondary');
    });
  });

  describe('API Lab dropdown', () => {
    it('should render as a button element', () => {
      render(<NavigationLinks {...defaultProps} />);

      const dropdown = screen.getByTestId('api-lab-dropdown');
      expect(dropdown.tagName).toBe('BUTTON');
    });

    it('should have hover:underline class', () => {
      render(<NavigationLinks {...defaultProps} />);

      const dropdown = screen.getByTestId('api-lab-dropdown');
      expect(dropdown.className).toContain('hover:underline');
    });

    it('should have dark:text-secondary class', () => {
      render(<NavigationLinks {...defaultProps} />);

      const dropdown = screen.getByTestId('api-lab-dropdown');
      expect(dropdown.className).toContain('dark:text-secondary');
    });

    it('should have text-start class in mobile variant', () => {
      render(<NavigationLinks {...defaultProps} variant="mobile" />);

      const dropdown = screen.getByTestId('api-lab-dropdown');
      expect(dropdown.className).toContain('text-start');
    });

    it('should not have text-start class in desktop variant', () => {
      render(<NavigationLinks {...defaultProps} variant="desktop" />);

      const dropdown = screen.getByTestId('api-lab-dropdown');
      expect(dropdown.className).not.toContain('text-start');
    });

  });

  describe('Login link', () => {
    it('should have correct href attribute', () => {
      render(<NavigationLinks {...defaultProps} />);

      const loginLink = screen.getByTestId('login-link');
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('should call onLinkClick when clicked', () => {
      render(<NavigationLinks {...defaultProps} />);

      const loginLink = screen.getByTestId('login-link');
      fireEvent.click(loginLink);

      expect(mockOnLinkClick).toHaveBeenCalledTimes(1);
    });

    it('should render settings icon with correct attributes', () => {
      render(<NavigationLinks {...defaultProps} />);

      const image = screen.getByAltText('Iniciar sesión');
      expect(image).toHaveAttribute('width', '24');
      expect(image).toHaveAttribute('height', '24');
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('should apply filter and dark:invert classes to icon', () => {
      render(<NavigationLinks {...defaultProps} />);

      const image = screen.getByAltText('Iniciar sesión');
      expect(image).toHaveClass('filter', 'dark:invert');
    });

    it('should have hover:underline class', () => {
      render(<NavigationLinks {...defaultProps} />);

      const loginLink = screen.getByTestId('login-link');
      expect(loginLink).toHaveClass('hover:underline');
    });
  });

  describe('Theme toggle button', () => {
    it('should render theme toggle button in desktop variant', () => {
      render(<NavigationLinks {...defaultProps} variant="desktop" />);

      expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();
    });

    it('should not render theme toggle button in mobile variant', () => {
      render(<NavigationLinks {...defaultProps} variant="mobile" />);

      expect(screen.queryByTestId('theme-toggle-button')).not.toBeInTheDocument();
    });

    it('should render Moon icon when isDarkMode is false', () => {
      render(<NavigationLinks {...defaultProps} isDarkMode={false} />);

      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
    });

    it('should render Sun icon when isDarkMode is true', () => {
      render(<NavigationLinks {...defaultProps} isDarkMode={true} />);

      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });

    it('should call onThemeToggle when clicked', () => {
      render(<NavigationLinks {...defaultProps} variant="desktop" />);

      const themeButton = screen.getByTestId('theme-toggle-button');
      fireEvent.click(themeButton);

      expect(mockOnThemeToggle).toHaveBeenCalledTimes(1);
    });

    it('should have outline variant', () => {
      render(<NavigationLinks {...defaultProps} variant="desktop" />);

      const themeButton = screen.getByTestId('theme-toggle-button');
      expect(themeButton).toHaveAttribute('data-variant', 'outline');
    });

    it('should have correct CSS classes', () => {
      render(<NavigationLinks {...defaultProps} variant="desktop" />);

      const themeButton = screen.getByTestId('theme-toggle-button');
      expect(themeButton).toHaveClass(
        'rounded-full',
        'transition-all',
        'duration-300',
        'hover:scale-110',
        'bg-transparent'
      );
    });
  });

  describe('Variant behavior', () => {
    it('should default to desktop variant when not specified', () => {
      render(<NavigationLinks {...defaultProps} />);

      // Desktop variant should show theme toggle button
      expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();
    });

    it('should apply desktop variant explicitly', () => {
      render(<NavigationLinks {...defaultProps} variant="desktop" />);

      expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();
    });

    it('should apply mobile variant', () => {
      render(<NavigationLinks {...defaultProps} variant="mobile" />);

      expect(screen.queryByTestId('theme-toggle-button')).not.toBeInTheDocument();
    });
  });

  describe('Event handlers', () => {
    it('should not call handlers on render', () => {
      render(<NavigationLinks {...defaultProps} />);

      expect(mockOnContactClick).not.toHaveBeenCalled();
      expect(mockOnLinkClick).not.toHaveBeenCalled();
      expect(mockOnThemeToggle).not.toHaveBeenCalled();
    });

    it('should call onContactClick with event object', () => {
      render(<NavigationLinks {...defaultProps} />);

      const contactLink = screen.getByTestId('contact-link');
      fireEvent.click(contactLink);

      expect(mockOnContactClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should handle multiple clicks correctly', () => {
      render(<NavigationLinks {...defaultProps} />);

      const contactLink = screen.getByTestId('contact-link');
      fireEvent.click(contactLink);
      fireEvent.click(contactLink);
      fireEvent.click(contactLink);

      expect(mockOnContactClick).toHaveBeenCalledTimes(3);
    });

    it('should call different handlers independently', () => {
      render(<NavigationLinks {...defaultProps} variant="desktop" />);

      fireEvent.click(screen.getByTestId('contact-link'));
      fireEvent.click(screen.getByTestId('login-link'));
      fireEvent.click(screen.getByTestId('theme-toggle-button'));

      expect(mockOnContactClick).toHaveBeenCalledTimes(1);
      expect(mockOnLinkClick).toHaveBeenCalledTimes(1);
      expect(mockOnThemeToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Theme toggle transitions', () => {
    it('should switch from Moon to Sun icon when isDarkMode changes', () => {
      const { rerender } = render(
        <NavigationLinks {...defaultProps} isDarkMode={false} variant="desktop" />
      );

      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

      rerender(
        <NavigationLinks {...defaultProps} isDarkMode={true} variant="desktop" />
      );

      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });

    it('should switch from Sun to Moon icon when isDarkMode changes', () => {
      const { rerender } = render(
        <NavigationLinks {...defaultProps} isDarkMode={true} variant="desktop" />
      );

      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();

      rerender(
        <NavigationLinks {...defaultProps} isDarkMode={false} variant="desktop" />
      );

      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible alt text for login icon', () => {
      render(<NavigationLinks {...defaultProps} />);

      const image = screen.getByAltText('Iniciar sesión');
      expect(image).toBeInTheDocument();
    });

    it('should use semantic button element for dropdown trigger', () => {
      render(<NavigationLinks {...defaultProps} />);

      const dropdown = screen.getByTestId('api-lab-dropdown');
      expect(dropdown.tagName).toBe('BUTTON');
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined variant gracefully', () => {
      const props = { ...defaultProps };
      delete (props as any).variant;

      render(<NavigationLinks {...props} />);

      // Should default to desktop variant
      expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();
    });

    it('should render correctly when all handlers are undefined', () => {
      const props = {
        onContactClick: vi.fn(),
        onLinkClick: vi.fn(),
        onThemeToggle: vi.fn(),
        isDarkMode: false,
      };

      expect(() => render(<NavigationLinks {...props} />)).not.toThrow();
    });

    it('should handle rapid theme toggles', () => {
      render(<NavigationLinks {...defaultProps} variant="desktop" />);

      const themeButton = screen.getByTestId('theme-toggle-button');
      
      fireEvent.click(themeButton);
      fireEvent.click(themeButton);
      fireEvent.click(themeButton);

      expect(mockOnThemeToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe('Integration', () => {
    it('should render complete navigation structure', () => {
      const { container } = render(<NavigationLinks {...defaultProps} variant="desktop" />);

      expect(screen.getByTestId('contact-link')).toBeInTheDocument();
      expect(screen.getByTestId('api-lab-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('login-link')).toBeInTheDocument();
      expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should maintain proper structure in mobile variant', () => {
      render(<NavigationLinks {...defaultProps} variant="mobile" />);

      expect(screen.getByTestId('contact-link')).toBeInTheDocument();
      expect(screen.getByTestId('api-lab-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('login-link')).toBeInTheDocument();
      expect(screen.queryByTestId('theme-toggle-button')).not.toBeInTheDocument();
    });
  });
});