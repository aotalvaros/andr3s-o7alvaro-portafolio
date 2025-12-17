import { useLoadingStore } from "@/store/loadingStore";
import { useThemeStore } from "@/store/themeStore";
import { useCallback, useEffect, useState } from "react";
import {
  AirQuality,
  CitySearchResult,
  OneCallWeatherData,
} from "@/types/weather.interface";
import { getWeatherGradient } from "@/utils/weather/getWeatherGradient";
import {
  getOneCallWeather,
  getAirQuality,
  getUserLocation,
  searchCities,
} from "@/services/weather";
import { useDebounce } from "@/hooks/useDebounce";
import { useDynamicIcon } from '@/hooks/useDynamicIcon';

export const useWeatherContent = () => {

  const { updateIcon, resetIcon } = useDynamicIcon();

  const setLoading = useLoadingStore((state) => state.setLoading);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [weatherData, setWeatherData] = useState<OneCallWeatherData | null>(
    null
  );
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [cityName, setCityName] = useState<string>("Medellin");
  const [query, setQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [isNighttime, setIsNighttime] = useState(false);

  useEffect(() => {
    if (weatherData) {
      const currentTime = weatherData.current.dt;
      const isNight =
        currentTime < weatherData.current.sunrise ||
        currentTime > weatherData.current.sunset;
      setIsNighttime(isNight);
      updateIcon('weather', weatherData.current.weather[0].main);
    }
    
  }, [weatherData]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsSearching(true);
      searchCities(debouncedQuery)
        .then(setResults)
        .catch(console.error)
        .finally(() => setIsSearching(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {  
      resetIcon();
    }
  },[])

  const loadWeather = async (lat: number, lon: number, city?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsRateLimited(false);

      if (city) setCityName(city);

      const [weather, air] = await Promise.all([
        getOneCallWeather(lat, lon),
        getAirQuality(lat, lon).catch(() => null),
      ]);

      setWeatherData(weather);
      setAirQuality(air);
    } catch (err) {
      if (err instanceof Error && err.message === "RATE_LIMIT_EXCEEDED") {
        setIsRateLimited(true);
        setError(null);
      } else {
        setError("No se pudo cargar el clima. Intenta de nuevo.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { lat, lon } = await getUserLocation();
      await loadWeather(lat, lon, "Tu ubicación");
    } catch (err) {
      console.log("🚀 ~ handleUseCurrentLocation ~ err:", err);
      setError("No se pudo obtener tu ubicación. Por favor permite el acceso.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    loadWeather(6.251, -75.5636, "Medellin");
  }, []);

  const backgroundGradient = weatherData
    ? getWeatherGradient(
        weatherData.current.weather[0].main,
        weatherData.current.dt > weatherData.current.sunrise &&
          weatherData.current.dt < weatherData.current.sunset,
        isDarkMode
      )
    : "from-blue-200 via-cyan-100 to-blue-100";

  const handleCitySelect = useCallback((result: CitySearchResult) => {
    const cityName = result.state
      ? `${result.name}, ${result.state}, ${result.country}`
      : `${result.name}, ${result.country}`;
    loadWeather(result.lat, result.lon, cityName);
    setResults([]);
  }, []);

  const handleSearchChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return {
    weatherData,
    airQuality,
    error,
    backgroundGradient,
    cityName,
    isLoadingLocation,
    isRateLimited,
    results,
    isSearching,
    isLoading,
    isNighttime,

    handleSearchChange,
    setError,
    handleUseCurrentLocation,
    handleCitySelect,
  };
};
