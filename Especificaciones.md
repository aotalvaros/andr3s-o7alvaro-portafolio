

## 🎯 PROPÓSITO Y VISIÓN

Este documento establece los principios fundamentales, directrices de desarrollo y estándares que rigen el proyecto. Todo contribuidor debe adherirse a estas normas para mantener la calidad, consistencia y mantenibilidad del código.

---

## 📦 STACK TECNOLÓGICO

### Dependencias Principales (Producción)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | ^16.0.7 | Framework de React con SSR/SSG |
| **React** | ^19.2.1 | Librería de UI |
| **TypeScript** | ^5 | Tipado estático |
| **Tailwind CSS** | ^4.1.17 | Utilidades CSS |
| **Zustand** | ^5.0.9 | Estado global |
| **TanStack Query** | ^5.90.12 | Gestión de datos del servidor |
| **Framer Motion** | ^12.23.25 | Animaciones |
| **React Hook Form** | ^7.68.0 | Formularios |
| **Zod** | ^4.1.13 | Validación de esquemas |
| **Axios** | ^1.9.0 | Cliente HTTP |

### Dependencias de Desarrollo

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Vitest** | ^4.0.15 | Framework de testing |
| **Testing Library** | ^16.3.0 | Testing de componentes React |
| **ESLint** | ^9 | Linter de código |
| **jsdom** | ^27.2.0 | DOM virtual para tests |

---

## 🏗️ ARQUITECTURA

### Estructura: Clean Architecture + Feature-Based

```
src/
├── app/                    # App Router de Next.js (páginas y layouts)
├── core/                   # 🔵 Lógica de negocio pura
│   ├── domain/             # Entidades y reglas de negocio
│   │   ├── entities/       # Modelos de dominio (User, Weather, etc.)
│   │   └── repositories/   # Interfaces de repositorios
│   ├── application/        # Casos de uso
│   │   └── usecases/       # Operaciones de negocio
│   └── infrastructure/     # Implementaciones concretas
│       ├── http/           # Cliente HTTP y configuración
│       ├── repositories/   # Implementaciones de repositorios
│       └── services/       # Servicios de infraestructura
├── components/             # 🟢 Componentes de presentación
│   ├── ui/                 # Componentes atómicos reutilizables
│   ├── layout/             # Componentes de estructura
│   └── [feature]/          # Componentes agrupados por feature
├── hooks/                  # Custom hooks globales
├── store/                  # Stores de Zustand
├── services/               # Servicios de API (transición a core/)
├── types/                  # Definiciones de TypeScript
├── utils/                  # Utilidades puras
├── helpers/                # Funciones auxiliares
├── constants/              # Constantes de la aplicación
├── schemas/                # Esquemas de validación Zod
├── providers/              # Providers de contexto
├── context/                # Contextos de React
└── test/                   # Tests unitarios y de integración
```

### Principios Arquitectónicos

1. **Inversión de Dependencias**: core/ NO depende de presentation/
2. **Entidades Inmutables**: Las entidades del dominio son objetos simples
3. **Casos de Uso Únicos**: Un caso de uso = una operación de negocio
4. **Inyección de Dependencias**: Usar interfaces para desacoplar

---

## 📝 CONVENCIONES DE CÓDIGO

### Nomenclatura

```typescript
// ✅ Componentes: PascalCase
const WeatherCard = () => {...}

// ✅ Hooks: camelCase con prefijo "use"
const useWeatherData = () => {...}

// ✅ Funciones y variables: camelCase
const fetchWeatherData = async () => {...}
const isLoading = true;

// ✅ Constantes globales: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// ✅ Interfaces/Types: PascalCase con prefijo descriptivo
interface WeatherState {...}
type ButtonVariant = 'primary' | 'secondary';

// ✅ Archivos de componentes: PascalCase.tsx
// WeatherCard.tsx, UserProfile.tsx

// ✅ Archivos de utilidades/hooks: camelCase.ts
// useAuth.ts, formatDate.ts
```

### Estructura de Componentes

