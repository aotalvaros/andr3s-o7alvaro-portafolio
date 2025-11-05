"use client";

import Image from "next/image";
import { ScrollReveal } from "../ui/ScrollReveal";
import { Badge } from "../ui/badge";
import { useState } from "react";

export function About() {

  const [imageSrc, setImageSrc] = useState("https://s6s2oxgnpnutegmr.public.blob.vercel-storage.com/Imagenes/Andres2.jpeg");

  const technologies = [
    "React",
    "Next.js",
    "TypeScript",
    "TailwindCSS",
    "SASS",
    "Jest",
    "Vitest",
    "Azure",
    "Git",
    "SQL",
  ];

  return (
    <section id="about" className="py-20 bg-muted/30" data-testid="about-section">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Sobre <span className="text-primary">mí</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Profile Image */}
          <ScrollReveal delay={200}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105">
                <Image
                  src={imageSrc}
                  alt="Foto de Andrés"
                  fill
                  sizes="auto"
                  className="object-cover"
                  loading="lazy"
                  onError={() => {
                    // Si la imagen falla, cambia a la imagen por defecto
                    setImageSrc("/assets/imageNoFound.png");
                  }}
                />
              </div>
            </div>
          </ScrollReveal>

          {/* About Content */}
          <ScrollReveal delay={400}>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Soy un desarrollador frontend con más de{" "}
                <span className="font-bold text-primary">
                  4 años de experiencia
                </span>{" "}
                creando interfaces sólidas, modernas y funcionales. Ingeniero en
                desarrollo de software.
              </p>

              <p className="text-lg leading-relaxed">
                Me muevo como pez en el agua con{" "}
                <span className="font-semibold text-secondary">React</span>,{" "}
                <span className="font-semibold text-secondary">Next.js</span>,{" "}
                <span className="font-semibold text-secondary">SASS</span>, y
                pruebas unitarias. Me gusta trabajar limpio, ordenado y sobre
                todo crear cosas que realmente funcionen.
              </p>

              <p className="text-lg leading-relaxed">
                También me he metido con{" "}
                <span className="font-semibold text-accent">Azure</span>,{" "}
                <span className="font-semibold text-accent">Git</span>, bases de
                datos <span className="font-semibold text-accent">SQL</span> y
                me encanta jugar con librerías de componentes.
              </p>

              {/* Technologies */}
              <div className="pt-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  TECNOLOGÍAS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
