import { Skill } from "@/types/skill.type";

export const skills: Skill[] = [
    {
      icon: '🧩',
      title: 'Componentes reutilizables',
      description: 'Diseño componentes modulares aplicando principios SOLID y tipado estricto con TypeScript.',
    },
    {
      icon: '🧪',
      title: 'Pruebas unitarias y mocks',
      description: 'Uso Jest, Vitest y RTL para asegurar calidad en cada feature antes de llegar a producción.',
    },
    {
      icon: '⚙️',
      title: 'Integración con APIs',
      description: 'Trabajo con REST y GraphQL, manejo estados de carga, error y éxito como un ninja.',
    },
    {
      icon: '🎨',
      title: 'Estilos limpios y mantenibles',
      description: 'Tailwind, SASS y buenas prácticas para que el código no solo funcione, sino que luzca pro.',
    },
];