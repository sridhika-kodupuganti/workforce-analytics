import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Button,
  Chip,
  InputBase,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useWorkforce } from '../../context/useWorkforce.ts';
import type { DashboardViewState } from '../../types/workforce.ts';

export const TopNavbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const {
    themeMode,
    toggleTheme,
    toggleSidebar,
    viewState,
    simulateState,
    refreshData,
    filters,
    setFilter,
    setIsExportOpen,
  } = useWorkforce();

  // Profile menu state
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Notifications popover state
  const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null);
  const handleOpenNotif = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotif(event.currentTarget);
  };
  const handleCloseNotif = () => {
    setAnchorElNotif(null);
  };

  const handleStateChange = (
    _event: React.MouseEvent<HTMLElement>,
    newState: DashboardViewState | null,
  ) => {
    if (newState !== null) {
      simulateState(newState);
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(11, 15, 25, 0.85)'
            : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        color: theme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 60, md: 70 },
          px: { xs: 1.5, sm: 2.5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        {/* Left: Mobile Toggle & Page Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSidebar}
            sx={{
              display: { md: 'none' },
              color: theme.palette.text.secondary,
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                Workforce & Attendance
              </Typography>
              {!isMobile && (
                <Chip
                  icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important', color: `${theme.palette.success.main} !important` }} />}
                  label="Live Systems"
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                    color: theme.palette.success.main,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 211, 153, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                  }}
                />
              )}
            </Box>
            {!isMobile && (
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                Real-time operational headcount, shifts, & presence metrics
              </Typography>
            )}
          </Box>
        </Box>

        {/* Center/Middle: State Simulation Toolbar (Interactive Testing of normal/loading/empty/error) */}
        {!isTablet && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              borderRadius: 2,
              p: 0.5,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" sx={{ px: 1, fontWeight: 700, color: theme.palette.text.secondary, fontSize: '0.7rem' }}>
              STATE SIMULATOR:
            </Typography>
            <ToggleButtonGroup
              value={viewState}
              exclusive
              onChange={handleStateChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  py: 0.3,
                  px: 1.2,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '6px !important',
                  textTransform: 'capitalize',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                },
              }}
            >
              <ToggleButton value="normal">Normal</ToggleButton>
              <ToggleButton value="loading">Loading</ToggleButton>
              <ToggleButton value="empty">Empty</ToggleButton>
              <ToggleButton value="error">Error</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {/* Right Action Icons: Search, Refresh, Export, Notifications, Theme, Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          {/* Quick Search on Tablet/Desktop */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                width: { sm: 160, md: 220 },
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.2s ease',
                '&:focus-within': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.15)'}`,
                },
              }}
            >
              <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 18, mr: 1 }} />
              <InputBase
                placeholder="Search staff, role..."
                value={filters.searchQuery}
                onChange={(e) => setFilter('searchQuery', e.target.value)}
                sx={{ fontSize: '0.8125rem', width: '100%' }}
                inputProps={{ 'aria-label': 'search staff' }}
              />
            </Box>
          )}

          {/* Export Report Button */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon fontSize="small" />}
            onClick={() => setIsExportOpen(true)}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              height: 36,
              fontSize: '0.785rem',
            }}
          >
            Export
          </Button>

          {/* Async Refresh Simulator */}
          <Tooltip title="Refresh Dashboard Data">
            <IconButton
              size="small"
              onClick={refreshData}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': { color: theme.palette.text.primary },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Notifications Button & Popover */}
          <Tooltip title="System Notifications (3)">
            <IconButton
              size="small"
              onClick={handleOpenNotif}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': { color: theme.palette.text.primary },
              }}
            >
              <Badge badgeContent={3} color="primary" variant="dot">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Popover
            open={Boolean(anchorElNotif)}
            anchorEl={anchorElNotif}
            onClose={handleCloseNotif}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  width: 320,
                  p: 1.5,
                  borderRadius: 3,
                  boxShadow: theme.shadows[8],
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Notifications
              </Typography>
              <Chip label="3 New" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />
            </Box>
            <Divider sx={{ my: 0.5 }} />
            <List disablePadding>
              <ListItem disableGutters sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <WarningAmberIcon fontSize="small" color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Overtime threshold reached</Typography>}
                  secondary={<Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary }}>Julian Alvarez crossed 18 OT hrs this month</Typography>}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem disableGutters sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Shift swap approved</Typography>}
                  secondary={<Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary }}>Liam O'Connor swapped with Oliver Wright</Typography>}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem disableGutters sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <HourglassEmptyIcon fontSize="small" color="info" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Leave awaiting sign-off</Typography>}
                  secondary={<Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary }}>Oliver Wright submitted 1 day sick leave</Typography>}
                />
              </ListItem>
            </List>
          </Popover>

          {/* Theme Mode Toggle Button */}
          <Tooltip title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}>
            <IconButton
              size="small"
              onClick={toggleTheme}
              aria-label="toggle color theme"
              sx={{
                color: theme.palette.text.secondary,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                '&:hover': {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                },
              }}
            >
              {themeMode === 'light' ? (
                <DarkModeIcon fontSize="small" sx={{ color: '#4F46E5' }} />
              ) : (
                <LightModeIcon fontSize="small" sx={{ color: '#FBBF24' }} />
              )}
            </IconButton>
          </Tooltip>

          {/* User Profile Avatar & Menu */}
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.3, ml: 0.5 }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Profile"
              sx={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            />
          </IconButton>

          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  width: 220,
                  borderRadius: 3,
                  mt: 1.5,
                  boxShadow: theme.shadows[8],
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Sarah Chen
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                sarah.chen@workforceiq.corp
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleCloseUserMenu} sx={{ fontSize: '0.85rem', py: 1 }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu} sx={{ fontSize: '0.85rem', py: 1 }}>
              <ListItemIcon>
                <SettingsOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Preferences
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseUserMenu} sx={{ fontSize: '0.85rem', py: 1, color: theme.palette.error.main }}>
              <ListItemIcon sx={{ color: theme.palette.error.main }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
