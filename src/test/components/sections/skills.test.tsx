import { afterEach, vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skills } from '../../../components/sections/skills';

vi.mock("../../../components/ui/ScrollReveal", () => ({
    ScrollReveal: ({ children }: { children: React.ReactNode }) => (<div>{children}</div>),
}))


interface SkillCardProps {
  title: string
  description: string;
}

vi.mock("../../../components/ui/SkillCard", () => ({
    SkillCard: ({ title, description }: SkillCardProps) => (
        <div data-testid="skill-card">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    ),
}))

describe("Skills Component", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    const setup = () => {
        render(<Skills />);
    }

    it("should render the Skills section with title and description", () => {
        setup();
        const section = screen.getByTestId("skills-section");
        expect(section).toBeInTheDocument();
        expect(screen.getByText("Habilidades")).toBeInTheDocument();
        expect(screen.getByText("Haz clic en cada tarjeta para ver más detalles sobre mi experiencia")).toBeInTheDocument();
        expect(screen.getAllByTestId("skill-card")).toHaveLength(4);
    });

    it("should render each skill card with title and description", () => {
        setup();
        const skillCards = screen.getAllByTestId("skill-card");
        expect(skillCards.length).toBeGreaterThan(0);
    })
})