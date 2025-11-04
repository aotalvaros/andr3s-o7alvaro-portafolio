'use client'

import { useRegisterCommand } from '@/hooks/commandPalette/useCommandPalette'
// Ejemplo de cómo usar el hook useRegisterCommand en cualquier componente

import { Star } from 'lucide-react'

export function ExampleComponent() {
  // Registrar comando específico de este componente
  useRegisterCommand({
    id: 'example-custom-action',
    label: 'Acción de ejemplo',
    description: 'Esta es una acción personalizada del componente',
    icon: <Star className="h-4 w-4" />,
    action: () => {
      console.log('¡Acción personalizada ejecutada!')
      alert('Comando personalizado ejecutado')
    },
    keywords: ['ejemplo', 'custom', 'personalizado', 'test'],
    category: 'custom',
    priority: 5,
  })

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Componente de Ejemplo</h3>
      <p className="text-sm text-muted-foreground">
        Este componente registra automáticamente un comando personalizado en la paleta.
        Presiona <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+K</kbd> y busca &quot;ejemplo&quot;.
      </p>
    </div>
  )
}