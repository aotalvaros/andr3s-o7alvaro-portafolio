'use client';

import { ModalProps } from "@/types/modalProps.type";
import { motion, AnimatePresence  } from 'framer-motion';
import { useEffect } from "react";

export default function Modal({ open, onClose, children }: Readonly<ModalProps>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-background text-black dark:text-white p-6 rounded-lg sm:w-[90%] md:w-auto lg:w-[50%] max-w-[820px] shadow-lg relative"
            onClick={(e) => e.stopPropagation()} // evita cerrar si clickea dentro
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-sm text-gray-500 hover:text-gray-700 pr-1 dark:text-white cursor-pointer"
              aria-label="Cerrar modal"
            >
              ✖
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}