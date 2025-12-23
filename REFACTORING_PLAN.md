# 🏗️ PLAN DE REFACTORIZACIÓN - ARQUITECTURA LIMPIA

## 📊 CALIFICACIÓN ACTUAL: 6.5/10

### Desglose:
- ✅ Configuración y Tooling: 9/10
- ⚠️ Arquitectura: 4/10
- ⚠️ Separación de Responsabilidades: 5/10
- ⚠️ Escalabilidad: 5/10
- ⚠️ Mantenibilidad: 6/10
- ✅ Testing Setup: 8/10 (pero mal usado)
- ⚠️ Performance: 6/10

---

## 🎯 OBJETIVO: 9/10

## 📐 NUEVA ARQUITECTURA PROPUESTA

```
src/
├── core/                          # ⭐ NUEVO - Lógica de negocio pura
│   ├── domain/                    # Entidades y reglas de negocio
│   │   ├── entities/
│   │   │   ├── User.ts
│   │   │   ├── Weather.ts
│   │   │   └── Pokemon.ts
│   │   ├── value-objects/
│   │   │   ├── Email.ts
│   │   │   ├── Coordinates.ts
│   │   │   └── Temperature.ts
│   │   └── errors/
│   │       ├── DomainError.ts
│   │       ├── ValidationError.ts
│   │       └── NetworkError.ts
│   │
│   ├── application/               # Casos de uso
│   │   ├── use-cases/
│   │   │   ├── auth/
│   │   │   │   ├── LoginUseCase.ts
│   │   │   │   ├── LogoutUseCase.ts
│   │   │   │   └── RefreshTokenUseCase.ts
│   │   │   ├── weather/
│   │   │   │   ├── GetWeatherUseCase.ts
│   │   │   │   ├── SearchCitiesUseCase.ts
│   │   │   │   └── GetUserLocationUseCase.ts
│   │   │   └── pokemon/
│   │   │       ├── GetPokemonListUseCase.ts
│   │   │       └── GetPokemonDetailsUseCase.ts
│   │   │
│   │   └── ports/                 # Interfaces (Dependency Inversion)
│   │       ├── IAuthRepository.ts
│   │       ├── IWeatherRepository.ts
│   │       ├── IPokemonRepository.ts
│   │       ├── IStorageService.ts
│   │       └── INotificationService.ts
│   │
│   └── infrastructure/            # Implementaciones concretas
│       ├── repositories/
│       │   ├── AuthRepository.ts
│       │   ├── WeatherRepository.ts
│       │   └── PokemonRepository.ts
│       ├── http/
│       │   ├── HttpClient.ts      # Abstracción de axios
│       │   ├── interceptors/
│       │   │   ├── AuthInterceptor.ts
│       │   │   ├── LoadingInterceptor.ts
│       │   │   └── ErrorInterceptor.ts
│       │   └── config/
│       │       └── apiConfig.ts
│       ├── storage/
│       │   ├── LocalStorageService.ts
│       │   └── CookieStorageService.ts
│       └── notifications/
│           └── ToastNotificationService.ts
│
├── presentation/                  # ⭐ RENOMBRAR de components/
│   ├── components/                # Componentes UI puros
│   │   ├── atoms/                 # Componentes básicos
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── Card/
│   │   ├── molecules/             # Combinaciones simples
│   │   │   ├── SearchBar/
│   │   │   ├── WeatherCard/
│   │   │   └── PokemonCard/
│   │   └── organisms/             # Componentes complejos
│   │       ├── Navbar/
│   │       ├── ContactForm/
│   │       └── WeatherDashboard/
│   │
│   ├── features/                  # ⭐ NUEVO - Features completos
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── store/
│   │   │   └── index.ts
│   │   ├── weather/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── store/
│   │   │   └── index.ts
│   │   └── pokemon/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── store/
│   │       └── index.ts
│   │
│   ├── hooks/                     # Hooks compartidos
│   │   ├── useDebounce.ts
│   │   ├── useIsMobile.ts
│   │   └── useScrollDirection.ts
│   │
│   └── layouts/
│       ├── MainLayout.tsx
│       ├── DashboardLayout.tsx
│       └── AuthLayout.tsx
│
├── shared/                        # ⭐ NUEVO - Código compartido
│   ├── constants/
│   ├── utils/
│   ├── types/
│   └── config/
│
└── app/                           # Next.js App Router (sin cambios)
```

---

## 🔧 REFACTORIZACIONES ESPECÍFICAS

### 1. **REFACTOR: axios.ts → HttpClient + Interceptors**

**Problema:** 300+ líneas, hace TODO

