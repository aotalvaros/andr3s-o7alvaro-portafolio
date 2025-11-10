import { ContentModalSkills } from "@/components/sections/ContentModalSkills";
import { afterEach, vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skill } from "@/types/skill.type";


describe("ContentModalSkills", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders skill details correctly", () => {
        const skill: Skill = {
            title: "Componentes reutilizables",
            description: "Descripción de componentes reutilizables.",
            icon: "🧩",
            details: ["Detalle 1", "Detalle 2"],
            stack: "TypeScript · SOLID · Storybook",
            className: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
        };

        render(<ContentModalSkills selected={skill} />);

        expect(screen.getByText("Componentes reutilizables")).toBeInTheDocument();

        expect(screen.getByText("Descripción de componentes reutilizables.")).toBeInTheDocument();

        expect(screen.getByText("Detalle 1")).toBeInTheDocument();
        expect(screen.getByText("Detalle 2")).toBeInTheDocument();
        expect(screen.getByText("Stack: TypeScript · SOLID · Storybook")).toBeInTheDocument();
    });

    it("renders nothing when no skill is selected", () => {
        render(<ContentModalSkills selected={null} />);
        expect(screen.queryByText("Componentes reutilizables")).not.toBeInTheDocument();
    });

})