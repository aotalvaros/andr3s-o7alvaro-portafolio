import { Logo } from "@/components/layout/navbar/components/Logo";
import { beforeEach, vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Logo Component", () => {

    const testLogoSrc = "/test-logo.png";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render the logo link with correct href", () => {
        render(<Logo logoSrc={testLogoSrc} />);
        const logoLink = screen.getByRole("link");

        expect(logoLink).toBeInTheDocument();
        expect(logoLink).toHaveAttribute("href", "/");
    });


})