**Solución:**
```typescript
// core/infrastructure/http/HttpClient.ts
export class HttpClient {
  constructor(
    private config: HttpConfig,
    private interceptors: Interceptor[]
  ) {}
  
  async get<T>(url: string, config?: RequestConfig): Promise<T>
  async post<T>(url: string, data: unknown, config?: RequestConfig): Promise<T>
  // ...
}

// core/infrastructure/http/interceptors/AuthInterceptor.ts
export class AuthInterceptor implements Interceptor {
  async onRequest(config: RequestConfig): Promise<RequestConfig>
  async onResponseError(error: HttpError): Promise<never>
}

// core/infrastructure/http/interceptors/LoadingInterceptor.ts
export class LoadingInterceptor implements Interceptor {
  constructor(private loadingService: ILoadingService) {}
  
  async onRequest(config: RequestConfig): Promise<RequestConfig> {
    if (config.showLoading !== false) {
      this.loadingService.start();
    }
    return config;
  }
  
  async onResponse(response: Response): Promise<Response> {
    this.loadingService.stop();
    return response;
  }
}
```

**Beneficios:**
- ✅ Single Responsibility
- ✅ Open/Closed (agregar interceptors sin modificar HttpClient)
- ✅ Testeable
- ✅ Reutilizable

---

### 2. **REFACTOR: useWeatherContent → Feature Module**

**Problema:** 150+ líneas, 11 estados, múltiples responsabilidades

**Solución:**
```typescript
// presentation/features/weather/hooks/useWeather.ts
export function useWeather() {
  const weatherQuery = useWeatherQuery();
  const searchCities = useSearchCities();
  const userLocation = useUserLocation();
  
  return {
    ...weatherQuery,
    ...searchCities,
    ...userLocation
  };
}

// presentation/features/weather/hooks/useWeatherQuery.ts
export function useWeatherQuery() {
  const getWeatherUseCase = useGetWeatherUseCase();
  
  return useQuery({
    queryKey: ['weather', coords],
    queryFn: () => getWeatherUseCase.execute(coords)
  });
}

// presentation/features/weather/store/weatherStore.ts
interface WeatherState {
  selectedCity: string;
  isNighttime: boolean;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  selectedCity: 'Medellin',
  isNighttime: false,
  setSelectedCity: (city) => set({ selectedCity: city }),
  setIsNighttime: (value) => set({ isNighttime: value })
}));
```

**Beneficios:**
- ✅ Separación de responsabilidades
- ✅ Hooks pequeños y testeables
- ✅ Estado predecible
- ✅ Fácil de mantener

---

### 3. **REFACTOR: Services → Repositories + Use Cases**

**Problema:** Services que no abstraen nada

**Solución:**
```typescript
// core/application/ports/IWeatherRepository.ts
export interface IWeatherRepository {
  getWeather(coords: Coordinates): Promise<Weather>;
  searchCities(query: string): Promise<City[]>;
  getAirQuality(coords: Coordinates): Promise<AirQuality>;
}

// core/infrastructure/repositories/WeatherRepository.ts
export class WeatherRepository implements IWeatherRepository {
  constructor(private httpClient: HttpClient) {}
  
  async getWeather(coords: Coordinates): Promise<Weather> {
    const response = await this.httpClient.get<WeatherDTO>(
      '/weather/onecall',
      { params: { lat: coords.lat, lon: coords.lon } }
    );
    
    return WeatherMapper.toDomain(response);
  }
}

// core/application/use-cases/weather/GetWeatherUseCase.ts
export class GetWeatherUseCase {
  constructor(
    private weatherRepository: IWeatherRepository,
    private notificationService: INotificationService
  ) {}
  
  async execute(coords: Coordinates): Promise<Weather> {
    try {
      return await this.weatherRepository.getWeather(coords);
    } catch (error) {
      if (error instanceof RateLimitError) {
        this.notificationService.warning('Límite de API alcanzado');
      }
      throw error;
    }
  }
}
```

**Beneficios:**
- ✅ Dependency Inversion
- ✅ Testeable con mocks
- ✅ Lógica de negocio centralizada
- ✅ Fácil cambiar implementaciones

---

### 4. **REFACTOR: Manejo de Estado**

**Problema:** 11 estados locales en un hook

