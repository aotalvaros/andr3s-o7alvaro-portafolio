"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoginForm } from "./hook/useLoginForm";
import { Eye, EyeOff, Info } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    isButtonDisabled
  } = useLoginForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-4 md:p-8 rounded-lg shadow-md border"
    >
      <section className="flex flex-row items-center justify-center">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-secondary select-none">Iniciar sesión 🔐</h2>
         <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-5 h-5 text-secondary"/>
          </TooltipTrigger>
          <TooltipContent className=" text-white rounded-medium dark:bg-white dark:text-gray-800">
            <p>Inicio de sesion solo para usuarios registrados (administrador)</p>
          </TooltipContent>
        </Tooltip>
      </section>

      <Input
        placeholder="Ingresa tu email"
        {...register("email")}
        className="dark:text-white dark:placeholder:text-secondary-foreground"
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Ingresa tu contraseña"
          {...register("password")}
          className="pr-10 dark:text-white dark:placeholder:text-secondary-foreground"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-primary"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      <Button
        type="submit"
        className="w-full dark:text-gray-800 text-white select-none"
        disabled={isSubmitting || isButtonDisabled}
      >
        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>

      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY ?? ""}
        onChange={onChangeReCaptcha}
        ref={recaptchaRef}
      />
     
    </form>
  );
}
