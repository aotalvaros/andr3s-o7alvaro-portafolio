'use client'

import { useToastMessageStore } from '@/store/ToastMessageStore'
import { useEffect } from 'react';
import { toast } from "sonner"
import { ShieldAlert} from "lucide-react";
import { FaRegCheckCircle, FaBan, FaInfoCircle   } from "react-icons/fa";
import "./styles/SlowResponseMessageComponent.css"

const getIcon = (type: string) => {
    switch (type) {
        case "success": return <FaRegCheckCircle color='green' size={20} />;
        case "error": return <FaBan color='#FF4757' size={20}/>;
        case "info": return <FaInfoCircle  color='blue' size={20} />;
        case "warning": return <ShieldAlert color='orange' size={20} />;
        default: return null;
    }
}

const ToastMessageComponent = () => {
    const {message, show, description, typeMessage, setParams } = useToastMessageStore((state) => state)

    useEffect(() => {
        if (!show) return;
        toast.custom(() => {
            return <div className={`containerToast dark:bg-gray-300 bg-white ${typeMessage}`}>
                <div className='flex flex-row gap-2 items-center'>
                    {getIcon(typeMessage)}
                    <div className='flex flex-col gap-1'>
                        <p className="text-[0.938rem] font-bold">{message}</p>
                        <p className="text-[0.813rem] text-[#050F3DAB] font-normal">{description}</p>
                    </div>
                </div>
            </div>;
        },{
            duration: 4000
        })
      
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
