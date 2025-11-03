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

})