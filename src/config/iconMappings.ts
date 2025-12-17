import { IconMapping, IconContext } from '@/types/dynamicIcon.interface';

export const ICON_MAPPINGS: Record<IconContext, IconMapping> = {
  weather: {
    clear: {
      src: '/assets/climateScenario/sunny.png',
      alt: 'Clima soleado',
      fallbackSrc: '/assets/iconoBlackAndWhite.png'
    },
    clouds: {
      src: '/assets/climateScenario/fox_cloud.png',
      alt: 'Clima nublado',
      fallbackSrc: '/assets/iconoBlackAndWhite.png'
    },
    rain: {
      src: '/assets/climateScenario/fox_rain.png',
      alt: 'Clima lluvioso',
      fallbackSrc: '/assets/iconoBlackAndWhite.png'
    },
    snow: {
      src: '/assets/climateScenario/fox_snow.png',
      alt: 'Clima nevado',
      fallbackSrc: '/assets/iconoBlackAndWhite.png'
    },
    drizzle: {
      src: '/assets/climateScenario/fox_drizzle.png',
      alt: 'Clima llovizna',
      fallbackSrc: '/assets/iconoBlackAndWhite.png'
    },
    thunderstorm: {
      src: '/assets/climateScenario/fox_thunderstorm.png',
      alt: 'Clima tormentoso',
      fallbackSrc: '/assets/iconoBlackAndWhite.png'
    },
    mist:{
      src: '/assets/climateScenario/fox_mist.png',
      alt: 'Clima con niebla',
      fallbackSrc: '/assets/iconoBlackAndWhite.png'
    },
    fog:{
      src: '/assets/climateScenario/fox_fog.png',
      alt: 'Clima con neblina',
      fallbackSrc: '/assets/iconoBlackAndWhite.png'
    },
    haze:{
      src: '/assets/climateScenario/fox_haze.png',
      alt: 'Clima brumoso',
      fallbackSrc: '/assets/iconoBlackAndWhite.png'
    }
  }
};

export const DEFAULT_ICON = {
  src: '/assets/iconoBlackAndWhite.png',
  alt: 'Background Pattern',
  fallbackSrc: '/assets/imageNoFound.png'
};