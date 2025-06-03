'use client';

export default function AdminLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <section className="min-h-screen flex flex-col dark:bg-gray-950 dark:text-white">
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-800 text-white py-4 text-center sm:py-4">
        <p className="text-fluid-base">
        &copy; {new Date().getFullYear()} Todos los derechos reservados.
        </p>
        <p className="text-sm sm:block hidden">
        Desarrollado por Andrés Otalvaro - andr3s.o7alvaro@gmail.com
        </p>
        <p className="text-fluid-sm text-red-300">Portafolio en construcción</p>
      </footer>
    </section>
  );
}
