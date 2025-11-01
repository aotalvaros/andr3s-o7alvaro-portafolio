/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "@/components/layout/navbar.components";
import { useSocketContext } from "@/context/SocketContext";
import { Socket } from "socket.io-client";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

vi.mock("next/link", () => ({
  default: ({ children, href, onClick, ...props }: any) => (
    <a 
      href={href} 
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick(e);
      }} 
      {...props}
    >
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    header: ({ children, ...props }: any) => (
      <header {...props}>{children}</header>
    ),
  },
}));

vi.mock("next/router", () => ({
  Router: {
    events: {
      on: vi.fn(),
      off: vi.fn(),
    },
  },
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/OnlineStatus", () => ({
  OnlineStatus: ({ text, backgroundColor, textColor }: any) => (
    <div className={`${backgroundColor} ${textColor}`}>{text}</div>
  ),
}));

vi.mock("@radix-ui/react-dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  DropdownMenuPortal: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSub: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSubContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  DropdownMenuSubTrigger: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  DropdownMenuTrigger: ({ children, asChild, ...props }: any) =>
    asChild ? children : <div {...props}>{children}</div>,
  DropdownMenuItem: ({ children, asChild, ...props }: any) =>
    asChild ? children : <div {...props}>{children}</div>,
}));

const setLoadingMock = vi.fn();

vi.mock("@/store/loadingStore", () => ({
  useLoadingStore: (
    selector: (store: { setLoading: typeof setLoadingMock }) => unknown
  ) => selector({ setLoading: setLoadingMock }),
}));

vi.mock("@/store/themeStore", () => ({
  useThemeStore: (
    selector: (store: {
      isDarkMode: boolean;
      toggleTheme: () => void;
    }) => unknown
  ) => selector({ isDarkMode: false, toggleTheme: () => {} }),
}));

vi.mock("@/context/SocketContext");

