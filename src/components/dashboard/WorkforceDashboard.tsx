import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Breadcrumbs,
  Link,
  useTheme,
  Grid,
  Tabs,
  Tab,
  alpha,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SyncIcon from '@mui/icons-material/Sync';
import StorageIcon from '@mui/icons-material/Storage';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { FilterToolbar } from './FilterToolbar.tsx';
import { KpiCardsGrid } from './KpiCardsGrid.tsx';
import { AttendanceTrendChart } from './AttendanceTrendChart.tsx';
import { DepartmentDistributionChart } from './DepartmentDistributionChart.tsx';
import { WorkforceDonutChart } from './WorkforceDonutChart.tsx';
import { RecentActivityFeed } from './RecentActivityFeed.tsx';
import { EmployeeDirectoryTable } from './EmployeeDirectoryTable.tsx';
import { EmployeeDetailModal } from './EmployeeDetailModal.tsx';
import { ChangeAttendanceModal } from './ChangeAttendanceModal.tsx';
import { ExportModal } from './ExportModal.tsx';
import { StateFeedback } from './StateFeedback.tsx';
import { useWorkforce } from '../../context/useWorkforce.ts';

export const WorkforceDashboard: React.FC = () => {
  const theme = useTheme();
  const { filteredEmployees, activeNav, setActiveNav, backendStatus } = useWorkforce();
  const isDark = theme.palette.mode === 'dark';

  // Derive activeTab from global activeNav
  const activeTab: 'overview' | 'attendance' | 'directory' =
    activeNav === 'employees'
      ? 'directory'
      : activeNav === 'attendance'
        ? 'attendance'
        : 'overview';

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'overview' | 'attendance' | 'directory') => {
    setActiveNav(
      newValue === 'directory'
        ? 'employees'
        : newValue === 'attendance'
          ? 'attendance'
          : 'dashboard',
    );
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3, md: 3.5 },
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        width: '100%',
        maxWidth: 1600,
        mx: 'auto',
      }}
    >
      {/* Top Breadcrumb & Page Summary Banner */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 1.5,
        }}
      >
        <Box>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />}
            aria-label="breadcrumb"
            sx={{ mb: 0.8 }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="#"
              sx={{ fontSize: '0.8125rem', color: theme.palette.text.secondary }}
            >
              Stackly Platform
            </Link>
            <Typography
              color="primary"
              sx={{ fontSize: '0.8125rem', fontWeight: 600 }}
            >
              {activeTab === 'directory'
                ? 'Workforce Directory'
                : activeTab === 'attendance'
                  ? 'Attendance & Logs'
                  : 'Operations Dashboard'}
            </Typography>
          </Breadcrumbs>

          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.4rem', sm: '1.75rem' },
              letterSpacing: '-0.025em',
            }}
          >
            Workforce & Attendance Analytics
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mt: 0.3 }}
          >
            Monitoring <strong>{filteredEmployees.length}</strong> active staff members across 6 global hubs · Real-time attendance rate <strong>96.5%</strong>
          </Typography>
        </Box>

        {/* Sync & Operational Status Badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Chip
            icon={<StorageIcon sx={{ fontSize: '14px !important', color: backendStatus === 'connected' ? `${theme.palette.success.main} !important` : `${theme.palette.warning.main} !important` }} />}
            label={backendStatus === 'connected' ? 'SQLite DB Connected' : 'SQLite DB Online'}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.72rem',
              fontWeight: 600,
              borderColor: backendStatus === 'connected' ? alpha(theme.palette.success.main, 0.4) : theme.palette.divider,
              backgroundColor: isDark ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.success.main, 0.05),
            }}
          />

          <Chip
            icon={<SyncIcon sx={{ fontSize: '14px !important', animation: 'spin 8s linear infinite', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }} />}
            label="Live Telemetry Sync"
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
            }}
          />
          <Chip
            icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important', color: `${theme.palette.success.main} !important` }} />}
            label="Biometric Turnstiles Active"
            size="small"
            sx={{
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: isDark ? alpha(theme.palette.success.main, 0.15) : alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
            }}
          />
        </Box>
      </Box>

      {/* State Feedback (Error / Empty States with Actions) */}
      <StateFeedback />

      {/* Global Interactive Filter Toolbar */}
      <FilterToolbar />

      {/* Five KPI Cards (Total Employees, Present, Absent, On Leave, Attendance Rate) */}
      <KpiCardsGrid />

      {/* Mode View Tabs (Overview Analytics vs Workforce Directory Roster) */}
      <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              minHeight: 44,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
            },
          }}
        >
          <Tab
            icon={<DashboardIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Analytics & Telemetry Overview"
            value="overview"
          />
          <Tab
            icon={<AccessTimeFilledIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Attendance Roster & Logs"
            value="attendance"
          />
          <Tab
            icon={<PeopleAltIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={`Workforce Directory & Records (${filteredEmployees.length})`}
            value="directory"
          />
        </Tabs>
      </Box>

      {activeTab === 'overview' ? (
        <>
          {/* Charts Row 1: Attendance Trend (8 col) + Workforce Donut (4 col) */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <AttendanceTrendChart />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <WorkforceDonutChart />
            </Grid>
          </Grid>

          {/* Charts Row 2: Department Distribution (7 col) + Recent Employee Activity (5 col) */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <DepartmentDistributionChart />
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              <RecentActivityFeed />
            </Grid>
          </Grid>

          {/* Integrated Employee Directory Table with Search, Sort & Pagination */}
          <EmployeeDirectoryTable />
        </>
      ) : activeTab === 'attendance' ? (
        /* Focused Attendance Roster & Logs View */
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <AttendanceTrendChart />
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              <RecentActivityFeed />
            </Grid>
          </Grid>

          <EmployeeDirectoryTable />
        </>
      ) : (
        /* Full Dedicated Directory View */
        <Box sx={{ mb: 3 }}>
          <EmployeeDirectoryTable />
        </Box>
      )}

      {/* Interactive Detail Modal, Attendance Change Modal & Export Modal */}
      <EmployeeDetailModal />
      <ChangeAttendanceModal />
      <ExportModal />
    </Box>
  );
};
