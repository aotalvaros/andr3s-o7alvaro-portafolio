"use client";


import { ScrollReveal } from "../ui/ScrollReveal";
import { Badge } from "../ui/badge";
import { getRandomColor } from "@/utils/randomColor";
import { FallbackImage } from '../layout/FallbackImage';

const TECH_STACKS = {
  coreStack: ["React", "Next.js", "TypeScript", "TailwindCSS"],
  qualityTesting: ["Vitest", "Unit Testing", "React Testing Library"],
  infrastructureAndData: ["AWS", "Azure", "Git", "SQL"],
} as const;

interface TechSectionProps {
  title: string;
  technologies: readonly string[];
}

function TechSection({ title, technologies }: Readonly<TechSectionProps>) {
  return (
    <section>
      <h3 className="text-sm font-semibold mb-1">{title}:</h3>
      <div className="flex flex-wrap gap-2 ml-2">
        {technologies.map((tech, index) => (
          <Badge
            key={`${tech}-${index}`}
            variant="secondary"
            className="p-2 rounded-xl text-muted min-w-12 flex items-center justify-center text-center"
            style={{ backgroundColor: getRandomColor() }}
          >
            {tech}
          </Badge>
        ))}
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="py-20 bg-muted/30" data-testid="about-section">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Sobre <span className="text-primary">mí</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <ScrollReveal delay={400}>
            <div className="relative h-full aspect-square rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:scale-105">
              <FallbackImage
                src={"https://s6s2oxgnpnutegmr.public.blob.vercel-storage.com/Imagenes/AndresOtalvaroSinFondo.png"}
                alt="Foto de Andrés"
                fill
                sizes="auto"
                className="object-cover mask-[linear-gradient(var(--muted)_85%,transparent)]"
                loading="lazy"
                fallbackSrc="/assets/imageNoFound.png"
              />
              {/* Etiqueta de Descarga */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%]">
                <a 
                  href="https://s6s2oxgnpnutegmr.public.blob.vercel-storage.com/cv/ANDRES%20OTALVARO%20SANCHEZ%20_CV_ATS_4.pdf" 
                  target="_blank"
                  rel="noopener noreferrer"
                  download 
                  className="flex items-center justify-between gap-2 px-4 py-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl text-white hover:bg-slate-900 transition-colors group/btn"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Curriculum Vitae</span>
                    <span className="text-sm font-semibold italic text-slate-100">Andrés Otalvaro</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-lg border border-primary/30 group-hover/btn:bg-primary/40 transition-all">
                    <span className="text-xs font-bold">PDF</span>
                    {/* Icono de descarga simple */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400} className="h-full">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                Ingeniero de Software | Desarrollador Frontend
              </h1>

              <p className="text-lg leading-relaxed">
                Con más de{" "}
                <span className="font-bold text-primary">4 años de experiencia</span>,
                transformo requisitos complejos en productos digitales escalables y de
                alto rendimiento. Mi enfoque no se detiene en la interfaz; diseño
                soluciones sólidas utilizando el ecosistema{" "}
                <span className="font-bold text-primary">React/Next.js</span> bajo
                estándares rigurosos de{" "}
                <span className="font-bold text-primary">Testing</span> y limpieza de
                código.
              </p>

              <p className="text-lg leading-relaxed">
                Actualmente, estoy expandiendo mi stack hacia la{" "}
                <span className="font-semibold text-secondary">
                  Arquitectura Cloud (AWS/Azure)
                </span>{" "}
                y la integración de{" "}
                <span className="font-semibold text-secondary">
                  Inteligencia Artificial
                </span>{""}
                , con el objetivo de cerrar la brecha entre el frontend moderno y la
                infraestructura robusta. No solo construyo software; optimizo sistemas
                para que sean mantenibles y eficientes a largo plazo.
              </p>

              <div className="flex flex-col gap-3 pt-2">
                <TechSection title="CORE STACK" technologies={TECH_STACKS.coreStack} />
                <TechSection title="QUALITY & TESTING" technologies={TECH_STACKS.qualityTesting} />
                <TechSection title="INFRASTRUCTURE & DATA" technologies={TECH_STACKS.infrastructureAndData} />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
