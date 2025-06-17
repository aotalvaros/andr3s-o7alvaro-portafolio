import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import '@testing-library/jest-dom'

afterEach(() => {
    cleanup();
});

vi.mock('@/app/globals.css', () => ({}));

vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mock-inter-font',
  }),
}));