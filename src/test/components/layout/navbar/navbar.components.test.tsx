/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, vi, describe, it, expect } from "vitest";
import { render, fireEvent, screen} from "@testing-library/react";
import { Navbar } from "@/components/layout/navbar/navbar.components";
import { useNavbar } from "@/components/layout/navbar/hooks/useNavbar";

vi.mock('@/components/layout/navbar/hooks/useNavbar');

vi.mock('../../../../components/layout/navbar/components/Logo', () => ({
  Logo: (logoSrc:string) => <div data-testid="logo-mock">{`Logo Mock - ${logoSrc}`}</div>
}))

vi.mock('../../../../components/layout/navbar/components/StatusIndicator', () => ({
  StatusIndicator: (props:any) => <div data-testid="status-indicator-mock">{`Status Indicator Mock - ${props.online}`}</div>
}))

vi.mock('../../../../components/layout/navbar/components/MobileMenuToggle', () => ({
  MobileMenuToggle: ({onClick,mobileMenuOpen}: {onClick: () => void, mobileMenuOpen: boolean}) => <button data-testid="mobile-menu-toggle-mock" onClick={() => onClick()}>{mobileMenuOpen ? "Close Menu" : "Open Menu"}</button>
}))

vi.mock('../../../../components/layout/navbar/components/DesktopMenu', () => ({
  DesktopMenu: ({onContactClick, onLinkClick, onThemeToggle, isDarkMode}: {onContactClick: () => void, onLinkClick: () => void, onThemeToggle: () => void, isDarkMode: boolean}) => {
    return (
      <div data-testid="desktop-menu-mock">
        <button onClick={onContactClick} data-testid="desktop-menu-contact-button">Contact</button>
        <button onClick={onLinkClick} data-testid="desktop-menu-link-button">Link</button>
        <button onClick={onThemeToggle} data-testid="desktop-menu-theme-button">{isDarkMode ? "Light Mode" : "Dark Mode"}</button>
      </div>
    );
  }
}))

vi.mock('../../../../components/layout/navbar/components/MobileMenu', () => ({
  MobileMenu: ({isOpen, onContactClick, onLinkClick, onClose}: {isOpen: boolean, onContactClick: () => void, onLinkClick: () => void, onClose: () => void}) => {
    return (
      <div data-testid="mobile-menu-mock">
        <button onClick={onContactClick} data-testid="mobile-menu-contact-button">Contact</button>
        <button onClick={onLinkClick} data-testid="mobile-menu-link-button">Link</button>
        <button onClick={onClose} data-testid="mobile-menu-close-button">Close</button>
        {
          isOpen ? <div data-testid="mobile-menu-open">Menu is Open</div> : <div data-testid="mobile-menu-closed">Menu is Closed</div>
        }
      </div>
    );
  }
}))

describe("Navbar Component", () => {

  const mockhandleClickLink = vi.fn();
  const mockhandleContactClick = vi.fn()
  const mocktoggleMobileMenu = vi.fn();
  const mockcloseMobileMenu = vi.fn();
  const mocktoggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavbar).mockReturnValue({
      online: true,
      mobileMenuOpen: true,
      isDarkMode: true,
      logoSrc: "/test/logo.png",
      isHome: false,
      handleClickLink: mockhandleClickLink,
      handleContactClick: mockhandleContactClick,
      toggleMobileMenu: mocktoggleMobileMenu,
      closeMobileMenu: mockcloseMobileMenu,
      toggleTheme: mocktoggleTheme,
    })
  });

  const renderNavbar = () => render(<Navbar />);

  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render Navbar component correctly", () => {
    renderNavbar();

    expect(screen.getByTestId("logo-mock")).toBeInTheDocument();
    expect(screen.getByTestId("status-indicator-mock")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-menu-toggle-mock")).toBeInTheDocument();
    expect(screen.getByTestId("desktop-menu-mock")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-menu-mock")).toBeInTheDocument();
  });

  it("should handle mobile menu toggle", () => {
    renderNavbar();

    const mobileMenuToggle = screen.getByTestId("mobile-menu-toggle-mock");
    fireEvent.click(mobileMenuToggle);

    expect(mocktoggleMobileMenu).toHaveBeenCalled();
    expect(mockcloseMobileMenu).not.toHaveBeenCalled();
  });

  it("should handle desktop menu interactions", () => {
    renderNavbar();

    const contactButton = screen.getByTestId("desktop-menu-contact-button");
    const linkButton = screen.getByTestId("desktop-menu-link-button");
    const themeButton = screen.getByTestId("desktop-menu-theme-button");

    fireEvent.click(contactButton);
    fireEvent.click(linkButton);
    fireEvent.click(themeButton);

    expect(mockhandleContactClick).toHaveBeenCalled();
    expect(mockhandleClickLink).toHaveBeenCalled();
    expect(mocktoggleTheme).toHaveBeenCalled();
  });

  it("should handle mobile menu interactions", () => {
    renderNavbar();

    const contactButton = screen.getByTestId("mobile-menu-contact-button");
    const linkButton = screen.getByTestId("mobile-menu-link-button");
    const closeButton = screen.getByTestId("mobile-menu-close-button");

    fireEvent.click(contactButton);
    fireEvent.click(linkButton);
    fireEvent.click(closeButton);

    expect(mockhandleContactClick).toHaveBeenCalled();
    expect(mockhandleClickLink).toHaveBeenCalled();
    expect(mockcloseMobileMenu).toHaveBeenCalled();
  });

});
