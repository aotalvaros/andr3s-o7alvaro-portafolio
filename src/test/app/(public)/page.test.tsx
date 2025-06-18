import Home from "@/app/(public)/page";
import { useActiveSection } from "@/context/ActiveSectionProvider";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";


vi.mock("@/components/sections/about", () => ({
    About: () => <div data-testid="about-section">About Section</div>,
}));

vi.mock("@/components/sections/hero", () => ({
    Hero: () => <div data-testid="hero-section">Hero Section</div>,
}));

vi.mock("@/components/sections/skills", () => ({
    Skills: () => <div data-testid="skills-section">Skills Section</div>,
}));

interface IFloatingActionButtonProps{
    onClick: () => void;
    className?: string;
    icon: React.ReactNode;
}

vi.mock("@/components/ui/FloatingActionButton", () => ({
    FloatingActionButton: ({ onClick, className, icon }: IFloatingActionButtonProps) => (
        <button data-testid="fab" onClick={onClick} className={className}>
            {icon}
        </button>
    ),
}));

vi.mock("@/context/ActiveSectionProvider");

vi.mock("@/constants/sectionsOrder.constants", () => ({
    sectionsOrder: ["hero", "skills", "about"],
}));


describe("Home component", () => {
    beforeEach(() => {
        vi.mocked(useActiveSection).mockReturnValue({
            activeSection: "hero",
        } as ReturnType<typeof useActiveSection>);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders all main sections", () => {
        render(<Home />);
        expect(screen.getByTestId("hero-section")).toBeInTheDocument();
        expect(screen.getByTestId("skills-section")).toBeInTheDocument();
        expect(screen.getByTestId("about-section")).toBeInTheDocument();
    });

    it("renders FloatingActionButton with ArrowDown icon when not at end", () => {
        render(<Home />);
        const fab = screen.getByTestId("fab");
        expect(fab).toBeInTheDocument();
        expect(fab.querySelector("svg")).toBeInTheDocument();
    });

    it("renders FloatingActionButton with ArrowUp icon when at end", () => {
        vi.mocked(useActiveSection).mockReturnValue({
            activeSection: "about",
        } as ReturnType<typeof useActiveSection>);
        render(<Home />);
        const fab = screen.getByTestId("fab");
        expect(fab).toBeInTheDocument();
        expect(fab.querySelector("svg")).toBeInTheDocument();
    });

    it("calls scrollIntoView on next section when FAB is clicked", () => {
        render(<Home />);
        const nextSectionId = "skills";
        const scrollIntoViewMock = vi.fn();
        const section = document.createElement("div");
        section.id = nextSectionId;
        section.scrollIntoView = scrollIntoViewMock;
        document.body.appendChild(section);

        const fab = screen.getByTestId("fab");
        fireEvent.click(fab);
        expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

        document.body.removeChild(section);
    });

    it("scrolls to first section when at end and FAB is clicked", () => {
        vi.mocked(useActiveSection).mockReturnValue({
            activeSection: "about",
        } as ReturnType<typeof useActiveSection>);
        render(<Home />);
        const firstSectionId = "hero";
        const scrollIntoViewMock = vi.fn();
        const section = document.createElement("div");
        section.id = firstSectionId;
        section.scrollIntoView = scrollIntoViewMock;
        document.body.appendChild(section);

        const fab = screen.getByTestId("fab");
        fireEvent.click(fab);
        expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

        document.body.removeChild(section);
    });

    it("has correct main element classes", () => {
        render(<Home />);
        const main = screen.getByRole("main");
        expect(main).toHaveClass("overflow-y-auto");
        expect(main).toHaveClass("h-full");
        expect(main).toHaveClass("snap-y");
        expect(main).toHaveClass("snap-mandatory");
        expect(main).toHaveClass("scroll-smooth");
    });
});