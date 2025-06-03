import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('El correo no es válido, ejemplo: usuario@dominio.com'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100, 'La contraseña debe tener como máximo 100 caracteres')
});

export type AuthFormData = z.infer<typeof authSchema>;