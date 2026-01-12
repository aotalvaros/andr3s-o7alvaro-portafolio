"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoginForm } from "./hook/useLoginForm";
import { Eye, EyeOff, Lock, Mail, Info } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FallbackImage } from '../layout/FallbackImage';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    showPassword,
    setShowPassword,
    recaptchaRef,
    onChangeReCaptcha,
    isButtonDisabled,
    captchaSize
  } = useLoginForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full md:w-min relative py-4 "
    >
      <Card className="w-full space-y-6 bg-white dark:bg-gray-800 p-4 md:p-8 rounded-lg shadow-md border">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <FallbackImage
                    src="/favicon.png"
                    alt="Background Pattern"
                    width={40}
                    height={40}
                    className="opacity-50 pointer-events-none"
                    loading="eager"
                  />
          </div>

          <div className="flex items-center justify-center gap-2">
            <CardTitle className="text-3xl font-bold">Iniciar sesión 🔐</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Acceso exclusivo para administradores registrados. Si no tienes credenciales, contacta al propietario
                    del sitio.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <CardDescription className="text-base">Panel de administración</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Ingresa tu email"
                {...register("email")}
                className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
          </div>

            {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                {...register("password")}
                className="pl-10 pr-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY ?? ""}
            onChange={onChangeReCaptcha}
            ref={recaptchaRef}
            size={captchaSize}
          /> 

          <Button
            type="submit"
            className="w-full dark:text-gray-800 text-white select-none"
            disabled={isSubmitting || isButtonDisabled}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>

          <Alert className="border-primary/20 bg-primary/5">
            <Lock className="h-4 w-4 text-primary" />
            <AlertDescription className="text-xs text-muted-foreground">
              Tu información está protegida con encriptación de extremo a extremo
            </AlertDescription>
          </Alert>
        
        </CardContent>
      </Card> 
    </form>
  );
}
