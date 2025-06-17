'use client';

import { logout } from '@/components/auth/logout';
import { BlockedModules } from '@/components/sections/admin/BlockedModules';
import { useSocketContext } from '@/context/SocketContext';

export default function AdminPage() {
  const { online } = useSocketContext();
  return (
    <div className="p-10 h-[calc(100vh-8rem)] bg-gray-100 dark:bg-gray-900">
       <div className="alert" data-testid='admin-status'>
          {
            online
              ? <span className="text-green-500"> Online</span>
              : <span className="text-red-500"> Offline</span>
          }
        </div>
      <section className='flex justify-between items-center mb-6 flex-col-reverse md:flex-row gap-4'>
        <h1 className="text-fluid-md font-semibold text-center">Bienvenido al panel de administración</h1>
        <button onClick={() => logout()} className='mt-4 bg-red-500 text-white px-4 py-2 rounded' data-testid='logout-button'> 
          cerrar
        </button>
      </section>
      <BlockedModules />
    </div>
  );
}
