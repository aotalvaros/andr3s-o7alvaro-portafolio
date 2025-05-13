'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData } from '@/schemas/contact.schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLoadingStore } from '@/store/loadingStore';

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const setLoading = useLoadingStore((state) => state.setLoading)

  const onSubmit = async (data: ContactFormData) => {
    console.log(data);
    
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false)
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Tu nombre" {...register('name')} />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Input placeholder="Tu correo" {...register('email')} />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <Textarea placeholder="Tu mensaje" rows={5} {...register('message')} className='max-h-[30dvh]' />
      {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}

      <Button type="submit" className="w-full" disabled={true}>
        {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
      </Button>

      {isSubmitSuccessful && <p className="text-green-600 text-center">Mensaje enviado con éxito 🚀</p>}
    </form>
  );
}
