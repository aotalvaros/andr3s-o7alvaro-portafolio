import { CommandPaletteButton } from "@/components/layout/navbar/components/CommandPaletteButton";
import { beforeEach, vi, describe, it, expect } from "vitest";
import { render, fireEvent, screen} from "@testing-library/react";

describe("CommandPaletteButton Component", () => {

    beforeEach(() => {
        render(<CommandPaletteButton />);
    });

    it("should render the button with correct title", () => {
        const button = screen.getByTestId("command-palette-button");
        expect(button).toBeInTheDocument();
    });

    it("should dispatch keyboard event on click", () => {
        const button = screen.getByTestId("command-palette-button");
        const dispatchEventSpy = vi.spyOn(document, 'dispatchEvent');

        fireEvent.click(button);
        expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    });

})