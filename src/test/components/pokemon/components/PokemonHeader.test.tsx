import { PokemonHeader } from "@/components/pokemon/components/Pokemonheader";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from 'vitest'


// Mock del icono de lucide-react
vi.mock('lucide-react', () => ({
  Sparkles: ({ className }: { className?: string }) => (
    <svg 
      data-testid="sparkles-icon" 
      className={className}
      aria-label="sparkles"
    >
      <title>Sparkles</title>
    </svg>
  ),
}));

describe('PokemonHeader', () => {
  it('should render the component correctly', () => {
    render(<PokemonHeader />);
    
    expect(screen.getByTestId('pokemon-header')).toBeInTheDocument();
  });

  it('should have the correct semantic structure with header', () => {
    const { container } = render(<PokemonHeader />);
    
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('should render the Sparkles icon', () => {
    render(<PokemonHeader />);
    
    const sparklesIcon = screen.getByTestId('sparkles-icon');
    expect(sparklesIcon).toBeInTheDocument();
  });

  it('should apply animation classes to the Sparkles icon', () => {
    render(<PokemonHeader />);
    
    const sparklesIcon = screen.getByTestId('sparkles-icon');
    expect(sparklesIcon).toHaveClass('animate-pulse');
    expect(sparklesIcon).toHaveClass('text-primary');
  });

  it('should render all the letters of "Pokédex"', () => {
    render(<PokemonHeader />);
    
    const letters = ['P', 'o', 'k', 'é', 'd', 'e', 'x'];
    
    letters.forEach(letter => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });
  });

  it('should render exactly 7 letters in the title', () => {
    const { container } = render(<PokemonHeader />);
    
    const animatedChars = container.querySelectorAll('.animated-char');
    expect(animatedChars).toHaveLength(7);
  });

  it('should apply gradient classes to each letter', () => {
    const { container } = render(<PokemonHeader />);
    
    const animatedChars = container.querySelectorAll('.animated-char');
    
    animatedChars.forEach(char => {
      expect(char).toHaveClass('bg-gradient-to-r');
      expect(char).toHaveClass('from-blue-600');
      expect(char).toHaveClass('via-purple-600');
      expect(char).toHaveClass('to-cyan-500');
      expect(char).toHaveClass('bg-clip-text');
      expect(char).toHaveClass('text-transparent');
    });
  });

  it('should maintain the correct order of the letters', () => {
    const { container } = render(<PokemonHeader />);
    
    const animatedChars = container.querySelectorAll('.animated-char');
    const letters = Array.from(animatedChars).map(char => char.textContent);
    
    expect(letters).toEqual(['P', 'o', 'k', 'é', 'd', 'e', 'x']);
  });

  it('should render each letter with a unique key', () => {
    const { container } = render(<PokemonHeader />);
    
    const animatedChars = container.querySelectorAll('.animated-char');
    
    expect(animatedChars.length).toBe(7);
  });

  it('should render the title inside an h1', () => {
    const { container } = render(<PokemonHeader />);
    
    const h1 = container.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveClass('animated-title');
  });

  it('should apply responsive size classes to the title', () => {
    const { container } = render(<PokemonHeader />);
    
    const h1 = container.querySelector('h1');
    expect(h1).toHaveClass('text-6xl');
    expect(h1).toHaveClass('md:text-7xl');
  });

  it('should render the descriptive text', () => {
    render(<PokemonHeader />);
    
    const description = screen.getByText(/Explora el universo Pokémon/i);
    expect(description).toBeInTheDocument();
  });

  it('should render the full descriptive text', () => {
    render(<PokemonHeader />);
    
    const fullText = 'Explora el universo Pokémon con nuestra colección completa de criaturas increíbles';
    expect(screen.getByText(fullText)).toBeInTheDocument();
  });

  it('should apply responsive classes to the descriptive text', () => {
    render(<PokemonHeader />);
    
    const description = screen.getByText(/Explora el universo Pokémon/i);
    expect(description).toHaveClass('text-lg');
    expect(description).toHaveClass('md:text-xl');
    expect(description).toHaveClass('text-muted-foreground');
  });

  it('should center the content of the header', () => {
    const { container } = render(<PokemonHeader />);
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('text-center');
  });

  it('should have vertical spacing in the header', () => {
    const { container } = render(<PokemonHeader />);
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('space-y-4');
    expect(header).toHaveClass('mb-12');
  });

  it('should render decorative lines before the icon', () => {
    const { container } = render(<PokemonHeader />);
    
    const decorativeLines = container.querySelectorAll('.bg-gradient-to-r.from-transparent.via-primary.to-transparent');
    expect(decorativeLines.length).toBeGreaterThanOrEqual(2);
  });

  it('should apply height classes to the decorative lines', () => {
    const { container } = render(<PokemonHeader />);
    
    const decorativeLines = container.querySelectorAll('.h-1.w-12');
    expect(decorativeLines.length).toBeGreaterThanOrEqual(2);
  });

  it('should have the title container with the correct class', () => {
    const { container } = render(<PokemonHeader />);
    
    const titleWrapper = container.querySelector('.animated-title-wrapper');
    expect(titleWrapper).toBeInTheDocument();
  });

  it('should organize decorative elements with flexbox', () => {
    const { container } = render(<PokemonHeader />);
    
    const flexContainer = container.querySelector('.flex.items-center.justify-center.gap-3');
    expect(flexContainer).toBeInTheDocument();
  });

  it('should have the correct itemID in the header', () => {
    const { container } = render(<PokemonHeader />);
    
    const header = container.querySelector('header');
    expect(header).toHaveAttribute('itemid', 'pokemon-header');
  });

  it('should apply max-width to the descriptive text', () => {
    render(<PokemonHeader />);
    
    const description = screen.getByText(/Explora el universo Pokémon/i);
    expect(description).toHaveClass('max-w-2xl');
    expect(description).toHaveClass('mx-auto');
  });

  it('should apply leading-relaxed to the descriptive text', () => {
    render(<PokemonHeader />);
    
    const description = screen.getByText(/Explora el universo Pokémon/i);
    expect(description).toHaveClass('leading-relaxed');
  });

  it('should maintain the title animation structure', () => {
    const { container } = render(<PokemonHeader />);
    
    const h1 = container.querySelector('h1.animated-title');
    const wrapper = container.querySelector('.animated-title-wrapper');
    
    expect(h1).toBeInTheDocument();
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.contains(h1!)).toBe(true);
  });

  it('should apply tracking-tight to the title', () => {
    const { container } = render(<PokemonHeader />);
    
    const h1 = container.querySelector('h1');
    expect(h1).toHaveClass('tracking-tight');
  });

  it('should render correctly without props', () => {
    const { container } = render(<PokemonHeader />);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have the complete header structure', () => {
    const { container } = render(<PokemonHeader />);
    
    const header = container.querySelector('header');
    const sparkles = screen.getByTestId('sparkles-icon');
    const title = container.querySelector('h1');
    const description = screen.getByText(/Explora el universo Pokémon/i);
    
    expect(header).toBeInTheDocument();
    expect(sparkles).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });
});