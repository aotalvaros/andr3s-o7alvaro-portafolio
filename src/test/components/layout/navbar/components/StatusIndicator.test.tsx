import { StatusIndicator } from "@/components/layout/navbar/components/StatusIndicator";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("StatusIndicator", () => {

    it("renders Online status when online is true", () => {
        render(<StatusIndicator online={true} />);
        const statusText = screen.getByText("Online");
        expect(statusText).toBeInTheDocument();
    });

    it("renders Offline status when online is false", () => {
        render(<StatusIndicator online={false} />);
        const statusText = screen.getByText("Offline");
        expect(statusText).toBeInTheDocument();
    })

    it("does not render text when isTextVisible is false", () => {
        render(<StatusIndicator online={true} isTextVisible={false} />);
        const statusText = screen.queryByText("Online");
        expect(statusText).toBeNull();
    });

    it("renders text when isTextVisible is true", () => {
        render(<StatusIndicator online={false} isTextVisible={true} />);
        const statusText = screen.getByText("Offline");
        expect(statusText).toBeInTheDocument();
    });

})