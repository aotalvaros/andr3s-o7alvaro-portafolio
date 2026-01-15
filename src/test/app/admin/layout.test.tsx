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
    
    it("renders developer information in footer", () => {
        render(<AdminLayout><div>Test Child</div></AdminLayout>);
        const developerInfo = screen.getByTestId("footer-developer");
        expect(developerInfo).toHaveTextContent(`© ${new Date().getFullYear()} Todos los derechos reservados. Desarrollado por Andrés Otalvaro`);
    });

    it("renders construction information in footer", () => {
        render(<AdminLayout><div>Test Child</div></AdminLayout>);
        const constructionInfo = screen.getByTestId("footer-construction");
        expect(constructionInfo).toHaveTextContent("Portafolio en construcción");
    });
});
