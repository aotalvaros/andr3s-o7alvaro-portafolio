import React, { Fragment } from "react";
import { motion } from "framer-motion";
import { Skill } from "@/types/skill.type";

export const ContentModalSkills = ({ selected }: { selected: Skill | null }) => {
  return (
    <Fragment>
      <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-2xl"
        >
          {selected?.icon}
        </motion.span>
        {selected?.title}
      </h3>

      <p className="text-muted-foreground mb-2">{selected?.description}</p>

      {selected?.details && (
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          {selected.details.map((detail, idx) => (
            <li key={idx + 1}>{detail}</li>
          ))}
        </ul>
      )}

      {selected?.title === "Componentes reutilizables" && (
        <span className="inline-block mt-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2 py-1 rounded">
          Stack: TypeScript · SOLID · Storybook
        </span>
      )}

      {selected?.title === "Pruebas unitarias y mocks" && (
        <span className="inline-block mt-4 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-semibold px-2 py-1 rounded">
          Tools: Jest · Vitest · RTL
        </span>
      )}

      {selected?.title === "Integración con APIs" && (
        <span className="inline-block mt-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-1 rounded">
          REST · GraphQL · Axios · TanStack Query
        </span>
      )}

      {selected?.title === "Estilos limpios y mantenibles" && (
        <span className="inline-block mt-4 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 text-xs font-semibold px-2 py-1 rounded">
          Tailwind · SASS · Responsive · A11y
        </span>
      )}
    </Fragment>
  );
};
