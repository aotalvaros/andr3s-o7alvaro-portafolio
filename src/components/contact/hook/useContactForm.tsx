import {  useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { usePostContact } from "./usePostContact";
import { ContactFormData, contactSchema } from "@/schemas/contact.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useToastMessageStore } from "@/store/ToastMessageStore";

export const useContactForm = () => {

    const { setParams } = useToastMessageStore((state) => state)
    const { sendEmail, isLoading } = usePostContact();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema)
    });

    const isMobile = useIsMobile()

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const captchaSize: 'normal' | 'compact' = isMobile ? 'compact' : 'normal';

    const onSubmit = async (data: ContactFormData) => {
        await sendEmail(data, {
            onSuccess: (data) => {
                setParams({
                    message: "¡Éxito!",
                    description: data.message,
                    typeMessage: "success",
                    show: true,
                });
            },
            onError: (error) => {
                setParams({
                    message: "Error",
                    description: error.message,
                    typeMessage: "error",
                    show: true,
                });
            }
        });
        if (!isLoading) reset();
    };

    const onChangeReCaptcha = () => {
        setIsButtonDisabled(!recaptchaRef.current?.getValue());
    };

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        recaptchaRef,
        isButtonDisabled,
        onSubmit,
        onChangeReCaptcha,
        captchaSize
    };
};
