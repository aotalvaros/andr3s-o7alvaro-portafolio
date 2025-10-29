"use client";

import { skills } from "@/helpers/skillsData";
import { ScrollReveal } from "../ui/ScrollReveal";
import { SkillCard } from "../ui/SkillCard";

export function Skills() {
    return (
      <section id="skills" className="py-20" data-testid="skills-section">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Mis <span className="text-primary">Habilidades</span>
            </h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
              Haz clic en cada tarjeta para ver más detalles sobre mi experiencia
            </p>
          </ScrollReveal>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {skills.map((skill, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <SkillCard {...skill} />
              </ScrollReveal>
            ))}
          </div>
        </div>
    </section>
    );
}
