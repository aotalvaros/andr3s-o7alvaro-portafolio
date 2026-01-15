import { useEffect } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import { searchCities } from '@/services/weather';
import { useDebounce } from '@/hooks/useDebounce';

export function useCitySearch() {
  const { query, setQuery, setSearchResults, setIsSearching } = useWeatherStore();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsSearching(true);
      searchCities(debouncedQuery)
        .then(setSearchResults)
        .catch(console.error)
        .finally(() => setIsSearching(false));
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, setSearchResults, setIsSearching]);

  return { query, setQuery };
}


/*
  El hook useCitySearch gestiona la lógica de búsqueda de ciudades en la aplicación meteorológica.
  Utiliza un valor de consulta con debounce para minimizar las llamadas a la API mientras el usuario escribe.
  Cuando la consulta tiene al menos 2 caracteres, realiza una búsqueda de ciudades y actualiza los resultados
  en el estado global mediante useWeatherStore.

  Funciones clave:
  - useDebounce: Retrasa la actualización de la consulta para optimizar el rendimiento.
  - searchCities: Llama a la API para buscar ciudades basadas en la consulta proporcionada.
  - useEffect: Observa los cambios en la consulta con debounce y maneja la lógica de búsqueda.

*/