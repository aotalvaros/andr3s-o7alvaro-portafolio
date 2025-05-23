'use client'

import { motion } from 'framer-motion'
export function Hero() {
  return (
    <section className="min-h-[100dvh] flex flex-col items-center justify-center text-center snap-start">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl md:text-6xl font-bold mb-6"
      >
        Hola, soy Andrés Otalvaro👋
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl"
      >
        Desarrollador Frontend especializado en React, Next.js, TailwindCSS y tecnologías modernas 🚀.
      </motion.p>
    </section>
  )
}
