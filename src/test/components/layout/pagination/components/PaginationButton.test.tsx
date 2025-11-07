import { PaginationButton } from "@/components/layout/pagination/components/PaginationButton";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('PaginationButton', () => {
   
    const props = {
        onClick: vi.fn(),
        disabled: false,
        ariaLabel: 'Next Page',
        testId: 'pagination-button',
        children: <div>Next</div>
    }

    beforeEach(() => {
        render(<PaginationButton {...props} />);
    })

    afterEach(() => {
        vi.clearAllMocks();
    })

    it('should render the button with correct children', () => {
        const button = screen.getByTestId('pagination-button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Next');
    })

    it('should have the correct aria-label', () => {
        const button = screen.getByTestId('pagination-button');
        expect(button).toHaveAttribute('aria-label', 'Next Page');
    })

    it('should call onClick when clicked', () => {
        const button = screen.getByTestId('pagination-button');
        button.click();
        expect(props.onClick).toHaveBeenCalledTimes(1);
    })

})