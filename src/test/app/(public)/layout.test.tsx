
import layout from "@/app/(public)/layout";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

vi.mock("@/app/(public)/App", () => ({
    App: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

vi.mock('@/components/auth/PublicRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => children
}))


describe("test layout component", () => {
 
    it("renders App component with children", () => {
        const { container } = render(
        layout({ children: <div>Test Child</div> })
        );
        expect(container.querySelector("div")).toHaveTextContent("Test Child");
        expect(container.querySelector("div")).toContainElement(
        container.querySelector("div")
        );
    });
    
    it("renders App component without children", () => {
        const { container } = render(layout({ children: null }));
        expect(container.querySelector("div")).toBeEmptyDOMElement();
    });

});
