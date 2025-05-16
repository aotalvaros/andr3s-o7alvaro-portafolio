'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData } from '@/schemas/contact.schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { usePostContact } from './hook/usePostContact';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [ isButtonDisabled, setIsButtonDisabled ] = useState<boolean>(true);
  const [ messageResultMail, setMessageResultMail ] = useState({
    description: "",
    show: false,
    status: 0
  });

  const { sendEmail, isLoading }  = usePostContact()

  const onSubmit = async (data: ContactFormData) => {
    await sendEmail(data, {
      onSuccess: (data) => {
        setMessageResultMail({ description: data.message, show: true, status: data.status });
      },
      onError: (error) => {
        setMessageResultMail({ description: error.message, show: true, status: 500 });
      }
    })
    if (!isLoading) {
      reset();
      setMessageResultMail({ description: "", show: false, status: 0 });
    }
  };

  const onChangeReCaptcha = () => {
    setIsButtonDisabled(!recaptchaRef.current?.getValue());
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Tu nombre" {...register('name')} />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Input placeholder="Tu correo" {...register('email')} />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <Textarea placeholder="Tu mensaje" rows={5} {...register('message')} className='max-h-[30dvh]' />
      {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}

      <Button type="submit" className="w-full" disabled={isButtonDisabled || isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
      </Button>

      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY ?? ""}
        onChange={onChangeReCaptcha}
        ref={recaptchaRef}
      />

      {messageResultMail.show && <p className={`${messageResultMail.status == 500 ? "text-red-600": "text-green-600 "} text-center`}>{ messageResultMail.description }</p>}
    </form>
  );
}
