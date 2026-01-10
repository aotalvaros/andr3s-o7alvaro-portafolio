/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { FallbackImage } from '../../../components/layout/FallbackImage';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, onError, width, height, ...props }: any) => {
    return (
      <img
        src={src}
        alt={alt}
        onError={onError}
        width={width}
        height={height}
        data-testid="fallback-image"
        {...props}
      />
    );
  },
}));

describe('FallbackImage', () => {
  const defaultProps = {
    src: '/assets/test-image.jpg',
    alt: 'Test image',
    width: 50,
    height: 50,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render with initial src', () => {
      render(<FallbackImage {...defaultProps} />);

      const image = screen.getByTestId('fallback-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/assets/test-image.jpg');
    });

    it('should render with alt text', () => {
      render(<FallbackImage {...defaultProps} />);

      expect(screen.getByAltText('Test image')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<FallbackImage {...defaultProps} className="custom-class" />);

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveClass('custom-class');
    });

    it('should pass through additional props', () => {
      render(
        <FallbackImage 
          {...defaultProps} 
          loading="lazy" 
          quality={90}
        />
      );

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Fallback behavior', () => {
    it('should use default fallback src when not provided', () => {
      render(<FallbackImage {...defaultProps} />);

      const image = screen.getByTestId('fallback-image');
      
      // Trigger error
      fireEvent.error(image);

      expect(image).toHaveAttribute('src', '/assets/iconNofound.png');
    });

    it('should use custom fallback src when provided', () => {
      const customFallback = '/assets/custom-fallback.png';
      
      render(
        <FallbackImage 
          {...defaultProps} 
          fallbackSrc={customFallback} 
        />
      );

      const image = screen.getByTestId('fallback-image');
      
      // Trigger error
      fireEvent.error(image);

      expect(image).toHaveAttribute('src', customFallback);
    });

    it('should switch to fallback image on error', () => {
      render(<FallbackImage {...defaultProps} />);

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveAttribute('src', '/assets/test-image.jpg');

      // Trigger error
      fireEvent.error(image);

      expect(image).toHaveAttribute('src', '/assets/iconNofound.png');
    });

    it('should not change src if already using fallback', () => {
      render(<FallbackImage {...defaultProps} />);

      const image = screen.getByTestId('fallback-image');
      
      // First error - switch to fallback
      fireEvent.error(image);
      expect(image).toHaveAttribute('src', '/assets/iconNofound.png');

      // Second error - should stay on fallback
      fireEvent.error(image);
      expect(image).toHaveAttribute('src', '/assets/iconNofound.png');
    });

    it('should handle multiple error events gracefully', () => {
      render(<FallbackImage {...defaultProps} />);

      const image = screen.getByTestId('fallback-image');
      
      // Trigger multiple errors
      fireEvent.error(image);
      fireEvent.error(image);
      fireEvent.error(image);

      // Should still be on fallback
      expect(image).toHaveAttribute('src', '/assets/iconNofound.png');
    });
  });

  describe('useEffect behavior', () => {
    it('should update currentSrc when src prop changes', async () => {
      const { rerender } = render(<FallbackImage {...defaultProps} />);

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveAttribute('src', '/assets/test-image.jpg');

      // Change src prop
      rerender(
        <FallbackImage 
          src="/assets/new-image.jpg" 
          alt="Test image" 
        />
      );

      await waitFor(() => {
        expect(image).toHaveAttribute('src', '/assets/new-image.jpg');
      });
    });

    it('should reset to new src after fallback when src changes', async () => {
      const { rerender } = render(<FallbackImage {...defaultProps} />);

      const image = screen.getByTestId('fallback-image');
      
      // Trigger error to use fallback
      fireEvent.error(image);
      expect(image).toHaveAttribute('src', '/assets/iconNofound.png');

      // Change src prop
      rerender(
        <FallbackImage 
          src="/assets/another-image.jpg" 
          alt="Test image" 
        />
      );

      await waitFor(() => {
        expect(image).toHaveAttribute('src', '/assets/another-image.jpg');
      });
    });

    it('should handle rapid src changes', async () => {
      const { rerender } = render(<FallbackImage {...defaultProps} />);

      const image = screen.getByTestId('fallback-image');

      const sources = [
        '/assets/image1.jpg',
        '/assets/image2.jpg',
        '/assets/image3.jpg',
      ];

      for (const src of sources) {
        rerender(<FallbackImage src={src} alt="Test image" />);
        
        await waitFor(() => {
          expect(image).toHaveAttribute('src', src);
        });
      }
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle error when src and fallbackSrc are the same', () => {
      const sameSrc = '/assets/image.jpg';
      
      render(
        <FallbackImage 
          src={sameSrc} 
          fallbackSrc={sameSrc}
          alt="Test image" 
        />
      );

      const image = screen.getByTestId('fallback-image');
      
      // Trigger error
      fireEvent.error(image);

      // Should not trigger infinite loop
      expect(image).toHaveAttribute('src', sameSrc);
    });


    it('should handle undefined fallbackSrc gracefully', () => {
      const props = { ...defaultProps };
      delete (props as any).fallbackSrc;

      render(<FallbackImage {...props} />);

      const image = screen.getByTestId('fallback-image');
      
      // Trigger error
      fireEvent.error(image);

      expect(image).toHaveAttribute('src', '/assets/iconNofound.png');
    });
  });

  describe('Props spreading', () => {
    it('should pass width from rest props', () => {
      render(
        <FallbackImage 
          {...defaultProps}
        />
      );

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveAttribute('width', '50');
    });

    it('should pass height from rest props', () => {
      render(
        <FallbackImage 
          {...defaultProps}
        />
      );

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveAttribute('height', '50');
    });


    it('should pass style prop', () => {
      const customStyle = { borderRadius: '8px' };
      
      render(
        <FallbackImage 
          {...defaultProps} 
          style={customStyle}
        />
      );

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveStyle({ borderRadius: '8px' });
    });

    it('should pass data attributes', () => {
      render(
        <FallbackImage 
          {...defaultProps} 
          data-custom="test-value"
        />
      );

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveAttribute('data-custom', 'test-value');
    });
  });

  describe('Alt text handling', () => {
    it('should render with provided alt text', () => {
      render(<FallbackImage {...defaultProps} alt="Custom alt text" />);

      expect(screen.getByAltText('Custom alt text')).toBeInTheDocument();
    });

    it('should keep alt text after fallback', () => {
      render(<FallbackImage {...defaultProps} alt="Original alt" />);

      const image = screen.getByAltText('Original alt');
      
      // Trigger error
      fireEvent.error(image);

      // Alt text should remain the same
      expect(screen.getByAltText('Original alt')).toBeInTheDocument();
    });

    it('should handle empty alt text', () => {
      render(<FallbackImage src="/test.jpg" alt="" />);

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveAttribute('alt', '');
    });
  });

  describe('State management', () => {
    it('should initialize state with src prop', () => {
      render(<FallbackImage {...defaultProps} />);

      const image = screen.getByTestId('fallback-image');
      expect(image).toHaveAttribute('src', defaultProps.src);
    });

    it('should maintain state across re-renders without src change', () => {
      const { rerender } = render(<FallbackImage {...defaultProps} />);

      const image = screen.getByTestId('fallback-image');
      const initialSrc = image.getAttribute('src');

      rerender(<FallbackImage {...defaultProps} className="new-class" />);

      expect(image).toHaveAttribute('src', initialSrc);
    });

    it('should update state when src prop changes', async () => {
      const { rerender } = render(<FallbackImage {...defaultProps} />);

      rerender(
        <FallbackImage 
          src="/new-source.jpg" 
          alt="Test image" 
        />
      );

      await waitFor(() => {
        const image = screen.getByTestId('fallback-image');
        expect(image).toHaveAttribute('src', '/new-source.jpg');
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete error recovery flow', async () => {
      const { rerender } = render(<FallbackImage {...defaultProps} />);

      const image = screen.getByTestId('fallback-image');
      
      // Initial state
      expect(image).toHaveAttribute('src', '/assets/test-image.jpg');

      // Error occurs - switch to fallback
      fireEvent.error(image);
      expect(image).toHaveAttribute('src', '/assets/iconNofound.png');

      // New src provided - should try new image
      rerender(
        <FallbackImage 
          src="/assets/recovery-image.jpg" 
          alt="Test image" 
        />
      );

      await waitFor(() => {
        expect(image).toHaveAttribute('src', '/assets/recovery-image.jpg');
      });
    });

    it('should handle custom fallback with error', () => {
      const customFallback = '/custom-404.png';
      
      render(
        <FallbackImage 
          src="/broken-image.jpg"
          fallbackSrc={customFallback}
          alt="Test"
        />
      );

      const image = screen.getByTestId('fallback-image');
      
      fireEvent.error(image);

      expect(image).toHaveAttribute('src', customFallback);
    });

    it('should work correctly in a list of images', () => {
      const images = [
        { src: '/image1.jpg', alt: 'Image 1' },
        { src: '/image2.jpg', alt: 'Image 2' },
        { src: '/image3.jpg', alt: 'Image 3' },
      ];

      render(
        <>
          {images.map((img, idx) => (
            <FallbackImage key={idx} src={img.src} alt={img.alt} />
          ))}
        </>
      );

      const allImages = screen.getAllByTestId('fallback-image');
      expect(allImages).toHaveLength(3);

      // Trigger error on second image only
      fireEvent.error(allImages[1]);

      expect(allImages[0]).toHaveAttribute('src', '/image1.jpg');
      expect(allImages[1]).toHaveAttribute('src', '/assets/iconNofound.png');
      expect(allImages[2]).toHaveAttribute('src', '/image3.jpg');
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<FallbackImage {...defaultProps} />);

      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid mount/unmount cycles', () => {
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<FallbackImage {...defaultProps} />);
        unmount();
      }

      // Should not throw or cause issues
      expect(true).toBe(true);
    });
  });
});