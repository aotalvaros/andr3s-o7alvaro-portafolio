<!--
## Sync Impact Report
- **Version**: N/A → 1.0.0
- **Change Type**: MAJOR (Initial constitution)
- **Modified Principles**: N/A (new constitution)
- **Added Sections**: Core Principles (5), Stack Tecnológico, Development Workflow, Governance
- **Removed Sections**: N/A
- **Templates Updated**:
  - plan-template.md: ✅ compatible (Constitution Check section uses generic reference)
  - spec-template.md: ✅ compatible (no constitution-specific references)
  - tasks-template.md: ✅ compatible (no constitution-specific references)
- **Follow-up TODOs**: None
-->

# Portafolio Andrés Dev Constitution

## Core Principles

### I. Clean Architecture (NON-NEGOTIABLE)

La arquitectura DEBE seguir Clean Architecture + Feature-Based:
- **Inversión de Dependencias**: `core/` NO DEBE depender de `components/` ni `app/`
- **Entidades Inmutables**: Las entidades del dominio DEBEN ser objetos simples sin lógica de infraestructura
- **Casos de Uso Únicos**: Un caso de uso = una operación de negocio específica
- **Inyección de Dependencias**: Usar interfaces para desacoplar implementaciones concretas

**Rationale**: Mantener el dominio de negocio independiente permite testabilidad, mantenibilidad y evolución sin afectar capas superiores.

### II. TypeScript Estricto (NON-NEGOTIABLE)

Todo código TypeScript DEBE cumplir:
- Tipar parámetros y retornos de funciones públicas explícitamente
- Usar `readonly` para props de componentes
- Evitar `any` — usar `unknown` con validación si es necesario
- Usar tipos de unión para estados finitos (ej: `'idle' | 'loading' | 'success' | 'error'`)
- Usar alias `@/` para imports internos, NO rutas relativas profundas

**Nomenclatura**:
- Componentes: `PascalCase` (archivo y nombre)
- Hooks: `camelCase` con prefijo `use`
- Constantes globales: `UPPER_SNAKE_CASE`
- Interfaces/Types: `PascalCase`

**Rationale**: El tipado estricto previene errores en tiempo de compilación y mejora la documentación del código.

### III. Testing First (NON-NEGOTIABLE)

Cobertura mínima OBLIGATORIA:
- **Funciones/Utils**: 90%
- **Hooks**: 85%
- **Services**: 80%
- **Components**: 80%
- **Stores**: 85%
- **Total Proyecto**: 89%

Estructura de tests:
- Tests unitarios: `[archivo].test.ts`
- Tests en carpeta `src/test/` como mirror de `src/`
- Patrón AAA: Arrange → Act → Assert
- Mocking con `vi.mock()` para servicios externos

**Rationale**: La cobertura alta garantiza estabilidad en refactorizaciones y detecta regresiones tempranamente.

### IV. UX/UI Standards

Todo componente de interfaz DEBE cumplir:
- **Feedback Inmediato**: Toda acción del usuario tiene respuesta visual
- **Estados de Carga**: Usar Skeletons o spinners apropiados
- **Manejo de Errores**: Mensajes claros y accionables (toasts, alerts)
- **Accesibilidad**: WCAG 2.1 AA mínimo
- **Responsive First**: Diseñar mobile-first, luego desktop
- **Animaciones Sutiles**: Usar Framer Motion con moderación

Patrones obligatorios:
- Variantes con CVA (Class Variance Authority)
- Merge de clases con `cn()`

**Rationale**: Una UX consistente mejora la experiencia del usuario y reduce fricción.

### V. State Management

Jerarquía de estado OBLIGATORIA (de más específico a más global):
1. **Estado Local** (`useState`): UI local del componente
2. **Estado de Servidor** (TanStack Query): Datos del servidor con cache
3. **Estado Global** (Zustand): Estado compartido entre componentes
4. **Estado de URL** (Next.js): Parámetros de búsqueda y rutas

Patrones:
- Zustand stores DEBEN usar `devtools` middleware
- TanStack Query DEBE centralizar query keys
- Formularios: React Hook Form + Zod para validación

**Rationale**: Una jerarquía clara de estado evita estados duplicados y facilita el debugging.

## Stack Tecnológico

**Producción**:
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | ^16.0.7 | Framework React SSR/SSG |
| React | ^19.2.1 | Librería UI |
| TypeScript | ^5 | Tipado estático |
| Tailwind CSS | ^4.1.17 | Utilidades CSS |
| Zustand | ^5.0.9 | Estado global |
| TanStack Query | ^5.90.12 | Datos del servidor |
| Framer Motion | ^12.23.25 | Animaciones |
| React Hook Form | ^7.68.0 | Formularios |
| Zod | ^4.1.13 | Validación |
| Axios | ^1.9.0 | Cliente HTTP |

**Desarrollo**:
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Vitest | ^4.0.15 | Testing |
| Testing Library | ^16.3.0 | Testing React |
| ESLint | ^9 | Linter |
| jsdom | ^27.2.0 | DOM virtual |

## Development Workflow

### Checklist de PR (OBLIGATORIO)

**Código**:
- [ ] TypeScript sin errores (`tsc --noEmit`)
- [ ] ESLint sin warnings (`npm run lint`)
- [ ] Sin `console.log` en producción
- [ ] Sin TODO/FIXME sin issue asociado

**Funcionalidad**:
- [ ] Feature funciona según especificación
- [ ] Manejo de errores implementado
- [ ] Estados de carga implementados
- [ ] Responsive en móvil y desktop

**Testing**:
- [ ] Tests unitarios cubren el código nuevo
- [ ] Cobertura cumple mínimos por tipo

## Governance

Esta constitución es la **fuente de verdad** para decisiones de arquitectura y código. Todas las especificaciones derivadas DEBEN alinearse con estos principios.

**Proceso de Enmienda**:
1. Proponer cambio documentando razón y impacto
2. Revisión y aprobación requerida
3. Incrementar versión según:
   - **MAJOR**: Cambios incompatibles o eliminación de principios
   - **MINOR**: Nuevos principios o expansiones materiales
   - **PATCH**: Clarificaciones, correcciones menores

**Cumplimiento**:
- Todo PR DEBE verificar adherencia a principios
- Excepciones DEBEN documentarse con justificación
- Referencia: `Especificaciones.md` para guías de desarrollo detalladas

**Version**: 1.0.0 | **Ratified**: 2026-04-14 | **Last Amended**: 2026-04-14
