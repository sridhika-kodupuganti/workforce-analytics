import { createTheme, alpha } from '@mui/material/styles';

export type ColorPreset = 'royal' | 'emerald' | 'sapphire' | 'rose' | 'amber';

export interface ThemePresetDetails {
  id: ColorPreset;
  name: string;
  tagline: string;
  previewPrimary: string;
  previewSecondary: string;
  light: {
    primary: { main: string; light: string; dark: string; contrastText: string };
    secondary: { main: string; light: string; dark: string; contrastText: string };
    background: { default: string; paper: string };
    text: { primary: string; secondary: string };
    divider: string;
    gradient: string;
  };
  dark: {
    primary: { main: string; light: string; dark: string; contrastText: string };
    secondary: { main: string; light: string; dark: string; contrastText: string };
    background: { default: string; paper: string };
    text: { primary: string; secondary: string };
    divider: string;
    gradient: string;
  };
}

export const THEME_PRESETS: Record<ColorPreset, ThemePresetDetails> = {
  royal: {
    id: 'royal',
    name: 'Royal Iris & Cyan',
    tagline: 'Modern Tech & Executive Telemetry',
    previewPrimary: '#6366F1',
    previewSecondary: '#06B6D4',
    light: {
      primary: {
        main: '#4F46E5', // Royal Indigo
        light: '#6366F1',
        dark: '#3730A3',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#0891B2', // Electric Cyan
        light: '#06B6D4',
        dark: '#0E7490',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F6F8FC', // Crisp porcelain slate
        paper: '#FFFFFF',
      },
      text: {
        primary: '#0B132B',
        secondary: '#5B6B84',
      },
      divider: 'rgba(15, 23, 42, 0.08)',
      gradient: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #06B6D4 100%)',
    },
    dark: {
      primary: {
        main: '#818CF8', // Luminous Iris
        light: '#A5B4FC',
        dark: '#6366F1',
        contrastText: '#090D16',
      },
      secondary: {
        main: '#22D3EE', // Luminous Aqua Cyan
        light: '#67E8F9',
        dark: '#06B6D4',
        contrastText: '#090D16',
      },
      background: {
        default: '#090D16', // Deep Obsidian Slate
        paper: '#111726', // Elevated Obsidian
      },
      text: {
        primary: '#F8FAFC',
        secondary: '#94A3B8',
      },
      divider: 'rgba(255, 255, 255, 0.08)',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #818CF8 50%, #22D3EE 100%)',
    },
  },

  emerald: {
    id: 'emerald',
    name: 'Emerald Luxe & Gold',
    tagline: 'Prestigious Executive Management',
    previewPrimary: '#10B981',
    previewSecondary: '#F59E0B',
    light: {
      primary: {
        main: '#059669', // Emerald
        light: '#10B981',
        dark: '#047857',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#D97706', // Champagne Gold
        light: '#F59E0B',
        dark: '#B45309',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F4F8F6',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#062E24',
        secondary: '#4B6358',
      },
      divider: 'rgba(5, 150, 105, 0.1)',
      gradient: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #D97706 100%)',
    },
    dark: {
      primary: {
        main: '#34D399',
        light: '#6EE7B7',
        dark: '#10B981',
        contrastText: '#062018',
      },
      secondary: {
        main: '#FBBF24',
        light: '#FCD34D',
        dark: '#F59E0B',
        contrastText: '#2B1A00',
      },
      background: {
        default: '#071510',
        paper: '#0E231C',
      },
      text: {
        primary: '#ECFDF5',
        secondary: '#8BB8A4',
      },
      divider: 'rgba(52, 211, 153, 0.12)',
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #FBBF24 100%)',
    },
  },

  sapphire: {
    id: 'sapphire',
    name: 'Ocean Sapphire & Azure',
    tagline: 'Clean Corporate Analytics',
    previewPrimary: '#3B82F6',
    previewSecondary: '#38BDF8',
    light: {
      primary: {
        main: '#1D4ED8', // Deep Royal Blue
        light: '#3B82F6',
        dark: '#1E40AF',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#0284C7', // Vivid Azure
        light: '#38BDF8',
        dark: '#0369A1',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F5F8FC',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#0C1E3E',
        secondary: '#526685',
      },
      divider: 'rgba(29, 78, 216, 0.08)',
      gradient: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #0284C7 100%)',
    },
    dark: {
      primary: {
        main: '#60A5FA',
        light: '#93C5FD',
        dark: '#3B82F6',
        contrastText: '#061224',
      },
      secondary: {
        main: '#38BDF8',
        light: '#7DD3FC',
        dark: '#0EA5E9',
        contrastText: '#061224',
      },
      background: {
        default: '#07101E',
        paper: '#0D1D35',
      },
      text: {
        primary: '#EFF6FF',
        secondary: '#8DA4C4',
      },
      divider: 'rgba(96, 165, 250, 0.12)',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #38BDF8 100%)',
    },
  },

  rose: {
    id: 'rose',
    name: 'Crimson Velvet & Orchid',
    tagline: 'Striking Luxury & Modern Edge',
    previewPrimary: '#F43F5E',
    previewSecondary: '#8B5CF6',
    light: {
      primary: {
        main: '#BE123C', // Deep Rose
        light: '#E11D48',
        dark: '#9F1239',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#7C3AED', // Electric Purple
        light: '#8B5CF6',
        dark: '#6D28D9',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#FFF6F8',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#280813',
        secondary: '#6E4957',
      },
      divider: 'rgba(190, 18, 60, 0.08)',
      gradient: 'linear-gradient(135deg, #BE123C 0%, #E11D48 50%, #7C3AED 100%)',
    },
    dark: {
      primary: {
        main: '#FB7185',
        light: '#FDA4AF',
        dark: '#F43F5E',
        contrastText: '#1D050E',
      },
      secondary: {
        main: '#C084FC',
        light: '#D8B4FE',
        dark: '#A855F7',
        contrastText: '#1D050E',
      },
      background: {
        default: '#140910',
        paper: '#22111D',
      },
      text: {
        primary: '#FFF1F2',
        secondary: '#BD93A5',
      },
      divider: 'rgba(251, 113, 133, 0.12)',
      gradient: 'linear-gradient(135deg, #F43F5E 0%, #FB7185 50%, #C084FC 100%)',
    },
  },

  amber: {
    id: 'amber',
    name: 'Sunset Amber & Coral',
    tagline: 'Warm Radiance & Engaging Energy',
    previewPrimary: '#F59E0B',
    previewSecondary: '#F97316',
    light: {
      primary: {
        main: '#D97706', // Amber
        light: '#F59E0B',
        dark: '#B45309',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#EA580C', // Coral Orange
        light: '#F97316',
        dark: '#C2410C',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#FFFBF5',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#271406',
        secondary: '#6E5642',
      },
      divider: 'rgba(217, 119, 6, 0.08)',
      gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #EA580C 100%)',
    },
    dark: {
      primary: {
        main: '#FBBF24',
        light: '#FDE68A',
        dark: '#F59E0B',
        contrastText: '#221200',
      },
      secondary: {
        main: '#FB923C',
        light: '#FDBA74',
        dark: '#EA580C',
        contrastText: '#221200',
      },
      background: {
        default: '#150F07',
        paper: '#231A0F',
      },
      text: {
        primary: '#FEF3C7',
        secondary: '#BDAA93',
      },
      divider: 'rgba(251, 191, 36, 0.12)',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FB923C 100%)',
    },
  },
};