```tsx
// 1. Imports (externos primero, internos después)
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { WeatherData } from '@/types/weather.interface';

// 2. Tipos/Interfaces del componente
interface WeatherCardProps {
  readonly data: WeatherData;
  readonly onRefresh?: () => void;
}

// 3. Componente con export nombrado
export const WeatherCard = ({ data, onRefresh }: WeatherCardProps) => {
  // 3.1 Hooks primero
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 3.2 Handlers
  const handleToggle = () => setIsExpanded(prev => !prev);
  
  // 3.3 Efectos
  useEffect(() => {
    // ...
  }, []);
  
  // 3.4 Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

### Imports con Alias

```typescript
// ✅ CORRECTO - Usar alias @/
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/core/domain/entities/User';

// ❌ INCORRECTO - Rutas relativas profundas
import { Button } from '../../../components/ui/button';
```

### TypeScript Estricto

```typescript
// ✅ Siempre tipar parámetros y retornos de funciones públicas
const calculateDiscount = (price: number, percentage: number): number => {
  return price * (1 - percentage / 100);
};

// ✅ Usar readonly para props de componentes
interface Props {
  readonly items: ReadonlyArray<Item>;
  readonly onSelect: (id: string) => void;
}

// ✅ Evitar any - usar unknown si es necesario
const parseResponse = (data: unknown): User => {
  // Validar antes de usar
};

// ✅ Usar tipos de unión para estados finitos
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
```

---

## 🎨 DIRECTRICES DE UX/UI

### Sistema de Diseño

#### Colores (Tailwind)

```typescript
colors: {
  primary: '#1E40AF',     // Azul principal
  secondary: '#F59E0B',   // Ámbar/Naranja
  neutral: '#1F2937',     // Gris oscuro
  light: '#F3F4F6',       // Gris claro
}
```

#### Tipografía

```typescript
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui'],
  mono: ['Fira Code', 'ui-monospace']
}
```

### Principios de UX

1. **Feedback Inmediato**: Toda acción del usuario debe tener feedback visual
2. **Estados de Carga**: Usar skeletons o spinners apropiados
3. **Manejo de Errores**: Mensajes claros y accionables
4. **Accesibilidad**: WCAG 2.1 AA mínimo
5. **Responsive First**: Mobile-first, luego desktop
6. **Animaciones Sutiles**: Usar Framer Motion con moderación

### Componentes UI

```tsx
// ✅ Usar variantes con CVA (Class Variance Authority)
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ✅ Usar cn() para merge de clases
<Button className={cn(buttonVariants({ variant, size }), className)} />
```

### Patrones de Interacción

```tsx
// ✅ Estados de loading con feedback visual
{isLoading ? (
  <Skeleton className="h-40 w-full" />
) : (
  <DataDisplay data={data} />
)}

// ✅ Toast para notificaciones
toast.success('Datos guardados correctamente');
toast.error('Error al procesar la solicitud');

// ✅ Animaciones de entrada/salida
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
/>
```

---

## 🧪 ESTRATEGIA DE TESTING

### Pirámide de Tests

```
         ┌───────────────┐
         │    E2E Tests  │  ← 10% - Flujos críticos completos
         │   (Playwright) │
         ├───────────────┤
         │  Integration  │  ← 30% - Componentes + hooks + stores
         │    Tests      │
         ├───────────────┤
         │  Unit Tests   │  ← 60% - Funciones puras, utils, hooks
         │   (Vitest)    │
         └───────────────┘
```

### Configuración Base

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'cobertura'],
    },
  },
});
```

### Estructura de Tests

```
src/
├── test/                    # Mirror de src/ para tests
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   └── utils/
```

### Convenciones de Testing

#### Nomenclatura de Archivos

```
[nombreDelArchivo].test.ts   # Tests unitarios
[nombreDelArchivo].spec.ts   # Tests de integración (alternativo)
```

#### Estructura de Tests

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('NombreDelModulo', () => {
  // Setup común
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('nombreDeLaFuncion o comportamiento', () => {
    it('should [comportamiento esperado] when [condición]', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = funcionBajoTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });

    it('should throw error when [condición de error]', () => {
      // Arrange & Act & Assert
      expect(() => funcionBajoTest(null)).toThrow('Error message');
    });
  });
});
```

#### Patrones de Testing

```typescript
// ✅ Testing de Hooks
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});