**Solución:**
```typescript
// presentation/features/weather/store/weatherStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface WeatherState {
  // Data
  weather: Weather | null;
  airQuality: AirQuality | null;
  searchResults: City[];
  
  // UI State
  selectedCity: string;
  isNighttime: boolean;
  
  // Loading States
  isLoading: boolean;
  isSearching: boolean;
  isLoadingLocation: boolean;
  
  // Error States
  error: string | null;
  isRateLimited: boolean;
  
  // Actions
  setWeather: (weather: Weather) => void;
  setAirQuality: (airQuality: AirQuality) => void;
  setSearchResults: (results: City[]) => void;
  setSelectedCity: (city: string) => void;
  setIsNighttime: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useWeatherStore = create<WeatherState>()(
  devtools(
    (set) => ({
      // Initial state
      weather: null,
      airQuality: null,
      searchResults: [],
      selectedCity: 'Medellin',
      isNighttime: false,
      isLoading: false,
      isSearching: false,
      isLoadingLocation: false,
      error: null,
      isRateLimited: false,
      
      // Actions
      setWeather: (weather) => set({ weather }),
      setAirQuality: (airQuality) => set({ airQuality }),
      setSearchResults: (results) => set({ searchResults: results }),
      setSelectedCity: (city) => set({ selectedCity: city }),
      setIsNighttime: (value) => set({ isNighttime: value }),
      setLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),
      reset: () => set({
        weather: null,
        airQuality: null,
        searchResults: [],
        error: null,
        isRateLimited: false
      })
    }),
    { name: 'WeatherStore' }
  )
);
```

---

### 5. **REFACTOR: Error Handling**

**Problema:** Manejo de errores inconsistente

**Solución:**
```typescript
// core/domain/errors/DomainError.ts
export abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class NetworkError extends DomainError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', 500);
  }
}

export class RateLimitError extends DomainError {
  constructor() {
    super('Rate limit exceeded', 'RATE_LIMIT_ERROR', 429);
  }
}

// core/infrastructure/http/interceptors/ErrorInterceptor.ts
export class ErrorInterceptor implements Interceptor {
  async onResponseError(error: AxiosError): Promise<never> {
    if (error.response?.status === 429) {
      throw new RateLimitError();
    }
    
    if (error.code === 'ERR_NETWORK') {
      throw new NetworkError('No se pudo conectar con el servidor');
    }
    
    throw new NetworkError(error.message);
  }
}
```

---

### 6. **REFACTOR: Dependency Injection**

**Problema:** Dependencias hardcodeadas

**Solución:**
```typescript
// core/di/container.ts
import { Container } from 'inversify';

const container = new Container();

// Repositories
container.bind<IWeatherRepository>('IWeatherRepository').to(WeatherRepository);
container.bind<IAuthRepository>('IAuthRepository').to(AuthRepository);

// Use Cases
container.bind<GetWeatherUseCase>('GetWeatherUseCase').to(GetWeatherUseCase);
container.bind<LoginUseCase>('LoginUseCase').to(LoginUseCase);

// Services
container.bind<INotificationService>('INotificationService').to(ToastNotificationService);
container.bind<IStorageService>('IStorageService').to(LocalStorageService);

export { container };

// presentation/features/weather/hooks/useWeatherUseCase.ts
export function useGetWeatherUseCase() {
  return useMemo(
    () => container.get<GetWeatherUseCase>('GetWeatherUseCase'),
    []
  );
}
```

---

## 📋 CHECKLIST DE REFACTORIZACIÓN

### Fase 1: Fundamentos (Semana 1)
- [ ] Crear estructura de carpetas nueva
- [ ] Implementar HttpClient
- [ ] Implementar Interceptors
- [ ] Migrar tipos a /shared/types
- [ ] Crear entidades de dominio

### Fase 2: Infraestructura (Semana 2)
- [ ] Implementar Repositories
- [ ] Implementar Use Cases
- [ ] Configurar Dependency Injection
- [ ] Migrar servicios a repositorios

### Fase 3: Presentación (Semana 3)
- [ ] Refactorizar hooks
- [ ] Separar features en módulos
- [ ] Optimizar stores
- [ ] Implementar atomic design

### Fase 4: Testing (Semana 4)
- [ ] Tests unitarios de Use Cases
- [ ] Tests de Repositories
- [ ] Tests de componentes
- [ ] Tests de integración

### Fase 5: Optimización (Semana 5)
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Memoization
- [ ] Performance profiling

---

## 🎯 MÉTRICAS DE ÉXITO

### Antes:
- Complejidad ciclomática: 15-20
- Acoplamiento: Alto
- Cohesión: Baja
- Testabilidad: 4/10
- Mantenibilidad: 5/10

### Después:
- Complejidad ciclomática: 5-8
- Acoplamiento: Bajo
- Cohesión: Alta
- Testabilidad: 9/10
- Mantenibilidad: 9/10

---

## 🚀 BENEFICIOS ESPERADOS

1. **Escalabilidad**: Agregar features sin tocar código existente
2. **Testabilidad**: Tests unitarios simples y rápidos
3. **Mantenibilidad**: Cambios localizados, sin efectos secundarios
4. **Performance**: Menos re-renders, mejor code splitting
5. **Developer Experience**: Código más fácil de entender y modificar

---

## 📚 RECURSOS

- Clean Architecture (Robert C. Martin)
- Domain-Driven Design (Eric Evans)
- SOLID Principles
- Hexagonal Architecture
- Feature-Sliced Design

