'use client';

import { logout } from '@/components/auth/logout';

export default function AdminPage() {
  return (
    <div className="p-10">
      <section className='flex justify-between items-center mb-6'>
        <h1 className="text-2xl">Bienvenido al panel de administración</h1>
        <button onClick={() => logout()} className='mt-4 bg-red-500 text-white px-4 py-2 rounded'> 
          cerrar
        </button>
      </section>
    </div>
  );
}