// ✅ Testing de Componentes
describe('Button', () => {
  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// ✅ Testing de Stores (Zustand)
describe('weatherStore', () => {
  beforeEach(() => {
    useWeatherStore.setState(initialState);
  });

  it('should update city name', () => {
    const { setCityName } = useWeatherStore.getState();
    
    setCityName('Barcelona');
    
    expect(useWeatherStore.getState().cityName).toBe('Barcelona');
  });
});

// ✅ Mocking de servicios
vi.mock('@/services/weather', () => ({
  getWeatherData: vi.fn().mockResolvedValue(mockWeatherData),
}));
```

#### Cobertura Mínima Esperada

| Tipo | Cobertura Mínima |
|------|------------------|
| Funciones/Utils | 90% |
| Hooks | 85% |
| Services | 80% |
| Components | 80% |
| Stores | 85% |
| **Total Proyecto** | **89%** |

### Tests E2E (Futuro - Playwright)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user to login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome')).toBeVisible();
  });
});
```

---

## ⚡ GESTIÓN DE ESTADO

### Jerarquía de Estado

```
1. Estado Local (useState)        → Estado de UI local del componente
2. Estado de Servidor (TanStack)  → Datos del servidor con cache
3. Estado Global (Zustand)        → Estado compartido entre componentes
4. Estado de URL (Next.js)        → Parámetros de búsqueda, rutas
```

### Zustand Store Pattern

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface StoreState {
  // Data
  items: Item[];
  selectedId: string | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setItems: (items: Item[]) => void;
  selectItem: (id: string) => void;
  reset: () => void;
}

const initialState = {
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
};

export const useItemStore = create<StoreState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setItems: (items) => set({ items }),
      selectItem: (id) => set({ selectedId: id }),
      reset: () => set(initialState),
    }),
    { name: 'ItemStore' }
  )
);
```

### TanStack Query Pattern

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query keys centralizados
export const queryKeys = {
  weather: ['weather'] as const,
  weatherByCity: (city: string) => ['weather', city] as const,
  user: ['user'] as const,
};

// Custom hook de query
export const useWeatherQuery = (city: string) => {
  return useQuery({
    queryKey: queryKeys.weatherByCity(city),
    queryFn: () => weatherService.getByCity(city),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
};

// Custom hook de mutation
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
};
```

---

## 🔐 FORMULARIOS Y VALIDACIÓN

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema de validación
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Hook del formulario
const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});

// TSX
<form onSubmit={handleSubmit(onSubmit)}>
  <Input {...register('email')} error={errors.email?.message} />
  <Input {...register('password')} type="password" error={errors.password?.message} />
  <Button type="submit">Iniciar Sesión</Button>
</form>
```

---

## 🚀 PERFORMANCE

### Optimizaciones Obligatorias

```typescript
// ✅ Lazy loading de componentes pesados
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false,
});

// ✅ Memoización cuando sea necesario
const ExpensiveList = memo(({ items }: Props) => {
  // Solo re-renderiza si items cambia
});

// ✅ useMemo para cálculos costosos
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// ✅ useCallback para handlers pasados como props
const handleClick = useCallback((id: string) => {
  setSelected(id);
}, []);
```

### Imágenes (Next.js Image)

```tsx
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  alt="Avatar del usuario"
  width={100}
  height={100}
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

---

## 📋 CHECKLIST DE PR

Antes de hacer merge, verificar:

### Código
- [ ] TypeScript sin errores (`tsc --noEmit`)
- [ ] ESLint sin warnings (`npm run lint`)
- [ ] Código formateado consistentemente
- [ ] Sin console.log en producción
- [ ] Sin TODO/FIXME sin issue asociado

### Funcionalidad
- [ ] Feature funciona según especificación
- [ ] Manejo de errores implementado
- [ ] Estados de carga implementados
- [ ] Responsive en móvil y desktop

### Testing
- [ ] Tests unitarios para nueva l
```


## License: MIT
https://github.com/thoughtbit/web-starter/blob/da827d91103d144984423276ac8995b7b1ef6cad/react-vite-admin/src/hooks/useCounter.test.ts

```
Aquí tienes el prompt completo para la constitución del proyecto:

