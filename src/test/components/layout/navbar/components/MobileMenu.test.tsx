/* eslint-disable @typescript-eslint/no-explicit-any */
import { MobileMenu } from "@/components/layout/navbar/components/MobileMenu";
import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

Object.defineProperty(window, 'location', {
    value: {
        href: 'http://localhost:3000/',
        origin: 'http://localhost:3000',
        protocol: 'http:',
        host: 'localhost:3000',
        pathname: '/',
        search: '',
        hash: '',
        assign: vi.fn(),
        replace: vi.fn(),
        reload: vi.fn(),
    },
    writable: true,
});

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
    default: ({ children, href, onClick, className, ...props }: any) => {
        const handleClick = (e: any) => {
            e.preventDefault();
            if (onClick) onClick(e);
        };
        return (
            <a href={href} onClick={handleClick} className={className} {...props}>
                {children}
            </a>
        );
    },
}));

vi.mock("next/image", () => ({
    default: ({ src, alt, width, height, className, loading, ...props }: any) => (
        <img 
            src={src} 
            alt={alt} 
            width={width} 
            height={height} 
            className={className}
            data-loading={loading}
            {...props} 
        />
    ),
}));

// Mock Radix UI components with more realistic behavior
vi.mock("@radix-ui/react-dropdown-menu", () => ({
    DropdownMenu: ({ children }: any) => <div data-testid="dropdown-menu">{children}</div>,
    DropdownMenuTrigger: ({ children, asChild }: any) => {
        if (asChild) {
            return children;
        }
        return <div data-testid="dropdown-trigger">{children}</div>;
    },
    DropdownMenuContent: ({ children, align, className }: any) => 
        <div data-testid="dropdown-content" data-align={align} className={className}>{children}</div>,
    DropdownMenuSub: ({ children }: any) => <div data-testid="dropdown-sub">{children}</div>,
    DropdownMenuSubTrigger: ({ children, className }: any) => 
        <div data-testid="dropdown-sub-trigger" className={className}>{children}</div>,
    DropdownMenuPortal: ({ children }: any) => <div data-testid="dropdown-portal">{children}</div>,
    DropdownMenuSubContent: ({ children, className }: any) => 
        <div data-testid="dropdown-sub-content" className={className}>{children}</div>,
    DropdownMenuItem: ({ children, asChild }: any) => {
        if (asChild) {
            return children;
        }
        return <div data-testid="dropdown-item">{children}</div>;
    },
}));

