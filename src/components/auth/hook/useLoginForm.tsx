import { AuthFormData, authSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLogin } from "./useLogin";
import { useRouter } from "next/navigation";

export const useLoginForm = () => {

    const { auth } = useLogin()
    const router = useRouter();

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
        onSubmit
    };

}
