import { AuthFormData, authSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "./useLogin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useIsMobile } from '@/hooks/useIsMobile';
import { useRecaptcha } from '@/hooks/useRecaptcha';

export const useLoginForm = () => {

    const { recaptchaRef, isVerified, onChangeReCaptcha } = useRecaptcha();

    const { auth } = useLogin()
    const router = useRouter();
     const isMobile = useIsMobile()

    const [showPassword, setShowPassword] = useState(false);
    const captchaSize: 'normal' | 'compact' = isMobile ? 'compact' : 'normal';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema)
    });

    const onSubmit = async (data: AuthFormData) => {
        await auth(data, {
            onSuccess: () => {
                router.push("/admin");
            }
        });
    };

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
        showPassword,
        setShowPassword,
        recaptchaRef,
        onChangeReCaptcha,
        captchaSize,
        isButtonDisabled: isVerified
    };

}
