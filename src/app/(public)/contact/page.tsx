'use client';

import { ContactForm } from '@/components/contact/ContactForm';
import { useMaintenance } from '@/components/maintenance/hooks/useMaintenance';
import ModuleInMaintenance from '@/components/maintenance/ModuleInMaintenance';
import { motion } from 'framer-motion';

export default function ContactPage() {

  
  const { isInMaintenance } = useMaintenance();

  if (isInMaintenance) {
    return (<ModuleInMaintenance moduleName="contacto"/>)
  }

  return (
    <section className="flex flex-col items-center justify-center px-4 pt-24 pb-2">
      <motion.div
        className="max-w-xl w-full bg-card p-8 rounded-lg shadow-xl/30 dark:bg-gray-800"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center select-none">Contáctame</h2>
        <ContactForm />
      </motion.div>
    </section>
  );
}
