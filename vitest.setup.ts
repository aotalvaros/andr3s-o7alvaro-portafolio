import { afterEach, vi,beforeAll } from "vitest";
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

vi.mock('@/components/styles/PsychedelicSpinner.css', () => ({}));

beforeAll(() => {
  if (!HTMLFormElement.prototype.requestSubmit) {
    HTMLFormElement.prototype.requestSubmit = function(submitter?: HTMLElement) {
      if (submitter) {
        submitter.click();
      } else {
        // Disparar el evento submit manualmente
        const submitEvent = new Event('submit', {
          bubbles: true,
          cancelable: true,
        });
        this.dispatchEvent(submitEvent);
      }
    };
  }
});