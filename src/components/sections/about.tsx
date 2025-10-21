"use client";

import { sectionsOrder } from "@/constants/sectionsOrder.constants";
import { useActiveSection } from "@/context/ActiveSectionProvider";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { useInView } from 'react-intersection-observer'

export function About() {
  const { setActiveSection } = useActiveSection()
  const [ref, inView] = useInView({ threshold: 0.5 })

  useEffect(() => {
    if (inView) {
      setActiveSection(sectionsOrder[2])
    }
  }, [inView, setActiveSection])
  
  return (
    <section
      ref={ref}
      id="about"
      className="min-h-[100dvh] flex items-center justify-center snap-start md:py-0 py-14 select-none"
    >
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative w-50 h-50 md:w-64 md:h-64 perspective group"
        >
           <div className={`absolute inset-0 rounded-full overflow-hidden shadow-lg backface-hidden group-hover:rotate-y-180 transition-transform duration-700 ease-in-out`}>
            <Image
              src="/assets/Andres2.jpeg"
              alt="Foto de Andrés"
              fill
              sizes="auto"
              className="object-cover"
            />
          </div>

          <div className={`absolute inset-0 rounded-full overflow-hidden shadow-lg rotate-y-180 backface-hidden group-hover:rotate-y-0 transition-transform duration-700 ease-in-out`}>
            <Image
              src="/assets/Andres1.jpeg"
              alt="Otra foto de Andrés"
              fill
              sizes="auto"
              className="object-cover"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex-1 text-center md:text-left px-8 md:px-0"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Sobre mí</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-4">
            Soy un desarrollador frontend con más de 4 años de experiencia creando 
            interfaces sólidas, modernas y funcionales. 🎯 Ingeniero en desarrollo de software. Me muevo como pez en el agua con
            React, Next.js, SASS, y pruebas unitarias (sí, también soy amigo de
            Vitest y Jest). Me gusta trabajar limpio, ordenado y sobre todo
            crear cosas que realmente funcionen. 🚀 También me he metido con
            Azure, Git, bases de datos SQL y me encanta jugar con librerías de
            componentes. Y bueno... fan de todo lo que huela a tecnología 🤓🛸.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
