import { CustomSearch } from "@/components/ui/CustomSearch";
import {
  AlertCircle,
  Loader2,
  Navigation,
  X,
  MoonStar,
  Sun,
} from "lucide-react";
import React, { Fragment } from "react";
import { CurrentWeatherCard } from "./CurrentWeatherCard";
import { HourlyForecastComponent } from "./HourlyForecastComponent";
import { WeatherChart } from "@/components/layout/navbar/components/WeatherChart";
import { SunTimeline } from "./SunTimeline";
import { AirQualityCard } from "./AirQualityCard";
import { ForecastCard } from "./ForecastCard";
import { useWeather } from "../hooks/useWeather";
import { APILimitWarning } from "./APILimitWarning";
import { CityResultItem } from "./CityResultItem";

export function WeatherContent() {
  const {
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

    setError,
    handleUseCurrentLocation,
    handleCitySelect,
    handleSearchChange,
  } = useWeather();

  return (
    <div className={`h-full bg-gradient-to-br ${backgroundGradient}`}>
      <div className="flex flex-col gap-4 py-6 mx-2 md:mx-8">
        <h1 className="text-4xl md:text-5xl font-bold  bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-normal">
          Tablero meteorológico
        </h1>
        <div className="flex flex-row items-center gap-2">
          <p className={`text-muted-foreground`}>
            Clima en tiempo real, pronóstico extendido y calidad del aire para{" "}
            {cityName}
          </p>
          {isNighttime ? (
            <MoonStar className={`h-6 w-6 text-muted-foreground`} />
          ) : (
            <Sun className=" h-6 w-6 text-yellow-400" />
          )}
        </div>
        <div className="mt-8 w-full">
          <CustomSearch
            onSearch={handleSearchChange}
            placeholder="Buscar ciudad"
            textExample={["Medellin", "Bogota", "Cali"]}
            disabled={isRateLimited}
            isSearching={isSearching}
            propsAnimate={{
              results: results,
              children: (result, index) => (
                <CityResultItem
                  result={result}
                  index={index}
                  onSelect={handleCitySelect}
                />
              ),
              childrenButton: (
                <button
                  onClick={handleUseCurrentLocation}
                  disabled={isLoadingLocation || isRateLimited}
                  className="absolute right-2 flex flex-row gap-1 items-center h-10 px-6.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                  data-testid="use-current-location-button"
                >
                  {isLoadingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Navigation className="h-4 w-4" />
                  )}
                  <span className="font-medium">Mi ubicación</span>
                </button>
              ),
            }}
          />
        </div>

        {isRateLimited && <APILimitWarning />}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
            <X
              className="h-5 w-5 text-destructive ml-auto cursor-pointer"
              onClick={() => setError(null)}
              data-testid="close-error-button"
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Cargando datos del clima...</p>
          </div>
        ) : weatherData && !isRateLimited ? (
          <Fragment>
            <section className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 space-y-6">
                <CurrentWeatherCard
                  weather={{
                    ...weatherData.current,
                    name: cityName,
                    country: "",
                    temp_min: weatherData.daily[0].temp.min,
                    temp_max: weatherData.daily[0].temp.max,
                  }}
                />
                <HourlyForecastComponent hourly={weatherData.hourly} />
                <WeatherChart forecast={weatherData.daily} />
              </div>

              <div className="relative space-y-8">
                <SunTimeline
                  sunrise={weatherData.current.sunrise}
                  sunset={weatherData.current.sunset}
                  currentTime={weatherData.current.dt}
                />
                {airQuality && <AirQualityCard airQuality={airQuality} />}
              </div>
            </section>
            <ForecastCard forecast={weatherData.daily} />
          </Fragment>
        ) : null}
      </div>
    </div>
  );
}
