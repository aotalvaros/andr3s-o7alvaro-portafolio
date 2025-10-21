import { ComponentType, ReactNode } from "react";

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    isCrollable?: boolean;
    className?: ComponentType | string;
  }
  