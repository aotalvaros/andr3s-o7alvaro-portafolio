import AdminLayout from "@/app/admin/layout";
import { afterEach, beforeEach, vi, describe, it, expect } from 'vitest'
import { render, screen } from "@testing-library/react";

vi.mock('@/components/auth/ProtectedRoute', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe("Test AdminLayout component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders children correctly", () => {
        render(<AdminLayout><div>Test Child</div></AdminLayout>);
        expect(screen.getByText("Test Child")).toBeInTheDocument();
    });

    it("renders footer with correct text", () => {
        render(<AdminLayout><div>Test Child</div></AdminLayout>);
        const footerText = screen.getByTestId("footer-text");
        expect(footerText).toHaveTextContent(`© ${new Date().getFullYear()} Todos los derechos reservados.`);
    });

    it("renders developer information in footer", () => {
        render(<AdminLayout><div>Test Child</div></AdminLayout>);
        const developerInfo = screen.getByTestId("footer-developer");
        expect(developerInfo).toHaveTextContent("Desarrollado por Andrés Otalvaro - andr3s.o7alvaro@gmail.com");
    });

    it("renders construction information in footer", () => {
        render(<AdminLayout><div>Test Child</div></AdminLayout>);
        const constructionInfo = screen.getByTestId("footer-construction");
        expect(constructionInfo).toHaveTextContent("Portafolio en construcción");
    });
});
