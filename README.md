# 🎯 Sistema de Gestión de Configuraciones

Una aplicación web moderna construida con **Next.js 14**, **React 18**, **TypeScript** y **Tailwind CSS** que permite gestionar configuraciones de manera intuitiva y eficiente.

## 📋 Tabla de Contenidos

- [🚀 Características](#-características)
- [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [📁 Estructura de Directorios](#-estructura-de-directorios)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [⚙️ Instalación y Configuración](#️-instalación-y-configuración)
- [🔧 Scripts Disponibles](#-scripts-disponibles)
- [📱 Componentes Principales](#-componentes-principales)
- [🎨 Sistema de Diseño](#-sistema-de-diseño)
- [🧪 Testing](#-testing)
- [📊 Análisis de Código](#-análisis-de-código)
- [🚀 Despliegue](#-despliegue)
- [🤝 Contribuir](#-contribuir)

## 🚀 Características

### ✨ Funcionalidades Principales
- **📝 Gestión de Configuraciones**: Crear, editar y eliminar configuraciones de forma dinámica
- **🔍 Búsqueda y Filtros**: Sistema avanzado de búsqueda con filtros múltiples
- **📊 Dashboard Interactivo**: Visualización de datos con gráficos y métricas
- **🌙 Modo Oscuro/Claro**: Cambio de tema automático y manual
- **📱 Diseño Responsivo**: Optimizado para dispositivos móviles y desktop
- **🔄 Actualizaciones en Tiempo Real**: Sincronización automática de datos
- **💾 Persistencia Local**: Almacenamiento local de preferencias de usuario

### 🎯 Características Técnicas
- **⚡ Server-Side Rendering (SSR)**: Renderizado del lado del servidor con Next.js
- **🏃‍♂️ Client-Side Navigation**: Navegación rápida sin recarga de página
- **🎨 UI Moderna**: Componentes reutilizables con shadcn/ui
- **🔒 TypeScript**: Tipado estático para mayor seguridad
- **🧪 Testing Completo**: Pruebas unitarias y de integración
- **📈 Análisis de Código**: Integración con SonarQube
- **🔄 CI/CD**: Automatización con GitHub Actions

## 🏗️ Arquitectura del Proyecto

### 🏛️ Patrones de Diseño Implementados

#### **📦 Arquitectura por Capas**
```
┌─────────────────────────────────────┐
│           UI Components             │  ← Presentación
├─────────────────────────────────────┤
│              Hooks                  │  ← Lógica de Estado
├─────────────────────────────────────┤
│             Services                │  ← Lógica de Negocio
├─────────────────────────────────────┤
│              Utils                  │  ← Utilidades
└─────────────────────────────────────┘
```

#### **🎭 Composición de Componentes**
- **Componentes Atómicos**: Elementos básicos reutilizables (Button, Input, etc.)
- **Componentes Moleculares**: Combinaciones de átomos (SearchBar, Card, etc.)
- **Componentes Organismales**: Secciones complejas (ConfigurationPanel, Dashboard)
- **Templates**: Estructuras de página completas

## 📁 Estructura de Directorios

```
📦 proyecto/
├── 📁 .github/workflows/        # Configuración CI/CD
│   ├── ci.yml                   # Pipeline de integración continua
│   └── deploy.yml               # Pipeline de despliegue
├── 📁 .next/                    # Archivos generados por Next.js
├── 📁 .qodo/                    # Configuración de Qodo
├── 📁 coverage/                 # Reportes de cobertura de pruebas
├── 📁 public/                   # Archivos estáticos públicos
│   └── 📁 assets/               # Imágenes, iconos, etc.
├── 📁 src/                      # Código fuente principal
│   ├── 📁 app/                  # App Router de Next.js 14
│   │   ├── 📁 (dashboard)/      # Grupo de rutas del dashboard
│   │   │   ├── 📁 analytics/    # Página de analíticas
│   │   │   ├── 📁 config/       # Página de configuraciones
│   │   │   └── layout.tsx       # Layout del dashboard
│   │   ├── 📁 api/              # API Routes de Next.js
│   │   │   └── 📁 config/       # Endpoints de configuración
│   │   ├── globals.css          # Estilos globales
│   │   ├── layout.tsx           # Layout raíz de la aplicación
│   │   ├── loading.tsx          # Componente de carga global
│   │   ├── not-found.tsx        # Página 404 personalizada
│   │   └── page.tsx             # Página principal
│   ├── 📁 components/           # Componentes React reutilizables
│   │   ├── 📁 ui/               # Componentes base de shadcn/ui
│   │   │   ├── button.tsx       # Componente botón
│   │   │   ├── card.tsx         # Componente tarjeta
│   │   │   ├── dialog.tsx       # Componente modal
│   │   │   ├── input.tsx        # Componente input
│   │   │   ├── label.tsx        # Componente etiqueta
│   │   │   ├── table.tsx        # Componente tabla
│   │   │   └── tabs.tsx         # Componente pestañas
│   │   ├── 📁 layout/           # Componentes de layout
│   │   │   ├── header.tsx       # Cabecera de la aplicación
│   │   │   ├── sidebar.tsx      # Barra lateral de navegación
│   │   │   └── footer.tsx       # Pie de página
│   │   ├── 📁 forms/            # Componentes de formularios
│   │   │   ├── config-form.tsx  # Formulario de configuración
│   │   │   └── search-form.tsx  # Formulario de búsqueda
│   │   └── 📁 charts/           # Componentes de gráficos
│   │       ├── bar-chart.tsx    # Gráfico de barras
│   │       └── line-chart.tsx   # Gráfico de líneas
│   ├── 📁 hooks/                # Custom Hooks de React
│   │   ├── use-config.ts        # Hook para gestión de configuraciones
│   │   ├── use-local-storage.ts # Hook para localStorage
│   │   └── use-theme.ts         # Hook para gestión de temas
│   ├── 📁 lib/                  # Librerías y utilidades
│   │   ├── utils.ts             # Funciones utilitarias generales
│   │   ├── validations.ts       # Esquemas de validación con Zod
│   │   └── constants.ts         # Constantes de la aplicación
│   ├── 📁 services/             # Servicios para APIs y datos
│   │   ├── config-service.ts    # Servicio de configuraciones
│   │   └── api-client.ts        # Cliente HTTP reutilizable
│   ├── 📁 types/                # Definiciones de tipos TypeScript
│   │   ├── config.ts            # Tipos relacionados con configuraciones
│   │   └── api.ts               # Tipos para respuestas de API
│   └── 📁 __tests__/            # Archivos de pruebas
│       ├── 📁 components/       # Pruebas de componentes
│       ├── 📁 hooks/            # Pruebas de hooks
│       └── 📁 utils/            # Pruebas de utilidades
├── 📄 configuracion.yaml        # Configuración principal de la app
├── 📄 components.json           # Configuración de shadcn/ui
├── 📄 .env                      # Variables de entorno
├── 📄 .gitignore               # Archivos ignorados por Git
├── 📄 eslint.config.mjs        # Configuración de ESLint
├── 📄 next.config.ts           # Configuración de Next.js
├── 📄 package.json             # Dependencias y scripts
├── 📄 postcss.config.mjs       # Configuración de PostCSS
├── 📄 sonar-project.properties # Configuración de SonarQube
├── 📄 tailwind.config.ts       # Configuración de Tailwind CSS
├── 📄 tsconfig.json            # Configuración de TypeScript
├── 📄 vitest.config.ts         # Configuración de Vitest
└── 📄 vitest.setup.ts          # Setup de pruebas
```

## 🛠️ Tecnologías Utilizadas

### 🎯 Frontend Core
- **[Next.js 14](https://nextjs.org/)** - Framework React con App Router
- **[React 18](https://react.dev/)** - Biblioteca de UI con Hooks y Suspense
- **[TypeScript](https://www.typescriptlang.org/)** - Superset de JavaScript con tipado estático

### 🎨 Estilos y UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI reutilizables
- **[Lucide React](https://lucide.dev/)** - Iconos SVG modernos
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Gestión de temas

### 📊 Visualización de Datos
- **[Recharts](https://recharts.org/)** - Librería de gráficos para React
- **[date-fns](https://date-fns.org/)** - Utilidades modernas para fechas

### 🔧 Desarrollo y Tooling
- **[ESLint](https://eslint.org/)** - Linter para JavaScript/TypeScript
- **[Prettier](https://prettier.io/)** - Formateador de código
- **[Husky](https://typicode.github.io/husky/)** - Git hooks automatizados

### 🧪 Testing
- **[Vitest](https://vitest.dev/)** - Framework de testing rápido
- **[Testing Library](https://testing-library.com/)** - Utilidades para testing de componentes
- **[jsdom](https://github.com/jsdom/jsdom)** - Implementación DOM para Node.js

### 📊 Análisis y Calidad
- **[SonarQube](https://www.sonarsource.com/products/sonarqube/)** - Análisis de calidad de código

## ⚙️ Instalación y Configuración

### 📋 Prerrequisitos
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0

### 🚀 Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd proyecto

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# 4. Ejecutar en modo desarrollo
npm run dev
```

### 🔧 Configuración Detallada

#### **1. Variables de Entorno**
Crear archivo `.env.local`:
```env
# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME="Sistema de Configuraciones"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# URLs de API
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Configuración de base de datos
DATABASE_URL="postgresql://..."

# Claves de servicios externos
NEXT_PUBLIC_ANALYTICS_ID="your-analytics-id"
```

#### **2. Configuración de shadcn/ui**
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## 🔧 Scripts Disponibles

```bash
# 🚀 Desarrollo
npm run dev          # Servidor de desarrollo (http://localhost:3000)
npm run dev:turbo     # Desarrollo con Turbopack (experimental)

# 🏗️ Construcción
npm run build         # Construir para producción
npm run start         # Iniciar servidor de producción

# 🧪 Testing
npm run test          # Ejecutar todas las pruebas
npm run test:watch    # Ejecutar pruebas en modo watch
npm run test:ui       # Interfaz gráfica de pruebas
npm run test:coverage # Generar reporte de cobertura

# 🔍 Linting y Formateo
npm run lint          # Ejecutar ESLint
npm run lint:fix      # Corregir errores de ESLint automáticamente
npm run format        # Formatear código con Prettier

# 📊 Análisis
npm run analyze       # Analizar bundle de la aplicación
npm run sonar         # Ejecutar análisis de SonarQube
```

## 📱 Componentes Principales

### 🏠 Layout Components

#### **Header Component** (`src/components/layout/header.tsx`)
- **Propósito**: Barra de navegación principal
- **Características**:
  - Logo y título de la aplicación
  - Menú de navegación responsive
  - Selector de tema (oscuro/claro)
  - Indicadores de estado

#### **Sidebar Component** (`src/components/layout/sidebar.tsx`)
- **Propósito**: Navegación lateral para desktop
- **Características**:
  - Menú colapsible
  - Iconos de navegación
  - Estados activos
  - Agrupación de elementos

### 📝 Form Components

#### **ConfigForm Component** (`src/components/forms/config-form.tsx`)
- **Propósito**: Formulario principal para crear/editar configuraciones
- **Características**:
  - Validación con Zod
  - Estados de carga
  - Mensajes de error
  - Guardado automático

#### **SearchForm Component** (`src/components/forms/search-form.tsx`)
- **Propósito**: Búsqueda y filtrado de configuraciones
- **Características**:
  - Búsqueda en tiempo real
  - Filtros múltiples
  - Historial de búsquedas
  - Sugerencias automáticas

### 📊 Chart Components

#### **BarChart Component** (`src/components/charts/bar-chart.tsx`)
- **Propósito**: Visualización de datos en barras
- **Características**:
  - Datos dinámicos
  - Tooltips interactivos
  - Responsive
  - Múltiples series

#### **LineChart Component** (`src/components/charts/line-chart.tsx`)
- **Propósito**: Gráficos de líneas para tendencias
- **Características**:
  - Zoom y pan
  - Leyendas configurables
  - Animaciones suaves
  - Exportación de datos

### 🧩 UI Components (shadcn/ui)

Todos los componentes base están optimizados y personalizados:

- **Button**: Múltiples variantes y tamaños
- **Card**: Contenedores flexibles para contenido
- **Dialog**: Modales accesibles
- **Input**: Campos de entrada con validación
- **Table**: Tablas con ordenamiento y paginación
- **Tabs**: Navegación por pestañas

## 🎨 Sistema de Diseño

### 🎨 Paleta de Colores

```css
/* Tema Claro */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 222.2 47.4% 11.2%;
--primary-foreground: 210 40% 98%;

/* Tema Oscuro */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
--primary: 210 40% 98%;
--primary-foreground: 222.2 47.4% 11.2%;
```

### 📐 Sistema de Espaciado
- **Base**: 4px (0.25rem)
- **Escalas**: 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12

### 🔤 Tipografía
- **Fuente Principal**: Inter (Google Fonts)
- **Escalas**: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl

### 📱 Breakpoints Responsivos
```javascript
screens: {
  'sm': '640px',   // Móvil grande
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop pequeño
  'xl': '1280px',  // Desktop
  '2xl': '1536px'  // Desktop grande
}
```

## 🧪 Testing

### 🎯 Estrategia de Testing

#### **1. Pruebas Unitarias**
- **Componentes**: Testing Library + Vitest
- **Hooks**: Renderizado aislado
- **Utilidades**: Pruebas de funciones puras
- **Servicios**: Mocking de APIs

#### **2. Pruebas de Integración**
- **Flujos de usuario**: End-to-end scenarios
- **Interacciones**: Formularios y navegación
- **Estados**: Gestión de estado global

#### **3. Configuración de Testing**

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  }
})
```

### 📊 Métricas de Cobertura
- **Objetivo**: > 80% cobertura global
- **Componentes Críticos**: > 90% cobertura
- **Funciones Utilitarias**: 100% cobertura

### 🧪 Ejecutar Pruebas

```bash
# Todas las pruebas
npm run test

# Modo watch
npm run test:watch

# Con interfaz gráfica
npm run test:ui

# Cobertura detallada
npm run test:coverage
```

## 📊 Análisis de Código

### 🔍 SonarQube Integration

#### **Configuración** (`sonar-project.properties`)
```properties
sonar.projectKey=sistema-configuraciones
sonar.organization=tu-organizacion
sonar.sources=src
sonar.tests=src/__tests__
sonar.exclusions=**/*.test.ts,**/*.spec.ts,**/node_modules/**
sonar.typescript.lcov.reportPaths=coverage/lcov.info
```

#### **Métricas Monitoreadas**
- **🐛 Bugs**: 0 tolerancia
- **🔒 Vulnerabilidades**: 0 tolerancia
- **👃 Code Smells**: < 10
- **📊 Cobertura**: > 80%
- **🔄 Duplicación**: < 3%

### 📈 Ejecutar Análisis

```bash
# Análisis local
npm run sonar

# Con reporte de cobertura
npm run test:coverage && npm run sonar
```

## 🚀 Despliegue

### 🌐 Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 🐳 Docker

```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
COPY . .
RUN npm run build

FROM base AS runtime
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### ☁️ Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 🔧 Variables de Entorno para Producción

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
DATABASE_URL=postgresql://prod-database-url
REDIS_URL=redis://prod-redis-url
```

## 🤝 Contribuir

### 📝 Guía de Contribución

#### **1. Configuración del Entorno**
```bash
# Fork del repositorio
git clone https://github.com/tu-usuario/proyecto.git
cd proyecto

# Instalar dependencias
npm install

# Crear rama para feature
git checkout -b feature/nueva-funcionalidad
```

#### **2. Convenciones de Código**

##### **Commits** (Conventional Commits)
```bash
feat: añadir nueva funcionalidad de configuración
fix: corregir error en validación de formularios
docs: actualizar documentación de componentes
style: mejorar estilos de la tabla
refactor: optimizar hook de configuraciones
test: añadir pruebas para servicio de API
```

##### **Nomenclatura de Archivos**
- **Componentes**: `PascalCase.tsx` (ej: `ConfigForm.tsx`)
- **Hooks**: `camelCase.ts` (ej: `useConfig.ts`)
- **Utilidades**: `kebab-case.ts` (ej: `api-client.ts`)
- **Tipos**: `camelCase.ts` (ej: `config.ts`)

##### **Estructura de Componentes**
```typescript
// 1. Imports externos
import React from 'react'
import { useState } from 'react'

// 2. Imports internos
import { Button } from '@/components/ui/button'
import { useConfig } from '@/hooks/use-config'

// 3. Tipos
interface ComponentProps {
  title: string;
  onSave: () => void;
}

// 4. Componente
export function Component({ title, onSave }: ComponentProps) {
  // Hooks
  const [loading, setLoading] = useState(false)
  const { configs } = useConfig()

  // Handlers
  const handleSave = () => {
    setLoading(true)
    onSave()
    setLoading(false)
  }

  // Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleSave} disabled={loading}>
        Guardar
      </Button>
    </div>
  )
}
```

#### **3. Process de Pull Request**

1. **🔍 Pre-commit Checks**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

2. **📝 Descripción del PR**
   - Describir cambios realizados
   - Incluir screenshots si aplica
   - Referenciar issues relacionados
   - Listar breaking changes

3. **✅ Checklist del PR**
   - [ ] Código linted y formateado
   - [ ] Pruebas añadidas/actualizadas
   - [ ] Documentación actualizada
   - [ ] No hay breaking changes
   - [ ] Performance no afectado

#### **4. Roadmap y Issues**

##### **🎯 Próximas Funcionalidades**
- [ ] Sistema de autenticación
- [ ] API REST completa
- [ ] Modo offline con PWA
- [ ] Notificaciones push
- [ ] Exportación de configuraciones
- [ ] Sistema de plugins

##### **🐛 Issues Conocidos**
- Mejora en rendimiento de tablas grandes
- Optimización de bundle size
- Soporte para IE11 (deprecado)

### 📞 Soporte y Contacto

- **📧 Email**: desarrollador@proyecto.com
- **💬 Discord**: [Servidor de la Comunidad](https://discord.gg/...)
- **🐛 Issues**: [GitHub Issues](https://github.com/usuario/proyecto/issues)
- **📚 Documentación**: [Wiki del Proyecto](https://github.com/usuario/proyecto/wiki)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **shadcn/ui** por los componentes base
- **Vercel** por el hosting y herramientas
- **Next.js Team** por el framework
- **Tailwind CSS** por el sistema de estilos
- **Comunidad Open Source** por las contribuciones

---

<div align="center">
  <p>Hecho con ❤️ por el equipo de desarrollo</p>
  <p>
    <a href="#-tabla-de-contenidos">⬆️ Volver arriba</a>
  </p>
</div>