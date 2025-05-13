'use client';

export function GlobalDevBanner() {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[9999] bg-yellow-500 text-black text-center py-2 text-sm font-bold shadow-md">
      🧪 ¡Estás viendo una versión en desarrollo!
    </div>
  );
}
