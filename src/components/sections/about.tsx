"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function About() {
  return (
    <section
      id="sobre-mi"
      className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16"
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
              src="/assets/bill1.png"
              alt="Foto de Andrés"
              fill
              className="object-cover"
            />
          </div>

          <div className={`absolute inset-0 rounded-full overflow-hidden shadow-lg rotate-y-180 backface-hidden group-hover:rotate-y-0 transition-transform duration-700 ease-in-out`}>
            <Image
              src="/assets/dipper-and-mabel.png"
              alt="Otra foto de Andrés"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Sobre mí</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-4">
            Soy un desarrollador frontend con más de 4 años de estar dándole al
            código duro. 🎯 Tecnólogo en desarrollo de software, pronto a ser
            ingeniero (ya casi, ya casi). Me muevo como pez en el agua con
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
