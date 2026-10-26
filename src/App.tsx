import React from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, Link as MuiLink } from '@mui/material';
import { WorkforceProvider } from './context/WorkforceContext.tsx';
import { useWorkforce } from './context/useWorkforce.ts';
import { getAppTheme } from './theme/theme.ts';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { TopNavbar } from './components/layout/TopNavbar.tsx';
import { WorkforceDashboard } from './components/dashboard/WorkforceDashboard.tsx';

const AppContent: React.FC = () => {
  const { themeMode } = useWorkforce();
  const theme = React.useMemo(() => getAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: theme.palette.background.default }}>
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
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(11, 15, 25, 0.6)' : 'rgba(255, 255, 255, 0.6)',
            }}
          >
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              © 2026 WorkforceIQ Platform Inc. All rights reserved. Enterprise Workforce Telemetry & Attendance v2.4.0
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
