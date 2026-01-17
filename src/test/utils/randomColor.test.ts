import { getRandomColor } from '../../utils/randomColor';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'


describe('getRandomColor', () => {
    let colors: string[];

    beforeEach(() => {
        colors = [
            "var(--chart-3)",
            "var(--chart-4)",
            "var(--chart-5)",
            "var(--chart-6)",
        ];
    });

    afterEach(() => {
        vi.clearAllMocks();
    });


    it('should return a color from the predefined list', () => {
        const color = getRandomColor();
        expect(colors).toContain(color);
    });

    it('should return different colors on multiple calls', () => {
        const results = new Set<string>();
        for (let i = 0; i < 100; i++) {
            results.add(getRandomColor());
        }
        // Expecting at least two different colors over 100 calls
        expect(results.size).toBeGreaterThan(1);
    });
})