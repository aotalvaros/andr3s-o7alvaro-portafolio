"use client";

import { skills } from "@/helpers/skillsData";
import { Skill } from "@/types/skill.type";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { useInView } from 'react-intersection-observer'
import { useActiveSection } from "@/context/ActiveSectionProvider";
import { sectionsOrder } from "@/constants/sectionsOrder.constants";
import { ContentModalSkills } from "./ContentModalSkills";

export function Skills() {
  const { setActiveSection } = useActiveSection()
  const [ref, inView] = useInView({ threshold: 0.5 })

  useEffect(() => {
    if (inView) {
      setActiveSection(sectionsOrder[1])
    }
  }, [inView, setActiveSection])

    const [selected, setSelected] = useState<Skill | null>(null);

    return (
        <section ref={ref} id="skills" className="py-6 min-h-[100dvh] flex flex-col justify-center snap-start bg-secondary-foreground dark:bg-gray-800">
            <motion.div
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6}}
                className="transition-all"
            >
                <h2 className="text-4xl font-bold text-center mb-12">
                    Lo que puedo construir
                </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 md:max-w-[75%] md:m-auto px-8 md:px-0 select-none">
                {skills.map((skill, index) => (
                <motion.div
                    key={index + skill.title}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="p-6 rounded-xl bg-background text-foreground shadow-lg border border-border transition-all"
                >
                    <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.1,
                    }}
                    className="text-5xl mb-4"
                    >
                    {skill.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                    <p className="text-muted-foreground text-sm">{skill.description}</p>

                    <button
                        className="mt-auto text-primary hover:underline text-sm cursor-pointer"
                        onClick={() => setSelected(skill)}
                    >
                        Ver más →
                    </button>

                </motion.div>
                ))}
            </div>
            <Modal open={!!selected} onClose={() => setSelected(null)}>
               <ContentModalSkills selected={selected} />
            </Modal>
        </section>
    );
}
