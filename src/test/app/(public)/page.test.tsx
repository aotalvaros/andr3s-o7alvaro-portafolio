import Home from "@/app/(public)/page";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
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

vi.mock("../../../components/ui/ScrollProgress", () => ({
    ScrollProgress: () => <div data-testid="scroll-progress">Scroll Progress</div>,
}));

describe("Home component", () => {

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders all main sections", () => {
        render(<Home />);
        expect(screen.getByTestId("hero-section")).toBeInTheDocument();
        expect(screen.getByTestId("skills-section")).toBeInTheDocument();
        expect(screen.getByTestId("about-section")).toBeInTheDocument();
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

    it("renders ScrollProgress component", () => {
        render(<Home />);
        expect(screen.getByTestId("scroll-progress")).toBeInTheDocument();
    });

});