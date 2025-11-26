type WeatherType =
  | "Clear"
  | "Clouds"
  | "Rain"
  | "Drizzle"
  | "Thunderstorm"
  | "Snow"
  | "Mist"
  | "Fog"
  | "Haze";

const gradients: Record<
  WeatherType,
  { day: string; night: string; dark: string }
> = {
  Clear: {
    //Despejado
    day: "from-sky-200 via-sky-100 to-blue-50",
    night: "from-indigo-600 via-blue-700 to-indigo-500",
    dark: "from-indigo-950 via-indigo-900 to-blue-900",
  },
  Clouds: {
    //Nublado
    day: "from-gray-200 via-gray-100 to-slate-50",
    night: "from-slate-300 via-slate-100 to-gray-300",
    dark: "from-slate-800 via-slate-700 to-gray-700",
  },
  Rain: {
    //Lluvia
    day: "from-slate-400 via-slate-300 to-gray-200",
    night: "from-blue-700 via-blue-600 to-slate-600",
    dark: "from-slate-800 via-slate-700 to-slate-600",
  },
  Drizzle: {
    //Llovizna
    day: "from-slate-300 via-gray-200 to-gray-100",
    night: "from-slate-600 via-blue-700 to-slate-500",
    dark: "from-slate-700 via-slate-600 to-gray-500",
  },
  Thunderstorm: {
    //Tormenta
    day: "from-slate-600 via-slate-500 to-gray-400",
    night: "from-purple-800 via-indigo-700 to-purple-700",
    dark: "from-indigo-950 via-slate-900 to-gray-700",
  },
  Snow: {
    //Nieve
    day: "from-blue-50 via-white to-slate-100",
    night: "from-blue-400 via-blue-300 to-slate-400",
    dark: "from-slate-300 via-slate-200 to-blue-200",
  },
  Mist: {
    //Niebla
    day: "from-gray-200 via-gray-100 to-white",
    night: "from-gray-500 via-gray-400 to-slate-500",
    dark: "from-gray-500 via-gray-400 to-gray-300",
  },
  Fog: {
    //Niebla espesa
    day: "from-gray-200 via-gray-100 to-white",
    night: "from-gray-500 via-gray-400 to-slate-500",
    dark: "from-gray-500 via-gray-400 to-gray-300",
  },
  Haze: {
    //Calina
    day: "from-amber-100 via-yellow-50 to-gray-100",
    night: "from-orange-700 via-amber-600 to-gray-600",
    dark: "from-amber-700 via-amber-600 to-gray-500",
  },
};

export function getWeatherGradient(
  weatherMain: string,
  isDaytime: boolean,
  isDarkMode: boolean = false
): string {
  const time = isDaytime ? "day" : "night";
  const mode = isDarkMode ? "dark" : time;

  const normalized = (weatherMain ?? "").trim();

  return gradients[normalized as WeatherType]?.[mode] || gradients.Clear[mode];
}
