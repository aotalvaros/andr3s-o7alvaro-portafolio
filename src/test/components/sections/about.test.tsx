import { afterEach, vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from '../../../components/sections/about';

vi.mock("../../../components/ui/ScrollReveal", () => ({
    ScrollReveal: ({ children }: { children: React.ReactNode }) => (<div>{children}</div>),
}))

describe("About Test", () => {
    
    const setUp = () => {
        render(<About />);
    }

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should render About section", () => {
        setUp();
        const aboutSection = screen.getByTestId("about-section");
        expect(aboutSection).toBeInTheDocument();
    });

    it("should render profile image", () => {
        setUp();
        const profileImage = screen.getByAltText("Foto de Andrés");
        expect(profileImage).toBeInTheDocument();
    });

    it("should render technologies badges", () => {
        setUp();
        const technologies = screen.getAllByText(/React|Next\.js|TypeScript|TailwindCSS|SASS|Jest|Vitest|Azure|Git|SQL/i);
        expect(technologies).toHaveLength(16);
    });
});