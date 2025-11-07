import { renderPageItem } from "@/components/layout/pagination/helper/renderPageItem";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

describe('renderPageItem', () => {

    const mockpage = 2;
    const mockindex = 1;
    const mockcurrentPage = 2;
    const mockonPageChangeNext = vi.fn()

    beforeEach(() => {
        render(renderPageItem(mockpage, mockindex, mockcurrentPage, mockonPageChangeNext));
    })

    afterEach(() => {
        vi.clearAllMocks();
    })

    it('should render the correct page item', () => {
        const pageItem = screen.getByText(mockpage.toString());
        expect(pageItem).toBeInTheDocument();
    })

    it('should call onPageChangeNext when the page item is clicked', () => {
        const pageItem = screen.getByText(mockpage.toString());
        fireEvent.click(pageItem);
        expect(mockonPageChangeNext).toHaveBeenCalledWith(mockpage);
    })

})
