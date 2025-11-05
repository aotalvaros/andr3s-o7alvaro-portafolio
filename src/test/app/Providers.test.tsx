import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Providers } from '../../app/providers';

vi.mock('@/providers/CommandPaletteProvider', () => ({
    CommandPaletteProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="command-palette-provider">{children}</div>
    ),
}));

describe('Providers', () => {
    
    it('renders children correctly', () => {
        render(
            <Providers>
                <div data-testid="child">Hello</div>
            </Providers>
        );
        expect(screen.getByTestId('child')).toHaveTextContent('Hello');
    });

    it('renders without crashing', () => {
        render(
            <Providers>
                <span>Test</span>
            </Providers>
        );
        expect(screen.getByText('Test')).toBeInTheDocument();
    });


});