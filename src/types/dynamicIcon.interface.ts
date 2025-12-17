export interface IconConfig {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export interface IconMapping {
  [key: string]: IconConfig;
}

//Todo: Agregar más contextos si es necesario, por ejemplo: 'mood', 'activity', etc. en el momento solo 'weather'
export type IconContext = 'weather' 

export interface DynamicIconState {
  currentIcon: IconConfig;
  context: IconContext;
  state: string;
  isLoading: boolean;
  error: string | null;
}

export interface DynamicIconActions {
  setIcon: (context: IconContext, state: string) => void;
  setCustomIcon: (icon: IconConfig) => void;
  resetToDefault: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type DynamicIconStore = DynamicIconState & DynamicIconActions;