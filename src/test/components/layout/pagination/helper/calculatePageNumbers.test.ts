import { calculatePageNumbers } from "@/components/layout/pagination/helper/calculatePageNumbers";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe("calculatePageNumbers", () => {

    beforeEach(() => {
        vi.useFakeTimers();
    })

    afterEach(() => {
        vi.useRealTimers();
    })

    it("should return correct page numbers for given total pages and current page", () => {
        const totalPages = 10;
        const currentPage = 5;

        const result = calculatePageNumbers(currentPage, totalPages);

        expect(result).toEqual([1, '...', 4, 5, 6, '...', 10]);
    })

    it("should handle edge case when current page is the first page", () => {
        const totalPages = 10;
        const currentPage = 1;

        const result = calculatePageNumbers(currentPage, totalPages);

        expect(result).toEqual([1, 2, 3, 4, 5, '...', 10]);
    })

    it("should handle edge case when current page is the last page", () => {
        const totalPages = 10;
        const currentPage = 10;

        const result = calculatePageNumbers(currentPage, totalPages);

        expect(result).toEqual([1, '...', 6, 7, 8, 9, 10]);
    })

})