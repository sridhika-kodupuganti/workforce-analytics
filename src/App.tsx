import React from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, Link as MuiLink, alpha } from '@mui/material';
import { WorkforceProvider } from './context/WorkforceContext.tsx';
import { useWorkforce } from './context/useWorkforce.ts';
import { getAppTheme } from './theme/theme.ts';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { TopNavbar } from './components/layout/TopNavbar.tsx';
import { WorkforceDashboard } from './components/dashboard/WorkforceDashboard.tsx';

const AppContent: React.FC = () => {
  const { themeMode, colorPreset } = useWorkforce();
  const theme = React.useMemo(() => getAppTheme(themeMode, colorPreset), [themeMode, colorPreset]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          width: '100%',
          backgroundColor: theme.palette.background.default,
          backgroundImage: theme.palette.mode === 'dark'
            ? `radial-gradient(ellipse 90% 50% at 50% -10%, ${alpha(theme.palette.primary.main, 0.15)}, transparent)`
            : `radial-gradient(ellipse 90% 50% at 50% -10%, ${alpha(theme.palette.primary.main, 0.06)}, transparent)`,
          backgroundAttachment: 'fixed',
          transition: 'background-color 0.3s ease',
        }}
      >
        {/* Responsive Collapsible Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflowX: 'hidden' }}>
          {/* Top Navigation */}
          <TopNavbar />

          {/* Main Dashboard Body */}
          <WorkforceDashboard />

          {/* Enterprise Footer */}
          <Box
            component="footer"
            sx={{
              py: 2.5,
              px: { xs: 2, sm: 3 },
              mt: 'auto',
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1.5,
              backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              © 2026 Stackly Platform Inc. All rights reserved. Enterprise Workforce Telemetry & Attendance v2.4.0
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <MuiLink href="#" underline="hover" variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Privacy Policy
              </MuiLink>
              <MuiLink href="#" underline="hover" variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Security & Compliance
              </MuiLink>
              <MuiLink href="#" underline="hover" variant="caption" sx={{ color: theme.palette.text.secondary }}>
                API Documentation
              </MuiLink>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export function App() {
  return (
    <WorkforceProvider>
      <AppContent />
    </WorkforceProvider>
  );
}

export default App;
