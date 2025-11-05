'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { CommandPaletteProvider } from '@/providers/CommandPaletteProvider';

export function Providers({ children }: { readonly children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CommandPaletteProvider>
        {children}
      </CommandPaletteProvider>
    </QueryClientProvider>
  );
}
