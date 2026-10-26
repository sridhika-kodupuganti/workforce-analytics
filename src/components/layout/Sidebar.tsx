import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import DomainIcon from '@mui/icons-material/Domain';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HubIcon from '@mui/icons-material/Hub';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useWorkforce } from '../../context/useWorkforce.ts';

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 76;

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  badge?: string;
  badgeColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, badge: 'Live', badgeColor: 'success' },
  { id: 'employees', label: 'Workforce Directory', icon: <PeopleAltIcon fontSize="small" />, badge: '340' },
  { id: 'attendance', label: 'Attendance & Logs', icon: <AccessTimeFilledIcon fontSize="small" /> },
  { id: 'departments', label: 'Departments', icon: <DomainIcon fontSize="small" /> },
  { id: 'analytics', label: 'Advanced Analytics', icon: <InsightsIcon fontSize="small" /> },
  { id: 'settings', label: 'Platform Settings', icon: <SettingsIcon fontSize="small" /> },
];

export const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen, setSidebarOpen, activeNav, setActiveNav, toggleSidebar } = useWorkforce();

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.palette.mode === 'dark' ? '#0F172A' : '#FFFFFF',
        color: theme.palette.text.primary,
        borderRight: `1px solid ${theme.palette.divider}`,
        overflowX: 'hidden',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: !sidebarOpen && !isMobile ? 'center' : 'space-between',
          px: !sidebarOpen && !isMobile ? 1 : 2.5,
          py: 2.2,
          minHeight: 70,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
              flexShrink: 0,
            }}
          >
            <HubIcon fontSize="small" />
          </Box>
          {(sidebarOpen || isMobile) && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2 }}>
                Workforce<span style={{ color: theme.palette.primary.main }}>IQ</span>
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', fontSize: '0.7rem' }}>
                Enterprise Operations
              </Typography>
            </Box>
          )}
        </Box>

        {!isMobile && (
          <IconButton
            size="small"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            sx={{
              display: sidebarOpen ? 'flex' : 'none',
              color: theme.palette.text.secondary,
              '&:hover': { backgroundColor: theme.palette.action.hover },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      {/* Navigation List */}
      <Box sx={{ flex: 1, py: 2, px: 1.5, overflowY: 'auto' }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            pb: 1,
            display: sidebarOpen || isMobile ? 'block' : 'none',
            textTransform: 'uppercase',
            fontWeight: 700,
            fontSize: '0.675rem',
            letterSpacing: '0.08em',
            color: theme.palette.text.secondary,
          }}
        >
          Menu
        </Typography>

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            const buttonContent = (
              <ListItemButton
                onClick={() => handleNavClick(item.id)}
                sx={{
                  borderRadius: 2,
                  px: !sidebarOpen && !isMobile ? 1.5 : 2,
                  py: 1.1,
                  justifyContent: !sidebarOpen && !isMobile ? 'center' : 'flex-start',
                  backgroundColor: isActive
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(99, 102, 241, 0.16)'
                      : 'rgba(79, 70, 229, 0.08)'
                    : 'transparent',
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: isActive
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(99, 102, 241, 0.22)'
                        : 'rgba(79, 70, 229, 0.12)'
                      : theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: !sidebarOpen && !isMobile ? 0 : 36,
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {(sidebarOpen || isMobile) && (
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 }}>
                        {item.label}
                      </Typography>
                    }
                  />
                )}
                {(sidebarOpen || isMobile) && item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color={item.badgeColor || 'default'}
                    sx={{
                      height: 20,
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      borderRadius: 1.5,
                      ml: 'auto',
                    }}
                  />
                )}
              </ListItemButton>
            );

            return (
              <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
                {!sidebarOpen && !isMobile ? (
                  <Tooltip title={item.label} placement="right" arrow>
                    {buttonContent}
                  </Tooltip>
                ) : (
                  buttonContent
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Collapse button for mini mode */}
      {!isMobile && !sidebarOpen && (
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
          <IconButton
            size="small"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': { backgroundColor: theme.palette.action.hover },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Divider sx={{ borderColor: theme.palette.divider }} />

      {/* User Footer Profile */}
      <Box
        sx={{
          p: !sidebarOpen && !isMobile ? 1.5 : 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          justifyContent: !sidebarOpen && !isMobile ? 'center' : 'flex-start',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Sridhika"
            sx={{ width: 36, height: 36, border: `2px solid ${theme.palette.primary.main}` }}
          />
          <FiberManualRecordIcon
            sx={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              fontSize: 12,
              color: theme.palette.success.main,
            }}
          />
        </Box>
        {(sidebarOpen || isMobile) && (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Sridhika
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', fontSize: '0.725rem' }}>
              HR Analytics Lead
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            '& .MuiDrawer-paper': {
              width: sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
              boxSizing: 'border-box',
              borderRight: `1px solid ${theme.palette.divider}`,
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};