describe("MobileMenu Component", () => {
    const mockOnContactClick = vi.fn();
    const mockOnLinkClick = vi.fn();
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it("should not render when isOpen is false", () => {
        render(<MobileMenu isOpen={false} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const menu = screen.queryByTestId("mobile-menu");
        expect(menu).not.toBeInTheDocument();
    });

    it("should render when isOpen is true", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const menu = screen.getByTestId("mobile-menu");
        expect(menu).toBeInTheDocument();
    });

    it("should call onContactClick and onClose when contact link is clicked", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const contactLink = screen.getByTestId("contact-link");
        
        fireEvent.click(contactLink);
        
        expect(mockOnContactClick).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should render contact link with correct href and text", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const contactLink = screen.getByTestId("contact-link");
        
        expect(contactLink).toHaveAttribute("href", "/#contact");
        expect(contactLink).toHaveTextContent("Contacto");
    });

    it("should render API lab dropdown button", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const dropdown = screen.getByTestId("api-lab-dropdown");
        
        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toHaveTextContent("Laboratorio de APIs ▼");
    });

    it("should render all NASA API lab links", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        
        const asteroidsLink = screen.getByTestId("api-lab-asteroids-link");
        const marsRoverLink = screen.getByTestId("api-lab-mars-rover-link");
        
        expect(asteroidsLink).toBeInTheDocument();
        expect(asteroidsLink).toHaveAttribute("href", "/lab/asteroids");
        expect(asteroidsLink).toHaveTextContent("🌌 Asteroides");
        
        expect(marsRoverLink).toBeInTheDocument();
        expect(marsRoverLink).toHaveAttribute("href", "/lab/mars-rover");
        expect(marsRoverLink).toHaveTextContent("🚀 Mars Rover");
    });

    it("should render Pokemon API lab link", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        
        const pokemonLink = screen.getByTestId("api-lab-pokemon-link");
        
        expect(pokemonLink).toBeInTheDocument();
        expect(pokemonLink).toHaveAttribute("href", "/lab/pokemon");
        expect(pokemonLink).toHaveTextContent("🐲 Pokédex");
    });

    it("should call onLinkClick and onClose when asteroids link is clicked", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const asteroidsLink = screen.getByTestId("api-lab-asteroids-link");
        
        fireEvent.click(asteroidsLink);
        
        expect(mockOnLinkClick).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onLinkClick and onClose when mars rover link is clicked", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const marsRoverLink = screen.getByTestId("api-lab-mars-rover-link");
        
        fireEvent.click(marsRoverLink);
        
        expect(mockOnLinkClick).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onLinkClick and onClose when pokemon link is clicked", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const pokemonLink = screen.getByTestId("api-lab-pokemon-link");
        
        fireEvent.click(pokemonLink);
        
        expect(mockOnLinkClick).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should render login link with image", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        
        const loginLink = screen.getByTestId("login-link");
        const loginImage = screen.getByAltText("Iniciar sesión");
        
        expect(loginLink).toBeInTheDocument();
        expect(loginLink).toHaveAttribute("href", "/login");
        expect(loginImage).toBeInTheDocument();
        expect(loginImage).toHaveAttribute("src", "/assets/settings_24dp.svg");
        expect(loginImage).toHaveAttribute("width", "24");
        expect(loginImage).toHaveAttribute("height", "24");
    });

    it("should call onLinkClick and onClose when login link is clicked", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const loginLink = screen.getByTestId("login-link");
        
        fireEvent.click(loginLink);
        
        expect(mockOnLinkClick).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should have correct CSS classes on mobile menu container", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const menu = screen.getByTestId("mobile-menu");
        
        expect(menu).toHaveClass("md:hidden", "flex", "flex-col", "gap-4", "px-4", "pb-4", "dark:border-primary");
    });

    it("should have correct CSS classes on contact link", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const contactLink = screen.getByTestId("contact-link");
        
        expect(contactLink).toHaveClass("hover:underline", "dark:text-secondary");
    });

    it("should have correct CSS classes on login image", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const loginImage = screen.getByAltText("Iniciar sesión");
        
        expect(loginImage).toHaveClass("filter", "dark:invert");
        expect(loginImage).toHaveAttribute("data-loading", "lazy");
    });

    it("should render dropdown menu structure correctly", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        
        const dropdownMenu = screen.getByTestId("dropdown-menu");
        const dropdownContent = screen.getByTestId("dropdown-content");
        const dropdownSub = screen.getByTestId("dropdown-sub");
        const dropdownSubTrigger = screen.getByTestId("dropdown-sub-trigger");
        const dropdownPortal = screen.getByTestId("dropdown-portal");
        const dropdownSubContent = screen.getByTestId("dropdown-sub-content");
        
        expect(dropdownMenu).toBeInTheDocument();
        expect(dropdownContent).toBeInTheDocument();
        expect(dropdownSub).toBeInTheDocument();
        expect(dropdownSubTrigger).toBeInTheDocument();
        expect(dropdownPortal).toBeInTheDocument();
        expect(dropdownSubContent).toBeInTheDocument();
    });

    it("should pass correct event object to onContactClick", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const contactLink = screen.getByTestId("contact-link");
        
        fireEvent.click(contactLink);
        
        expect(mockOnContactClick).toHaveBeenCalledWith(expect.any(Object));
        const callArg = mockOnContactClick.mock.calls[0][0];
        expect(callArg).toHaveProperty('type', 'click');
    });

    it("should not call any handlers when component is not open", () => {
        render(<MobileMenu isOpen={false} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        
        expect(mockOnContactClick).not.toHaveBeenCalled();
        expect(mockOnLinkClick).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should render all links when menu is open", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        
        const allLinks = screen.getAllByRole("link");
        expect(allLinks).toHaveLength(5); // Contact, Asteroids, Mars Rover, Pokemon, Login
    });

    it("should handle multiple rapid clicks correctly", () => {
        render(<MobileMenu isOpen={true} onContactClick={mockOnContactClick} onLinkClick={mockOnLinkClick} onClose={mockOnClose} />);
        const contactLink = screen.getByTestId("contact-link");
        
        fireEvent.click(contactLink);
        fireEvent.click(contactLink);
        fireEvent.click(contactLink);
        
        expect(mockOnContactClick).toHaveBeenCalledTimes(3);
        expect(mockOnClose).toHaveBeenCalledTimes(3);
    });
});