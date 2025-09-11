export type Season = 'halloween' | 'christmas' | 'valentine' | 'easter' | 'default';

export interface SeasonalTheme {
  id: Season;
  name: string;
  period: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  assets: {
    headerLogo: string;
    footerLogo: string;
    backgroundImage: string;
    heroImage: string;
  };
  styles: {
    className: string;
    fontFamily?: string;
  };
}

export const SEASONAL_THEMES: SeasonalTheme[] = [
  {
    id: 'halloween',
    name: 'Halloween',
    period: {
      start: { month: 10, day: 1 },
      end: { month: 11, day: 2 },
    },
    colors: {
      primary: '#FF6B35',
      secondary: '#6B46C1',
      accent: '#F59E0B',
      background: '#1F2937',
    },
    assets: {
      headerLogo: '/assets/halloween/logo-halloween.svg',
      footerLogo: '/assets/halloween/footer-logo-halloween.svg',
      backgroundImage: '/assets/halloween/background-halloween.jpg',
      heroImage: '/assets/halloween/hero-halloween.jpg',
    },
    styles: {
      className: 'theme-halloween',
      fontFamily: 'Creepster, cursive',
    },
  },
  {
    id: 'christmas',
    name: 'Christmas',
    period: {
      start: { month: 12, day: 1 },
      end: { month: 12, day: 31 },
    },
    colors: {
      primary: '#DC2626',
      secondary: '#059669',
      accent: '#D97706',
      background: '#F9FAFB',
    },
    assets: {
      headerLogo: '/assets/christmas/logo-christmas.svg',
      footerLogo: '/assets/christmas/footer-logo-christmas.svg',
      backgroundImage: '/assets/christmas/background-christmas.jpg',
      heroImage: '/assets/christmas/hero-christmas.jpg',
    },
    styles: {
      className: 'theme-christmas',
      fontFamily: 'Mountains of Christmas, cursive',
    },
  },
  {
    id: 'valentine',
    name: "Valentine's Day",
    period: {
      start: { month: 2, day: 1 },
      end: { month: 2, day: 18 },
    },
    colors: {
      primary: '#EC4899',
      secondary: '#DC2626',
      accent: '#7C3AED',
      background: '#FFFFFF',
    },
    assets: {
      headerLogo: '/assets/valentine/logo-valentine.svg',
      footerLogo: '/assets/valentine/footer-logo-valentine.svg',
      backgroundImage: '/assets/valentine/background-valentine.jpg',
      heroImage: '/assets/valentine/hero-valentine.jpg',
    },
    styles: {
      className: 'theme-valentine',
      fontFamily: 'Dancing Script, cursive',
    },
  },
  {
    id: 'easter',
    name: 'Easter',
    period: {
      start: { month: 3, day: 15 },
      end: { month: 4, day: 15 },
    },
    colors: {
      primary: '#F9A8D4',
      secondary: '#93C5FD',
      accent: '#FDE68A',
      background: '#F9FAFB',
    },
    assets: {
      headerLogo: '/assets/easter/logo-easter.svg',
      footerLogo: '/assets/easter/footer-logo-easter.svg',
      backgroundImage: '/assets/easter/background-easter.jpg',
      heroImage: '/assets/easter/hero-easter.jpg',
    },
    styles: {
      className: 'theme-easter',
      fontFamily: 'Quicksand, sans-serif',
    },
  },
  {
    id: 'default',
    name: 'Default',
    period: {
      start: { month: 1, day: 1 },
      end: { month: 12, day: 31 },
    },
    colors: {
      primary: '#000000',
      secondary: '#6B7280',
      accent: '#3B82F6',
      background: '#FFFFFF',
    },
    assets: {
      headerLogo: '/assets/default/logo.svg',
      footerLogo: '/assets/default/footer-logo.svg',
      backgroundImage: '/assets/default/background.jpg',
      heroImage: '/assets/default/hero.jpg',
    },
    styles: {
      className: 'theme-default',
    },
  },
];

export function getCurrentSeason(): Season {
  const now = new Date();
  const month = now.getMonth() + 1; // JavaScript months are 0-indexed
  const day = now.getDate();

  for (const theme of SEASONAL_THEMES) {
    if (theme.id === 'default') continue;
    
    const { start, end } = theme.period;
    
    // Handle year-crossing periods (like Christmas)
    if (start.month > end.month) {
      if (
        (month > start.month || (month === start.month && day >= start.day)) ||
        (month < end.month || (month === end.month && day <= end.day))
      ) {
        return theme.id;
      }
    } else {
      // Same year period
      if (
        (month > start.month || (month === start.month && day >= start.day)) &&
        (month < end.month || (month === end.month && day <= end.day))
      ) {
        return theme.id;
      }
    }
  }

  return 'default';
}

export function getSeasonalTheme(season?: Season): SeasonalTheme {
  const targetSeason = season || getCurrentSeason();
  return SEASONAL_THEMES.find(theme => theme.id === targetSeason) || SEASONAL_THEMES.find(theme => theme.id === 'default')!;
}

export function getSeasonalAssets(season?: Season) {
  const theme = getSeasonalTheme(season);
  return theme.assets;
}

export function getSeasonalColors(season?: Season) {
  const theme = getSeasonalTheme(season);
  return theme.colors;
}

export function getSeasonalStyles(season?: Season) {
  const theme = getSeasonalTheme(season);
  return theme.styles;
}