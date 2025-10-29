import { afterEach, vi, describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Hero } from '../../../components/sections/hero';

vi.mock("../../../components/ui/GradientText", () => ({
    GradientText: ({ children }: { children: React.ReactNode }) => (<div>{children}</div>),
}))

vi.mock("../../../components/ui/AnimatedText", () => ({
    AnimatedText: ({ text }: { text: string }) => (<div>{text}</div>),
}))

vi.mock("../../../components/ui/FloatingIcon", () => ({
    FloatingIcon: ({ children }: { children: React.ReactNode }) => (<div>{children}</div>),
}))

describe("Hero Test", () => {

    const setUp = () => {
        render(<Hero />);
    }

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should render Hero section", () => {
        setUp();
        const heroSection = screen.getByTestId("hero-section");
        expect(heroSection).toBeInTheDocument();
    });

    it("should render Contact Me link", () => {
        setUp();
        const contactMeLink = screen.getByTestId("contact-me-link");
        expect(contactMeLink).toBeInTheDocument();
    });

    it("should render GitHub, LinkedIn and Email links", () => {
        setUp();
        const githubLink = screen.getByTestId("github-link");
        const linkedinLink = screen.getByTestId("linkedin-link");
        const emailLink = screen.getByTestId("email-link");
        expect(githubLink).toBeInTheDocument();
        expect(linkedinLink).toBeInTheDocument();
        expect(emailLink).toBeInTheDocument();
    });

    it("should scroll to next section on scroll down button click", () => {
        setUp();
        const scrollDownButton = screen.getByTestId("scroll-down-button");
        const scrollToNextMock = vi.fn();
        scrollDownButton.onclick = scrollToNextMock;
        fireEvent.click(scrollDownButton);
        expect(scrollToNextMock).toHaveBeenCalled();
    });

});
