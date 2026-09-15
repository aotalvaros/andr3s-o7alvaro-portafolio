import { afterEach, vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { About } from '../../../components/sections/about';

vi.mock("../../../components/ui/ScrollReveal", () => ({
    ScrollReveal: ({ children }: { children: React.ReactNode }) => (<div>{children}</div>),
}));

describe("About Test", () => {
    const setUp = () => {
        render(<About />);
    };

    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should render About section", async () => {
        vi.mocked(global.fetch).mockResolvedValue({
            ok: true,
            text: async () => '<p>Contenido de prueba</p>',
        } as Response);

        setUp();

        await waitFor(() => {
            expect(screen.getByTestId("about-section")).toBeInTheDocument();
            expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
        });
    });

    it("should render profile image", () => {
        vi.mocked(global.fetch).mockResolvedValue({
            ok: true,
            text: async () => '<p>Contenido de prueba</p>',
        } as Response);

        setUp();

        const profileImage = screen.getByAltText("Foto de Andrés");
        expect(profileImage).toBeInTheDocument();
    });

    it("should render technologies badges", () => {
        vi.mocked(global.fetch).mockResolvedValue({
            ok: true,
            text: async () => '<p>Contenido de prueba</p>',
        } as Response);

        setUp();

        const technologies = screen.getAllByText(/React|Next\.js|TypeScript|TailwindCSS|Vitest|Unit Testing|React Testing Library|AWS|Azure|Git|SQL/i);
        expect(technologies).toHaveLength(11);
    });

    it("should show a remote content error if the fetch fails", async () => {
        vi.mocked(global.fetch).mockRejectedValue(new Error('network'));

        setUp();

        await waitFor(() => {
            expect(screen.getByText(/Ocurrió un error nuestro/i)).toBeInTheDocument();
        });
    });
});