---

```markdown
# 📜 CONSTITUCIÓN DEL PROYECTO - Portafolio Andrés Dev

> **Versión:** 1.0.0  
> **Última actualización:** Abril 2026  
> **Nombre del Proyecto:** andr3s-o7alvaro-portafolio

---

## 🎯 PROPÓSITO Y VISIÓN

Este documento establece los principios fundamentales, directrices de desarrollo y estándares que rigen el proyecto. Todo contribuidor debe adherirse a estas normas para mantener la calidad, consistencia y mantenibilidad del código.

---

## 📦 STACK TECNOLÓGICO

### Dependencias Principales (Producción)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | ^16.0.7 | Framework de React con SSR/SSG |
| **React** | ^19.2.1 | Librería de UI |
| **TypeScript** | ^5 | Tipado estático |
| **Tailwind CSS** | ^4.1.17 | Utilidades CSS |
| **Zustand** | ^5.0.9 | Estado global |
| **TanStack Query** | ^5.90.12 | Gestión de datos del servidor |
| **Framer Motion** | ^12.23.25 | Animaciones |
| **React Hook Form** | ^7.68.0 | Formularios |
| **Zod** | ^4.1.13 | Validación de esquemas |
| **Axios** | ^1.9.0 | Cliente HTTP |

### Dependencias de Desarrollo

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Vitest** | ^4.0.15 | Framework de testing |
| **Testing Library** | ^16.3.0 | Testing de componentes React |
| **ESLint** | ^9 | Linter de código |
| **jsdom** | ^27.2.0 | DOM virtual para tests |

---

## 🏗️ ARQUITECTURA

### Estructura: Clean Architecture + Feature-Based

```
src/
├── app/                    # App Router de Next.js (páginas y layouts)
├── core/                   # 🔵 Lógica de negocio pura
│   ├── domain/             # Entidades y reglas de negocio
│   │   ├── entities/       # Modelos de dominio (User, Weather, etc.)
│   │   └── repositories/   # Interfaces de repositorios
│   ├── application/        # Casos de uso
│   │   └── usecases/       # Operaciones de negocio
│   └── infrastructure/     # Implementaciones concretas
│       ├── http/           # Cliente HTTP y configuración
│       ├── repositories/   # Implementaciones de repositorios
│       └── services/       # Servicios de infraestructura
├── components/             # 🟢 Componentes de presentación
│   ├── ui/                 # Componentes atómicos reutilizables
│   ├── layout/             # Componentes de estructura
│   └── [feature]/          # Componentes agrupados por feature
├── hooks/                  # Custom hooks globales
├── store/                  # Stores de Zustand
├── services/               # Servicios de API (transición a core/)
├── types/                  # Definiciones de TypeScript
├── utils/                  # Utilidades puras
├── helpers/                # Funciones auxiliares
├── constants/              # Constantes de la aplicación
├── schemas/                # Esquemas de validación Zod
├── providers/              # Providers de contexto
├── context/                # Contextos de React
└── test/                   # Tests unitarios y de integración
```

### Principios Arquitectónicos

1. **Inversión de Dependencias**: core/ NO depende de presentation/
2. **Entidades Inmutables**: Las entidades del dominio son objetos simples
3. **Casos de Uso Únicos**: Un caso de uso = una operación de negocio
4. **Inyección de Dependencias**: Usar interfaces para desacoplar

---

## 📝 CONVENCIONES DE CÓDIGO

### Nomenclatura

```typescript
// ✅ Componentes: PascalCase
const WeatherCard = () => {...}

// ✅ Hooks: camelCase con prefijo "use"
const useWeatherData = () => {...}

// ✅ Funciones y variables: camelCase
const fetchWeatherData = async () => {...}
const isLoading = true;

// ✅ Constantes globales: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// ✅ Interfaces/Types: PascalCase con prefijo descriptivo
interface WeatherState {...}
type ButtonVariant = 'primary' | 'secondary';

// ✅ Archivos de componentes: PascalCase.tsx
// WeatherCard.tsx, UserProfile.tsx

