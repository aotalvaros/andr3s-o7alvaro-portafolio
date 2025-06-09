'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ReCAPTCHA from 'react-google-recaptcha';
import { useContactForm } from './hook/useContactForm';
import { FooterContact } from '../ui/FooterContact';

export function ContactForm() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    recaptchaRef,
    isButtonDisabled,
    onSubmit,
    onChangeReCaptcha,
    captchaSize
  } =  useContactForm()
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Tu nombre" {...register('name')} className='dark:text-white dark:placeholder:text-secondary-foreground' />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Input placeholder="Tu correo" {...register('email')} className='dark:text-white dark:placeholder:text-secondary-foreground' />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <Textarea placeholder="Tu mensaje" rows={5} {...register('message')} className='max-h-[30dvh] dark:text-white dark:placeholder:text-secondary-foreground' />
      {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}

      <Button type="submit" className="w-full dark:text-gray-800 text-white select-none" disabled={isButtonDisabled || isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
      </Button>

      <FooterContact/>

      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY ?? ""}
        onChange={onChangeReCaptcha}
        ref={recaptchaRef}
        size={captchaSize}
      />

    </form>
  );
}
