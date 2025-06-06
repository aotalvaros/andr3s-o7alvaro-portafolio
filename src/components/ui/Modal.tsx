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
          className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 dark:bg-background/80 backdrop-blur-lg shadow-2xl border border-border text-black dark:text-white p-6 rounded-2xl w-[90%] md:w-auto lg:w-[45%] max-w-[820px] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-sm text-gray-500 hover:text-gray-700 pr-1 dark:text-white cursor-pointer"
              aria-label="Cerrar modal"
            >
              ✖
            </button>
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scroll">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}