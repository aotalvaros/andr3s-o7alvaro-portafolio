import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ModuleInMaintenance from '@/components/maintenance/ModuleInMaintenance'

describe('ModuleInMaintenance Component', () => {
    const originalConsoleError = console.error

    beforeEach(() => {
        console.error = vi.fn()
    })
    afterEach(() => {
        console.error = originalConsoleError
    })

    it('renders correctly with default props', () => {
        render(<ModuleInMaintenance />)
        expect(screen.getByText('Estamos en mantenimiento')).toBeInTheDocument()
        expect(screen.getByText('Este módulo está actualmente en mantenimiento. Por favor, vuelve más tarde.')).toBeInTheDocument()
    })

    it('renders correctly with moduleName prop', () => {
        render(<ModuleInMaintenance moduleName="Usuarios" />)
        expect(screen.getByText('Módulo "Usuarios" en mantenimiento')).toBeInTheDocument()
        expect(screen.getByText('Este módulo está actualmente en mantenimiento. Por favor, vuelve más tarde.')).toBeInTheDocument()
    })

    it('renders correctly with custom message prop', () => {
        render(<ModuleInMaintenance message="Volveremos pronto." />)
        expect(screen.getByText('Estamos en mantenimiento')).toBeInTheDocument()
        expect(screen.getByText('Volveremos pronto.')).toBeInTheDocument()
    })

})