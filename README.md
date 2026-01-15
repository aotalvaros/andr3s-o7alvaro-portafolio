# 🚀 Portafolio Personal - Andrés Otalvaro

Portafolio web profesional construido con **Next.js 16**, **React 19**, **TypeScript** y **Tailwind CSS 4**. Incluye secciones interactivas, integración con APIs externas, sistema de autenticación, panel de administración y comunicación en tiempo real con WebSockets.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat&logo=vercel)](https://andr3s-o7alvaro-portafolio.vercel.app/)
[![SonarCloud](https://img.shields.io/badge/SonarCloud-Analyzed-4E9BCD?style=flat&logo=sonarcloud)](https://sonarcloud.io)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=flat&logo=github-actions)](https://github.com/features/actions)

## 🌐 Enlaces

- **🔗 Portafolio en vivo**: [https://andr3s-o7alvaro-portafolio.vercel.app/](https://andr3s-o7alvaro-portafolio.vercel.app/)
- **🔧 Backend Repository**: [https://github.com/aotalvaros/portfolio-backend](https://github.com/aotalvaros/portfolio-backend)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [Estructura de Directorios](#-estructura-de-directorios)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Instalación y Configuración](#️-instalación-y-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Testing y Calidad de Código](#-testing-y-calidad-de-código)
- [Despliegue](#-despliegue)
- [Variables de Entorno](#-variables-de-entorno)

---

## ✨ Características

### 🎯 Funcionalidades Principales

- **🏠 Portafolio Personal**: Secciones Hero, About, Skills y Contact
- **🔐 Sistema de Autenticación**: Login con JWT y protección de rutas
- **👨‍💼 Panel de Administración**: Dashboard para gestión de módulos y estadísticas
- **🔄 Comunicación en Tiempo Real**: WebSockets con Socket.io
- **🛠️ Laboratorio Interactivo**: 
  - 🌦️ Aplicación del Clima (OpenWeather API)
  - 🎮 Pokédex (PokéAPI)
  - 🚀 Explorador NASA (NASA APIs - Mars Rover, Asteroids)
- **🌙 Modo Oscuro/Claro**: Cambio de tema con persistencia
- **📱 Diseño Responsivo**: Optimizado para móviles, tablets y desktop
- **🎨 Animaciones Fluidas**: Framer Motion para transiciones suaves
- **⚡ Optimización de Rendimiento**: Lazy loading, code splitting, image optimization
- **🔍 Command Palette**: Navegación rápida con atajos de teclado
- **🎯 Mantenimiento Dinámico**: Sistema de módulos activables/desactivables desde el backend

### 🏗️ Características Técnicas

- **⚡ Server-Side Rendering (SSR)**: Next.js App Router
- **🎨 UI Moderna**: Componentes reutilizables con Radix UI
- **🔒 TypeScript**: Tipado estático completo
- **🧪 Testing Completo**: Vitest + Testing Library (cobertura > 80%)
- **📊 Análisis de Código**: SonarCloud integrado
- **🔄 CI/CD**: GitHub Actions para build y análisis automático
- **🏛️ Arquitectura Limpia**: Separación de capas (Domain, Application, Infrastructure)
- **🎯 SOLID Principles**: Código mantenible y escalable

---

## 🏗️ Arquitectura del Proyecto

### 📦 Arquitectura por Capas

```
┌─────────────────────────────────────┐
│      Presentation Layer             │  ← Components, Pages, UI
├─────────────────────────────────────┤
│      Application Layer              │  ← Use Cases, Hooks
├─────────────────────────────────────┤
│      Domain Layer                   │  ← Entities, Interfaces
├─────────────────────────────────────┤
│      Infrastructure Layer           │  ← HTTP Client, Services, Repositories
└─────────────────────────────────────┘
```

### 🎭 Patrones Implementados

- **Factory Pattern**: `httpClientFactory` para crear instancias configuradas
- **Interceptor Pattern**: Manejo de autenticación, loading y errores
- **Repository Pattern**: Abstracción de acceso a datos
- **Provider Pattern**: Context API para estado global (Socket, Theme, Auth)
- **Custom Hooks**: Lógica reutilizable encapsulada
- **Atomic Design**: Componentes organizados por complejidad

---

## 📁 Estructura de Directorios

```
📦 andr3s-o7alvaro-portafolio/
├── 📁 .github/workflows/          # CI/CD con GitHub Actions
│   ├── build.yml                  # Pipeline de build y SonarCloud
│   └── sonar.yml                  # Análisis de calidad de código
├── 📁 public/                     # Archivos estáticos
│   ├── 📁 assets/                 # Imágenes y recursos
│   │   ├── climateScenario/       # Imágenes del clima
│   │   └── NASA/                  # Recursos de NASA
│   └── favicon.png
├── 📁 src/                        # Código fuente
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 (public)/           # Rutas públicas
│   │   │   ├── 📁 lab/            # Laboratorio (Weather, Pokemon, NASA)
│   │   │   ├── 📁 login/          # Página de login
│   │   │   ├── App.tsx            # Layout principal público
│   │   │   ├── layout.tsx         # Layout wrapper
│   │   │   └── page.tsx           # Página principal (Hero, About, Skills, Contact)
│   │   ├── 📁 admin/              # Panel de administración (protegido)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css            # Estilos globales
│   │   ├── layout.tsx             # Root layout
│   │   ├── LoaderOverlay.tsx      # Overlay de carga global
│   │   └── providers.tsx          # Providers wrapper (React Query)
│   ├── 📁 components/             # Componentes React
│   │   ├── 📁 auth/               # Autenticación (LoginForm, ProtectedRoute, PublicRoute)
│   │   ├── 📁 contact/            # Formulario de contacto
│   │   ├── 📁 layout/             # Navbar, Pagination, CommandPalette
│   │   ├── 📁 maintenance/        # Sistema de mantenimiento
│   │   ├── 📁 nasa/               # Componentes NASA (Asteroids, Mars Rover)
│   │   ├── 📁 pokemon/            # Pokédex components
│   │   ├── 📁 sections/           # Secciones principales (Hero, About, Skills, Admin)
│   │   ├── 📁 ui/                 # Componentes UI base (Button, Card, Modal, etc.)
│   │   └── 📁 weather/            # Aplicación del clima
│   ├── 📁 config/                 # Configuraciones
│   │   └── iconMappings.ts        # Mapeo de iconos dinámicos
│   ├── 📁 constants/              # Constantes de la aplicación
│   │   ├── moduleNames.ts
│   │   ├── path.constants.ts
│   │   └── sectionsOrder.constants.ts
│   ├── 📁 context/                # React Context
│   │   └── SocketContext.tsx      # Context de WebSocket
│   ├── 📁 core/                   # Arquitectura limpia
│   │   ├── 📁 application/        # Casos de uso
│   │   ├── 📁 domain/             # Entidades y reglas de negocio
│   │   └── 📁 infrastructure/     # Implementaciones
│   │       ├── 📁 http/           # Cliente HTTP
│   │       │   ├── 📁 interceptors/ # Auth, Loading, Error interceptors
│   │       │   ├── HttpClient.ts
│   │       │   ├── httpClientFactory.ts
│   │       │   └── nasaHttpClientFactory.ts
│   │       ├── 📁 repositories/   # Repositorios
│   │       └── 📁 services/       # Servicios de infraestructura
│   │           ├── CookieStorageService.ts
│   │           ├── LoadingService.ts
│   │           └── ToastNotificationService.ts
│   ├── 📁 hooks/                  # Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   ├── useDynamicIcon.ts
│   │   ├── useFirstVisit.ts
│   │   ├── useImageFallback.ts
│   │   ├── useIsMobile.ts
│   │   ├── useRecaptcha.tsx
│   │   ├── useScrollDirection.ts
│   │   └── useSocket.tsx
│   ├── 📁 lib/                    # Utilidades
│   │   ├── pokemonUtils.ts
│   │   └── utils.ts               # Funciones helper (cn, etc.)
│   ├── 📁 providers/              # Providers
│   │   ├── CommandPaletteProvider.tsx
│   │   └── theme-provider.tsx
│   ├── 📁 schemas/                # Validación con Zod
│   │   ├── auth.schema.ts
│   │   └── contact.schema.ts
│   ├── 📁 services/               # Servicios de API
│   │   ├── 📁 login/
│   │   ├── 📁 maintenance/        # Gestión de módulos
│   │   ├── 📁 nasa/               # NASA APIs
│   │   ├── 📁 pokemon/            # PokéAPI
│   │   └── 📁 weather/            # OpenWeather API
│   ├── 📁 store/                  # Estado global con Zustand
│   │   ├── commandPaletteStore.ts
│   │   ├── dynamicIconStore.ts
│   │   ├── loadingStore.ts
│   │   ├── themeStore.ts
│   │   ├── ToastMessageStore.ts
│   │   └── weatherStore.ts
│   ├── 📁 test/                   # Tests unitarios
│   │   ├── 📁 app/
│   │   ├── 📁 components/
│   │   ├── 📁 hooks/
│   │   ├── 📁 services/
│   │   └── 📁 store/
│   ├── 📁 types/                  # Definiciones de tipos TypeScript
│   └── 📁 utils/                  # Utilidades generales
├── 📁 coverage/                   # Reportes de cobertura de tests
├── .env                           # Variables de entorno
├── components.json                # Configuración de shadcn/ui
├── eslint.config.mjs              # Configuración ESLint
├── next.config.ts                 # Configuración Next.js
├── package.json                   # Dependencias
├── sonar-project.properties       # Configuración SonarCloud
├── tailwind.config.ts             # Configuración Tailwind CSS
├── tsconfig.json                  # Configuración TypeScript
├── vitest.config.ts               # Configuración Vitest
└── vitest.setup.ts                # Setup de tests
```

---

## 🛠️ Tecnologías Utilizadas

### 🎯 Frontend Core

- **[Next.js 16](https://nextjs.org/)** - Framework React con App Router y SSR
- **[React 19](https://react.dev/)** - Biblioteca de UI
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipado estático

### 🎨 Estilos y UI

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes accesibles sin estilos
- **[Framer Motion 12](https://www.framer.com/motion/)** - Animaciones fluidas
- **[Lucide React](https://lucide.dev/)** - Iconos SVG
- **[React Icons](https://react-icons.github.io/react-icons/)** - Biblioteca de iconos
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Gestión de temas

### 📊 Gestión de Estado y Datos

- **[Zustand](https://zustand-demo.pmnd.rs/)** - Estado global ligero
- **[TanStack Query (React Query)](https://tanstack.com/query)** - Gestión de datos asíncronos
- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[Socket.io Client](https://socket.io/)** - WebSockets en tiempo real

### 📝 Formularios y Validación

- **[React Hook Form](https://react-hook-form.com/)** - Gestión de formularios
- **[Zod](https://zod.dev/)** - Validación de esquemas
- **[React Google reCAPTCHA](https://www.npmjs.com/package/react-google-recaptcha)** - Protección anti-spam

### 🧪 Testing y Calidad

- **[Vitest](https://vitest.dev/)** - Framework de testing rápido
- **[Testing Library](https://testing-library.com/)** - Testing de componentes
- **[jsdom](https://github.com/jsdom/jsdom)** - Entorno DOM para tests
- **[SonarCloud](https://sonarcloud.io/)** - Análisis de calidad de código

### 🔧 Desarrollo y Tooling

- **[ESLint](https://eslint.org/)** - Linter para JavaScript/TypeScript
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD

### 🌐 APIs Externas

- **[NASA API](https://api.nasa.gov/)** - Mars Rover Photos, Asteroids
- **[PokéAPI](https://pokeapi.co/)** - Datos de Pokémon
- **[OpenWeather API](https://openweathermap.org/api)** - Datos meteorológicos
- **Backend Custom** - API REST con autenticación JWT

---

## ⚙️ Instalación y Configuración

### 📋 Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0
- **Backend** corriendo en `http://localhost:4000` (o configurar URL en `.env`)

### 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/aotalvaros/andr3s-o7alvaro-portafolio.git
cd andr3s-o7alvaro-portafolio

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves de API

# 4. Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 🔧 Scripts Disponibles

```bash
# 🚀 Desarrollo
npm run dev          # Servidor de desarrollo con Turbopack
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción

# 🧪 Testing
npm run test         # Ejecutar tests con Vitest
npm run coverage     # Generar reporte de cobertura

# 🔍 Linting
npm run lint         # Ejecutar ESLint
```

---

## 🧪 Testing y Calidad de Código

### 📊 Cobertura de Tests

El proyecto mantiene una cobertura de código superior al **80%** con pruebas unitarias usando **Vitest** y **Testing Library**.

```bash
# Ejecutar tests
npm run test

# Generar reporte de cobertura
npm run coverage
```

Los reportes se generan en la carpeta `coverage/` con formato:
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info` (para SonarCloud)
- **Cobertura**: `coverage/cobertura-coverage.xml`

### 🔍 SonarCloud

El proyecto está integrado con **SonarCloud** para análisis continuo de calidad de código:

- **Análisis automático**: Cada push a `master` ejecuta análisis
- **Métricas monitoreadas**:
  - 🐛 Bugs
  - 🔒 Vulnerabilidades de seguridad
  - 👃 Code Smells
  - 📊 Cobertura de código
  - 🔄 Duplicación de código

**Configuración**: `sonar-project.properties`

### 🔄 CI/CD con GitHub Actions

Dos workflows configurados:

1. **build.yml**: Build, tests y análisis SonarCloud (Windows)
2. **sonar.yml**: Análisis adicional de SonarCloud (Ubuntu)

Los workflows se ejecutan automáticamente en:
- Push a `master`
- Pull requests

---

## 🚀 Despliegue

### 🌐 Vercel (Producción)

El proyecto está desplegado en **Vercel**:

**URL**: [https://andr3s-o7alvaro-portafolio.vercel.app/](https://andr3s-o7alvaro-portafolio.vercel.app/)

#### Desplegar tu propia versión:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Configuración en Vercel:

1. Conectar repositorio de GitHub
2. Configurar variables de entorno (ver sección siguiente)
3. Deploy automático en cada push a `master`

### 🐳 Docker (Opcional)

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

---

## 🔐 Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Backend API
NEXT_PUBLIC_BASE_URL=http://localhost:4000

# Socket.io
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000

# NASA API
NEXT_PUBLIC_NASA_API_KEY=tu_clave_nasa_api

# OpenWeather API
NEXT_PUBLIC_OPENWEATHER_API_KEY=tu_clave_openweather

# Google reCAPTCHA
NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY=tu_site_key
NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_SECRET=tu_secret_key
```

### 🔑 Obtener API Keys:

- **NASA API**: [https://api.nasa.gov/](https://api.nasa.gov/)
- **OpenWeather**: [https://openweathermap.org/api](https://openweathermap.org/api)
- **Google reCAPTCHA**: [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)

---

## 📱 Funcionalidades Destacadas

### 🏠 Portafolio Principal

- **Hero Section**: Presentación con animaciones
- **About Section**: Información personal y profesional
- **Skills Section**: Tecnologías y habilidades con iconos dinámicos
- **Contact Form**: Formulario con validación y reCAPTCHA

### 🔐 Sistema de Autenticación

- Login con JWT
- Refresh token automático
- Rutas protegidas (ProtectedRoute)
- Rutas públicas (PublicRoute)
- Persistencia de sesión con cookies

### 👨‍💼 Panel de Administración

- Dashboard con estadísticas
- Gestión de módulos (activar/desactivar)
- Visualización de actividad
- Gráficos con Recharts

### 🛠️ Laboratorio

#### 🌦️ Aplicación del Clima
- Búsqueda por ciudad
- Clima actual y pronóstico
- Calidad del aire
- Geolocalización

#### 🎮 Pokédex
- Búsqueda de Pokémon
- Detalles completos
- Filtros por tipo
- Paginación

#### 🚀 Explorador NASA
- Mars Rover Photos (Curiosity, Opportunity, Spirit)
- Near Earth Asteroids
- Filtros por fecha y cámara

### ⚡ Características Técnicas

- **Command Palette**: Navegación rápida con `Ctrl+K`
- **Modo Oscuro/Claro**: Persistente con next-themes
- **Loading States**: Overlay global y spinners personalizados
- **Toast Notifications**: Mensajes con Sonner
- **Scroll Progress**: Barra de progreso de scroll
- **Back to Top**: Botón flotante
- **Image Fallback**: Imágenes con fallback automático
- **Responsive Design**: Mobile-first approach

---

## 🏛️ Arquitectura Técnica

### HttpClient con Interceptors

El proyecto implementa un **HttpClient** personalizado con patrón de interceptores:

```typescript
// Interceptores configurados:
1. LoadingInterceptor - Maneja estados de carga
2. AuthInterceptor - Inyecta JWT y maneja refresh token
3. ErrorInterceptor - Maneja errores y muestra notificaciones
```

### Estado Global con Zustand

Stores implementados:
- `loadingStore` - Estado de carga global
- `themeStore` - Tema (dark/light)
- `weatherStore` - Datos del clima
- `commandPaletteStore` - Command palette
- `dynamicIconStore` - Iconos dinámicos
- `ToastMessageStore` - Notificaciones

### WebSockets con Socket.io

Comunicación en tiempo real para:
- Estado online/offline
- Notificaciones del servidor
- Actualizaciones de módulos

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

**Andrés Otalvaro**

- 📧 Email: andr3s.o7alvaro@gmail.com
- 🌐 Portafolio: [https://andr3s-o7alvaro-portafolio.vercel.app/](https://andr3s-o7alvaro-portafolio.vercel.app/)
- 💼 GitHub: [@aotalvaros](https://github.com/aotalvaros)

---

## 🙏 Agradecimientos

- **Next.js Team** por el framework
- **Vercel** por el hosting
- **Radix UI** por los componentes accesibles
- **Tailwind CSS** por el sistema de estilos
- **NASA, PokéAPI, OpenWeather** por las APIs públicas
- **Comunidad Open Source** por las herramientas

---

<div align="center">
  <p>Hecho con ❤️ por Andrés Otalvaro</p>
  <p>
    <a href="#-portafolio-personal---andrés-otalvaro">⬆️ Volver arriba</a>
  </p>
</div>
