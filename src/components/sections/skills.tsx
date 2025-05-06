"use client";

import { skills } from "@/helpers/skillsData";
import { Skill } from "@/types/skill.type";
import { motion } from "framer-motion";
import { useState } from "react";
import Modal from "../ui/Modal";

export function Skills() {

    const [selected, setSelected] = useState<Skill | null>(null);

    return (
        <section id="skills" className="py-20 px-4 max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
                Lo que puedo construir
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <h3 className="text-xl font-bold mb-2">{selected?.title}</h3>
                <p>{selected?.description}</p>
            </Modal>
        </section>
    );
}