// ✅ Archivos de utilidades/hooks: camelCase.ts
// useAuth.ts, formatDate.ts
```

### Estructura de Componentes

```tsx
// 1. Imports (externos primero, internos después)
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { WeatherData } from '@/types/weather.interface';

// 2. Tipos/Interfaces del componente
interface WeatherCardProps {
  readonly data: WeatherData;
  readonly onRefresh?: () => void;
}

// 3. Componente con export nombrado
export const WeatherCard = ({ data, onRefresh }: WeatherCardProps) => {
  // 3.1 Hooks primero
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 3.2 Handlers
  const handleToggle = () => setIsExpanded(prev => !prev);
  
  // 3.3 Efectos
  useEffect(() => {
    // ...
  }, []);
  
  // 3.4 Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

### Imports con Alias

```typescript
// ✅ CORRECTO - Usar alias @/
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/core/domain/entities/User';

// ❌ INCORRECTO - Rutas relativas profundas
import { Button } from '../../../components/ui/button';
```

### TypeScript Estricto

```typescript
// ✅ Siempre tipar parámetros y retornos de funciones públicas
const calculateDiscount = (price: number, percentage: number): number => {
  return price * (1 - percentage / 100);
};

// ✅ Usar readonly para props de componentes
interface Props {
  readonly items: ReadonlyArray<Item>;
  readonly onSelect: (id: string) => void;
}

// ✅ Evitar any - usar unknown si es necesario
const parseResponse = (data: unknown): User => {
  // Validar antes de usar
};

// ✅ Usar tipos de unión para estados finitos
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
```

---

## 🎨 DIRECTRICES DE UX/UI

### Sistema de Diseño

#### Colores (Tailwind)

```typescript
colors: {
  primary: '#1E40AF',     // Azul principal
  secondary: '#F59E0B',   // Ámbar/Naranja
  neutral: '#1F2937',     // Gris oscuro
  light: '#F3F4F6',       // Gris claro
}
```

#### Tipografía

```typescript
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui'],
  mono: ['Fira Code', 'ui-monospace']
}
```

### Principios de UX

1. **Feedback Inmediato**: Toda acción del usuario debe tener feedback visual
2. **Estados de Carga**: Usar skeletons o spinners apropiados
3. **Manejo de Errores**: Mensajes claros y accionables
4. **Accesibilidad**: WCAG 2.1 AA mínimo
5. **Responsive First**: Mobile-first, luego desktop
6. **Animaciones Sutiles**: Usar Framer Motion con moderación

### Componentes UI

```tsx
// ✅ Usar variantes con CVA (Class Variance Authority)
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ✅ Usar cn() para merge de clases
<Button className={cn(buttonVariants({ variant, size }), className)} />
```

### Patrones de Interacción

```tsx
// ✅ Estados de loading con feedback visual
{isLoading ? (
  <Skeleton className="h-40 w-full" />
) : (
  <DataDisplay data={data} />
)}

// ✅ Toast para notificaciones
toast.success('Datos guardados correctamente');
toast.error('Error al procesar la solicitud');

// ✅ Animaciones de entrada/salida
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
/>
```

---

## 🧪 ESTRATEGIA DE TESTING

### Pirámide de Tests

```
         ┌───────────────┐
         │    E2E Tests  │  ← 10% - Flujos críticos completos
         │   (Playwright) │
         ├───────────────┤
         │  Integration  │  ← 30% - Componentes + hooks + stores
         │    Tests      │
         ├───────────────┤
         │  Unit Tests   │  ← 60% - Funciones puras, utils, hooks
         │   (Vitest)    │
         └───────────────┘
```

### Configuración Base

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'cobertura'],
    },
  },
});
```

### Estructura de Tests

```
src/
├── test/                    # Mirror de src/ para tests
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   └── utils/
```

### Convenciones de Testing

#### Nomenclatura de Archivos

```
[nombreDelArchivo].test.ts   # Tests unitarios
[nombreDelArchivo].spec.ts   # Tests de integración (alternativo)
```

#### Estructura de Tests

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('NombreDelModulo', () => {
  // Setup común
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('nombreDeLaFuncion o comportamiento', () => {
    it('should [comportamiento esperado] when [condición]', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = funcionBajoTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });

    it('should throw error when [condición de error]', () => {
      // Arrange & Act & Assert
      expect(() => funcionBajoTest(null)).toThrow('Error message');
    });
  });
});
```

