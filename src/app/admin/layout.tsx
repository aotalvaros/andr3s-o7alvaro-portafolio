'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <section className="min-h-screen flex flex-col dark:bg-gray-950 dark:text-white">
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/70 py-8 bg-muted/30">
          <div className="container mx-auto px-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center" data-testid="footer-developer">
                &copy; {new Date().getFullYear()} Todos los derechos reservados.
                Desarrollado por Andrés Otalvaro
              </p>
              <p className="text-sm text-(var(--primary))" data-testid="footer-construction">
                Portafolio en construcción
              </p>
            </div>
          </div>
        </footer>
      </section>
    </ProtectedRoute>
  );
}
