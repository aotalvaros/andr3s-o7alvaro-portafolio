import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Providers } from '../../app/providers';

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