#### Patrones de Testing

```typescript
// ✅ Testing de Hooks
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});

// ✅ Testing de Componentes
describe('Button', () => {
  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// ✅ Testing de Stores (Zustand)
describe('weatherStore', () => {
  beforeEach(() => {
    useWeatherStore.setState(initialState);
  });

  it('should update city name', () => {
    const { setCityName } = useWeatherStore.getState();
    
    setCityName('Barcelona');
    
    expect(useWeatherStore.getState().cityName).toBe('Barcelona');
  });
});

// ✅ Mocking de servicios
vi.mock('@/services/weather', () => ({
  getWeatherData: vi.fn().mockResolvedValue(mockWeatherData),
}));
```

#### Cobertura Mínima Esperada

| Tipo | Cobertura Mínima |
|------|------------------|
| Funciones/Utils | 90% |
| Hooks | 85% |
| Services | 80% |
| Components | 75% |
| Stores | 85% |
| **Total Proyecto** | **80%** |

### Tests E2E (Futuro - Playwright)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user to login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome')).toBeVisible();
  });
});
```

---

## ⚡ GESTIÓN DE ESTADO

### Jerarquía de Estado

```
1. Estado Local (useState)        → Estado de UI local del componente
2. Estado de Servidor (TanStack)  → Datos del servidor con cache
3. Estado Global (Zustand)        → Estado compartido entre componentes
4. Estado de URL (Next.js)        → Parámetros de búsqueda, rutas
```

### Zustand Store Pattern

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface StoreState {
  // Data
  items: Item[];
  selectedId: string | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setItems: (items: Item[]) => void;
  selectItem: (id: string) => void;
  reset: () => void;
}

const initialState = {
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
};

export const useItemStore = create<StoreState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setItems: (items) => set({ items }),
      selectItem: (id) => set({ selectedId: id }),
      reset: () => set(initialState),
    }),
    { name: 'ItemStore' }
  )
);
```

### TanStack Query Pattern

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query keys centralizados
export const queryKeys = {
  weather: ['weather'] as const,
  weatherByCity: (city: string) => ['weather', city] as const,
  user: ['user'] as const,
};

// Custom hook de query
export const useWeatherQuery = (city: string) => {
  return useQuery({
    queryKey: queryKeys.weatherByCity(city),
    queryFn: () => weatherService.getByCity(city),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
};

// Custom hook de mutation
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
};
```

---

## 🔐 FORMULARIOS Y VALIDACIÓN

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema de validación
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Hook del formulario
const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});

// TSX
<form onSubmit={handleSubmit(onSubmit)}>
  <Input {...register('email')} error={errors.email?.message} />
  <Input {...register('password')} type="password" error={errors.password?.message} />
  <Button type="submit">Iniciar Sesión</Button>
</form>
```

---

## 🚀 PERFORMANCE

### Optimizaciones Obligatorias

```typescript
// ✅ Lazy loading de componentes pesados
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false,
});

// ✅ Memoización cuando sea necesario
const ExpensiveList = memo(({ items }: Props) => {
  // Solo re-renderiza si items cambia
});

// ✅ useMemo para cálculos costosos
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// ✅ useCallback para handlers pasados como props
const handleClick = useCallback((id: string) => {
  setSelected(id);
}, []);
```

### Imágenes (Next.js Image)

```tsx
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  alt="Avatar del usuario"
  width={100}
  height={100}
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

---

## 📋 CHECKLIST DE PR

Antes de hacer merge, verificar:

### Código
- [ ] TypeScript sin errores (`tsc --noEmit`)
- [ ] ESLint sin warnings (`npm run lint`)
- [ ] Código formateado consistentemente
- [ ] Sin console.log en producción
- [ ] Sin TODO/FIXME sin issue asociado

### Funcionalidad
- [ ] Feature funciona según especificación
- [ ] Manejo de errores implementado
- [ ] Estados de carga implementados
- [ ] Responsive en móvil y desktop

### Testing
- [ ] Tests unitarios para nueva l
```

