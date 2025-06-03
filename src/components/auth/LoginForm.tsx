'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLoginForm } from './hook/useLoginForm';

export function LoginForm() {
 
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit
  } = useLoginForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md w-full space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold text-center">Iniciar sesión 🔐</h2>

      <Input placeholder="Ingresa tu email" {...register('email')} />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <Input type="password" placeholder="Ingresa tu contraseña" {...register('password')} />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>
    </form>
  );
}
