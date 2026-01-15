import { afterEach, vi, beforeAll } from "vitest";
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

class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

global.localStorage = new LocalStorageMock() as Storage;

beforeEach(() => {
  localStorage.clear();
});
