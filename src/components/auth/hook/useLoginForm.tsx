import { AuthFormData, authSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "./useLogin";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export const useLoginForm = () => {

    const { auth } = useLogin()
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

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

    const onChangeReCaptcha = () => {
        setIsButtonDisabled(!recaptchaRef.current?.getValue());
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
        isButtonDisabled
    };

}