export const getAppTheme = (mode: 'light' | 'dark', presetName: ColorPreset = 'royal') => {
  const isDark = mode === 'dark';
  const preset = THEME_PRESETS[presetName] || THEME_PRESETS.royal;
  const p = isDark ? preset.dark : preset.light;

  return createTheme({
    palette: {
      mode,
      primary: p.primary,
      secondary: p.secondary,
      success: {
        main: isDark ? '#34D399' : '#059669', // Emerald
        light: isDark ? '#6EE7B7' : '#10B981',
        dark: isDark ? '#047857' : '#065F46',
        contrastText: '#FFFFFF',
      },
      warning: {
        main: isDark ? '#FBBF24' : '#D97706', // Amber
        light: isDark ? '#FCD34D' : '#F59E0B',
        dark: isDark ? '#B45309' : '#92400E',
        contrastText: '#FFFFFF',
      },
      error: {
        main: isDark ? '#FB7185' : '#E11D48', // Coral Crimson
        light: isDark ? '#FDA4AF' : '#F43F5E',
        dark: isDark ? '#BE123C' : '#9F1239',
        contrastText: '#FFFFFF',
      },
      info: {
        main: isDark ? '#38BDF8' : '#0284C7', // Sky
        light: isDark ? '#7DD3FC' : '#38BDF8',
        dark: isDark ? '#0369A1' : '#075985',
        contrastText: '#FFFFFF',
      },
      background: {
        default: p.background.default,
        paper: p.background.paper,
      },
      text: p.text,
      divider: p.divider,
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.03em' },
      h2: { fontWeight: 800, letterSpacing: '-0.025em' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.015em' },
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontWeight: 650, letterSpacing: '-0.005em' },
      subtitle1: { fontWeight: 550 },
      subtitle2: { fontWeight: 600, fontSize: '0.8125rem' },
      body1: { fontSize: '0.9375rem', lineHeight: 1.55 },
      body2: { fontSize: '0.8438rem', lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
      caption: { fontSize: '0.75rem', lineHeight: 1.4 },
    },
    shape: {
      borderRadius: 14,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isDark ? '#334155 #090D16' : '#CBD5E1 #F6F8FC',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 7,
              height: 7,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
              },
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${p.divider}`,
            transition: 'background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s ease, box-shadow 0.25s ease',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${p.divider}`,
            boxShadow: isDark
              ? '0 4px 24px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              : '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 18px',
            fontSize: '0.875rem',
            boxShadow: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            background: p.gradient,
            color: p.primary.contrastText,
            boxShadow: `0 4px 14px -2px ${alpha(p.primary.main, 0.35)}`,
            '&:hover': {
              background: p.gradient,
              filter: 'brightness(1.08)',
              boxShadow: `0 6px 20px -2px ${alpha(p.primary.main, 0.5)}`,
            },
          },
          outlined: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(15, 23, 42, 0.14)',
            color: p.text.primary,
            '&:hover': {
              backgroundColor: alpha(p.primary.main, isDark ? 0.12 : 0.06),
              borderColor: p.primary.main,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? '#1E293B' : '#0F172A',
            color: '#F8FAFC',
            fontSize: '0.75rem',
            borderRadius: 8,
            padding: '6px 12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
          },
        },
      },
    },
  });
};
