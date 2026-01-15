import { DashboardHeader } from '../../../../../components/sections/admin/components/DashboardHeader';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, vi, describe, it, expect } from 'vitest';

describe('DashboardHeader Component', () => {
    beforeEach(() => {
        render(<DashboardHeader />);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should render the header title', () => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should render the header description', () => {
        expect(screen.getByText('Vista general del estado de tu portafolio')).toBeInTheDocument();
    });

})