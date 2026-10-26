import React from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useWorkforce } from '../../context/useWorkforce.ts';

export const StateFeedback: React.FC = () => {
  const theme = useTheme();
  const { viewState, simulateState, resetFilters } = useWorkforce();

  if (viewState === 'normal' || viewState === 'loading') {
    return null;
  }

  if (viewState === 'error') {
    return (
      <Card
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 3,
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: theme.palette.error.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ErrorIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                Telemetry Sync Error [HTTP 503]
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                Could not establish secure websocket connection to biometrics gateway turnstiles (US-East-1 & EU-West-2). Attendance rate calculation may be degraded.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            color="error"
            startIcon={<RefreshIcon />}
            onClick={() => simulateState('normal')}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Retry Sync
          </Button>
        </Box>
      </Card>
    );
  }

  if (viewState === 'empty') {
    return (
      <Card
        sx={{
          mb: 3,
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
          border: `1px dashed ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            color: theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <FilterAltOffIcon fontSize="large" />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          No Matching Workforce Records Found
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, maxWidth: 480, mx: 'auto', mb: 2.5 }}>
          Your search or filter combination did not return any active employees or attendance logs. Try loosening your department or status parameters.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: 360, mx: 'auto', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<RestartAltIcon />}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
          <Button
            variant="outlined"
            onClick={() => simulateState('normal')}
          >
            Return to Directory
          </Button>
        </Box>
      </Card>
    );
  }

  return null;
};
