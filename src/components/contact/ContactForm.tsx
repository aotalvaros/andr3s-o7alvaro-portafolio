'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ReCAPTCHA from 'react-google-recaptcha';
import { useContactForm } from './hook/useContactForm';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Mail, Send } from 'lucide-react';
import { FaGithub, FaLinkedin  } from "react-icons/fa";
import { Card } from '../ui/card';

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
    <section id="contact" className="py-22 container mx-auto px-4">
      <div className="">
         <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Hablemos de tu <span className="text-primary">Proyecto</span>
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            ¿Tienes una idea en mente? Estoy disponible para nuevos proyectos y colaboraciones.
          </p>
        </ScrollReveal>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Info */}
        <ScrollReveal delay={200}>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Siempre estoy abierto a discutir nuevos proyectos, ideas creativas u oportunidades para ser parte de
                tu visión.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <a
                href="mailto:andr3s.o7alvaro@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl glass hover:bg-primary/10 transition-all group"
              >
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">andr3s.o7alvaro@gmail.com</p>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/andres-otalvaro-sanchez-31274b214/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl glass hover:bg-primary/10 transition-all group"
              >
                <div className="p-3 rounded-lg bg-secondary/10 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                  <FaLinkedin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">LinkedIn</p>
                  <p className="text-sm text-muted-foreground">Conecta conmigo</p>
                </div>
              </a>

              <a
                href="https://github.com/aotalvaros"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl glass hover:bg-primary/10 transition-all group"
              >
                <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <FaGithub className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">GitHub</p>
                  <p className="text-sm text-muted-foreground">Revisa mi código</p>
                </div>
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <Card className="p-8 border-2 border-border/50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                 <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Tu nombre
                  </label>
                  <Input placeholder="Tu nombre" {...register('name')} className='dark:text-white dark:placeholder:text-secondary-foreground transition-all focus:border-primary' />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Tu correo
                </label>
                  <Input placeholder="Tu correo" {...register('email')} className='dark:text-white dark:placeholder:text-secondary-foreground transition-all focus:border-primary' />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Tu mensaje
                </label>
                  <Textarea placeholder="Tu mensaje" rows={5} {...register('message')} className='max-h-[30dvh] dark:text-white dark:placeholder:text-secondary-foreground' />
                  {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
              </div>
               <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:scale-105 transition-transform"
                  disabled={isButtonDisabled || isSubmitting}
                >
                  <Send className="mr-2 h-5 w-5" />
                   {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
               <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY ?? ""}
                  onChange={onChangeReCaptcha}
                  ref={recaptchaRef}
                  size={captchaSize}
                />
            </form>
          </Card>
        </ScrollReveal> 

      </div>

    </section>
  );
}
