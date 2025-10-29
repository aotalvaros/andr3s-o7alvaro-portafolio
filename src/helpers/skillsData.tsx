import { Skill } from "@/types/skill.type";
import { Cog, Palette, Puzzle, TestTube } from "lucide-react";

export const skills: Skill[] = [
  {
    icon: <Puzzle className="h-12 w-12 text-primary" />,
    title: 'Componentes reutilizables',
    description: 'Diseño componentes modulares aplicando principios SOLID y tipado estricto con TypeScript.',
    details: [
      'Componentes atómicos y moleculares para una UI escalable.',
      'Uso de Storybook para documentar y probar componentes aislados.',
      'Hooks personalizados para lógica compartida y reutilizable.',
      'Integración con Tailwind CSS para estilos consistentes y responsivos.',
    ],
    stack: "TypeScript • SOLID • Storybook",
    className: "md:col-span-1",
  },
  {
    icon: <TestTube className="h-12 w-12 text-secondary" />,
    title: 'Pruebas unitarias y mocks',
    description: 'Uso Jest, Vitest y RTL para asegurar calidad en cada feature antes de llegar a producción.',
    details: [
      'Cobertura robusta con pruebas unitarias usando Jest y Vitest.',
      'React Testing Library para simular interacciones reales del usuario.',
      'Mocks personalizados para componentes, hooks y servicios.',
      'Automatización en el flujo CI/CD para evitar bugs en producción.',
    ],
    stack: "Jest • Vitest • RTL",
    className: "md:col-span-1",
  },
  {
    icon: <Cog className="h-12 w-12 text-accent" />,
    title: 'Integración con APIs',
    description: 'Trabajo con REST y GraphQL, manejo estados de carga, error y éxito eficientemente.',
    details: [
      'Consumo eficiente de APIs REST y GraphQL con Axios y Fetch.',
      'Manejo de estados de carga, error y éxito usando TanStack Query y custom hooks.',
      'Optimización de peticiones con caching, revalidación y polling.',
      'Diseño de contratos tipados y validaciones de respuesta para evitar errores en tiempo de ejecución.',
    ],
    stack: "REST • GraphQL • React Query",
    className: "md:col-span-1",
  },
  {
    icon:  <Palette className="h-12 w-12 text-primary" />,
    title: 'Estilos limpios y mantenibles',
    description: 'Tailwind, SASS y buenas prácticas para que el código no solo funcione, sino que luzca pro.',
    details: [
      'Estilización con Tailwind CSS y SASS manteniendo un diseño consistente y escalable.',
      'Componentes desacoplados y reutilizables con enfoque atómico.',
      'Dark mode, accesibilidad (a11y) y responsive design integrados desde el inicio.',
      'Uso de variables, mixins y utilidades para minimizar código repetido y mejorar el mantenimiento.',
    ],
    stack: "Tailwind • SASS • CSS Modules",
    className: "md:col-span-1",
  },
];