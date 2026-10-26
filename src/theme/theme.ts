import { createTheme, alpha } from '@mui/material/styles';

export const getAppTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#818CF8' : '#4F46E5', // Indigo
        light: isDark ? '#A5B4FC' : '#6366F1',
        dark: isDark ? '#4338CA' : '#3730A3',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: isDark ? '#38BDF8' : '#0284C7', // Sky
        light: isDark ? '#7DD3FC' : '#38BDF8',
        dark: isDark ? '#0369A1' : '#075985',
        contrastText: '#FFFFFF',
      },
      success: {
        main: isDark ? '#34D399' : '#059669', // Emerald
        light: isDark ? '#6EE7B7' : '#10B981',
        dark: isDark ? '#047857' : '#065F46',
      },
      warning: {
        main: isDark ? '#FBBF24' : '#D97706', // Amber
        light: isDark ? '#FCD34D' : '#F59E0B',
        dark: isDark ? '#B45309' : '#92400E',
      },
      error: {
        main: isDark ? '#F87171' : '#DC2626', // Rose
        light: isDark ? '#FCA5A5' : '#EF4444',
        dark: isDark ? '#B91C1C' : '#991B1B',
      },
      info: {
        main: isDark ? '#60A5FA' : '#2563EB',
        light: isDark ? '#93C5FD' : '#3B82F6',
        dark: isDark ? '#1D4ED8' : '#1E40AF',
      },
      background: {
        default: isDark ? '#0A0E17' : '#F8FAFC',
        paper: isDark ? '#111827' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F1F5F9' : '#0F172A',
        secondary: isDark ? '#94A3B8' : '#64748B',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 700, letterSpacing: '-0.025em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 600, letterSpacing: '-0.02em' },
      h4: { fontWeight: 600, letterSpacing: '-0.015em' },
      h5: { fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 500, fontSize: '0.8125rem' },
      body1: { fontSize: '0.9375rem', lineHeight: 1.5 },
      body2: { fontSize: '0.8438rem', lineHeight: 1.45 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isDark ? '#334155 #0A0E17' : '#CBD5E1 #F8FAFC',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: isDark ? '#334155' : '#CBD5E1',
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              backgroundColor: isDark ? '#0A0E17' : '#F8FAFC',
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
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'}`,
            transition: 'background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
            boxShadow: isDark
              ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)'
              : '0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
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
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            background: isDark
              ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'
              : 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
            color: '#FFFFFF',
            '&:hover': {
              background: isDark
                ? 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)'
                : 'linear-gradient(135deg, #4338CA 0%, #312E81 100%)',
            },
          },
          outlined: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(203, 213, 225, 0.9)',
            '&:hover': {
              backgroundColor: isDark ? alpha('#818CF8', 0.08) : alpha('#4F46E5', 0.04),
              borderColor: isDark ? '#818CF8' : '#4F46E5',
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
            borderRadius: 6,
            padding: '6px 10px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
          },
        },
      },
    },
  });
};
