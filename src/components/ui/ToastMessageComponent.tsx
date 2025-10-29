'use client'

import { useToastMessageStore } from '@/store/ToastMessageStore'
import { useEffect } from 'react';
import { toast } from "sonner"
import "./styles/SlowResponseMessageComponent.css"

const ToastMessageComponent = () => {
    const {message, show, description, typeMessage, setParams } = useToastMessageStore((state) => state)

    useEffect(() => {
        if (!show) return;
        toast.custom(() => (
            <div className={`containerToast dark:bg-gray-300 bg-white ${typeMessage}`}>
                <p className="text-[0.938rem]">{message}</p>
                <p className="text-[0.813rem] text-[#050F3DAB] font-normal">{description}</p>
            </div>
        ));
      
       setTimeout(() => {
            setParams({
                message: "",
                description: "",
                typeMessage: "success",
                show: false,
            });
        }, 4000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

  return null;  
};

ToastMessageComponent.displayName = "ToastMessage";

export const ToastMessage = ToastMessageComponent;