vi.mock("../../../components/layout/items.components", () => ({
  ItemsMenu: ({ handleClickLink }: { handleClickLink: () => void }) => {
    return (
      <div data-testid="items-menu-mock">
        <button
          onClick={handleClickLink}
          data-testid="mocked-items-menu-button"
        >
          Mocked Items Menu
        </button>
      </div>
    );
  },
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSocketContext).mockReturnValue({
      online: true,
      socket: { emit: vi.fn() } as unknown as Socket,
    });
  });

  const renderNavbar = () => render(<Navbar />);

  const setup = () => {
    const user = userEvent.setup();
    return { user };
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render navbar with all basic elements", () => {
    renderNavbar();

    expect(screen.getByTestId("logo-link")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-menu-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("contact-link")).toBeInTheDocument();
    expect(screen.getByTestId("api-lab-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("login-link")).toBeInTheDocument();
    expect(screen.getByTestId("theme-toggle-button")).toBeInTheDocument();
  });

  it("should display online status when socket is connected", () => {
    vi.mocked(useSocketContext).mockReturnValue({
      online: true,
      socket: { emit: vi.fn() } as unknown as Socket,
    });

    renderNavbar();

    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("should display offline status when socket is disconnected", () => {
    vi.mocked(useSocketContext).mockReturnValue({
      online: false,
      socket: { emit: vi.fn() } as unknown as Socket,
    });

    renderNavbar();

    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  it("should display correct logo based on theme", () => {
    renderNavbar();

    const logoImage = screen.getByAltText("Logo");
    expect(logoImage).toHaveAttribute("src", "/assets/LogoAndres.svg");
  });

  it("should toggle mobile menu when hamburger button is clicked", async () => {
    const { user } = setup();
    renderNavbar();

    const mobileMenuToggle = screen.getByTestId("mobile-menu-toggle");

    // Initially, mobile menu should not be visible
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

    // Click to open mobile menu
    await user.click(mobileMenuToggle);

    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });

  it("should display X icon when mobile menu is open", async () => {
    const { user } = setup();
    renderNavbar();

    const mobileMenuToggle = screen.getByTestId("mobile-menu-toggle");

    // Click to open mobile menu
    await user.click(mobileMenuToggle);

    // Should contain X icon (or close indicator)
    expect(mobileMenuToggle).toBeInTheDocument();
  });

  it("should call setLoading when login link is clicked", async () => {
    const { user } = setup();
    renderNavbar();

    const loginLink = screen.getByTestId("login-link");
    await user.click(loginLink);

    expect(setLoadingMock).toHaveBeenCalledWith(true);
  });

  it("should render ItemsMenu component with handleClickLink prop", () => {
    renderNavbar();

    expect(screen.getByTestId("items-menu-mock")).toBeInTheDocument();
  });

  it("should call handleClickLink when ItemsMenu button is clicked", async () => {
    const { user } = setup();
    renderNavbar();

    const itemsMenuButton = screen.getByTestId("mocked-items-menu-button");
    await user.click(itemsMenuButton);

    expect(setLoadingMock).toHaveBeenCalledWith(true);
  });

  it("should setup router event listeners on mount", async () => {
    const nextRouter = await import("next/router");

    renderNavbar();

    expect(nextRouter.Router.events.on).toHaveBeenCalledWith(
      "routeChangeStart",
      expect.any(Function)
    );
    expect(nextRouter.Router.events.on).toHaveBeenCalledWith(
      "routeChangeComplete",
      expect.any(Function)
    );
    expect(nextRouter.Router.events.on).toHaveBeenCalledWith(
      "routeChangeError",
      expect.any(Function)
    );
  });

  it("should cleanup router event listeners on unmount", async () => {
    const nextRouter = await import("next/router");
    const { unmount } = render(<Navbar />);

    unmount();

    expect(nextRouter.Router.events.off).toHaveBeenCalledWith(
      "routeChangeStart",
      expect.any(Function)
    );
    expect(nextRouter.Router.events.off).toHaveBeenCalledWith(
      "routeChangeComplete",
      expect.any(Function)
    );
    expect(nextRouter.Router.events.off).toHaveBeenCalledWith(
      "routeChangeError",
      expect.any(Function)
    );
  });

  it("should have proper accessibility attributes", () => {
    renderNavbar();

    const mobileMenuToggle = screen.getByTestId("mobile-menu-toggle");
    expect(mobileMenuToggle).toHaveAttribute(
      "aria-label",
      "Toggle mobile menu"
    );
  });

  it("should render mobile menu with all navigation links when open", async () => {
    const { user } = setup();
    renderNavbar();

    const mobileMenuToggle = screen.getByTestId("mobile-menu-toggle");
    await user.click(mobileMenuToggle);

    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();

    // Check that mobile menu contains navigation elements
    expect(screen.getAllByTestId("contact-link")).toHaveLength(2); // Desktop and mobile
    expect(screen.getAllByTestId("api-lab-dropdown")).toHaveLength(2); // Desktop and mobile
    expect(screen.getAllByTestId("login-link")).toHaveLength(2); // Desktop and mobile
  });

  it("should render login image with correct attributes", () => {
    renderNavbar();

    const loginImages = screen.getAllByAltText("Iniciar sesión");
    expect(loginImages[0]).toHaveAttribute("src", "/assets/settings_24dp.svg");
    expect(loginImages[0]).toHaveAttribute("width", "24");
    expect(loginImages[0]).toHaveAttribute("height", "24");
  });

  it("should render logo with correct attributes", () => {
    renderNavbar();

    const logoImage = screen.getByAltText("Logo");
    expect(logoImage).toHaveAttribute("width", "155");
    expect(logoImage).toHaveAttribute("height", "90");
    expect(logoImage).toHaveAttribute("loading", "lazy");
  });

  it("should handle mobile menu toggle multiple times", async () => {
    const { user } = setup();
    renderNavbar();

    const mobileMenuToggle = screen.getByTestId("mobile-menu-toggle");

    // Open mobile menu
    await user.click(mobileMenuToggle);
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();

    // Close mobile menu
    await user.click(mobileMenuToggle);
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

    // Open again
    await user.click(mobileMenuToggle);
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });

  it("should render navbar header with correct className", () => {
    renderNavbar();

    const header = screen.getByRole("banner");
    expect(header).toHaveClass(
      "fixed",
      "top-0",
      "left-0",
      "right-0",
      "z-50",
      "glass"
    );
  });

  it("should render navigation with max-width container", () => {
    renderNavbar();

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass(
      "max-w-7xl",
      "mx-auto",
      "flex",
      "items-center",
      "justify-between"
    );
  });

  it("should hide desktop menu on mobile and show mobile toggle", () => {
    renderNavbar();

    const mobileToggle = screen.getByTestId("mobile-menu-toggle");
    expect(mobileToggle).toHaveClass("md:hidden");

    // Desktop menu should have md:flex class
    const desktopMenu = screen.getByTestId("contact-link").closest(".hidden");
    expect(desktopMenu).toHaveClass("hidden", "md:flex");
  });

  it("should render logo link with correct href", () => {
    renderNavbar();

    const logoLink = screen.getByTestId("logo-link");
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("should render contact link with correct href", () => {
    renderNavbar();

    const contactLink = screen.getByTestId("contact-link");
    expect(contactLink).toHaveAttribute("href", "/#contact");
  });

  it("should render login link with correct href", () => {
    renderNavbar();

    const loginLink = screen.getByTestId("login-link");
    expect(loginLink).toHaveAttribute("href", "/login");
  });


  it("should call setLoading when mobile login link is clicked", async () => {
    const { user } = setup();
    renderNavbar();

    // Open mobile menu first
    const mobileMenuToggle = screen.getByTestId("mobile-menu-toggle");
    await user.click(mobileMenuToggle);

    // Get all login links (desktop and mobile)
    const loginLinks = screen.getAllByTestId("login-link");
    const mobileLoginLink = loginLinks[1]; // Second one is mobile

    await user.click(mobileLoginLink);

    expect(setLoadingMock).toHaveBeenCalledWith(true);
  });

  it("should render theme toggle button with correct variant and classes", () => {
    renderNavbar();

    const themeButton = screen.getByTestId("theme-toggle-button");
    expect(themeButton).toHaveClass("rounded-full transition-all duration-300 hover:scale-110 bg-transparent");
  });

  it("should render login setting icon with correct classes", () => {
    renderNavbar();

    const loginImages = screen.getAllByAltText("Iniciar sesión");
    expect(loginImages[0]).toHaveClass("filter", "dark:invert");
  });

  it("should render logo image with correct classes", () => {
    renderNavbar();

    const logoImage = screen.getByAltText("Logo");
    expect(logoImage).toHaveClass(
      "object-cover",
      "w-[33dvw]",
      "min-w-[120px]",
      "md:w-[90%]",
      "select-none"
    );
  });

  it("should render mobile menu with correct classes when opened", async () => {
    const { user } = setup();
    renderNavbar();

    const mobileMenuToggle = screen.getByTestId("mobile-menu-toggle");
    await user.click(mobileMenuToggle);

    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toHaveClass(
      "md:hidden",
      "flex",
      "flex-col",
      "gap-4",
      "px-4",
      "pb-4",
      "dark:border-primary"
    );
  });
});
