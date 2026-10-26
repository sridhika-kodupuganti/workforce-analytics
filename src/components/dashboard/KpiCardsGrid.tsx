import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Tooltip,
  useTheme,
  Skeleton,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import GroupsIcon from '@mui/icons-material/Groups';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { useWorkforce } from '../../context/useWorkforce.ts';
import type { KpiMetric } from '../../types/workforce.ts';

// Simple SVG Sparkline component for lightweight, robust rendering in KPI cards
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const KpiCardsGrid: React.FC = () => {
  const theme = useTheme();
  const { kpis, viewState } = useWorkforce();

  const isDark = theme.palette.mode === 'dark';

  const cardConfig: Array<{
    key: string;
    metric: KpiMetric;
    icon: React.ReactElement;
    gradient: string;
    accentColor: string;
  }> = [
    {
      key: 'totalWorkforce',
      metric: kpis.totalWorkforce,
      icon: <GroupsIcon sx={{ fontSize: 22 }} />,
      gradient: isDark
        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)',
      accentColor: '#6366F1',
    },
    {
      key: 'attendanceRate',
      metric: kpis.attendanceRate,
      icon: <EventAvailableIcon sx={{ fontSize: 22 }} />,
      gradient: isDark
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)',
      accentColor: '#10B981',
    },
    {
      key: 'presentToday',
      metric: kpis.presentToday,
      icon: <MeetingRoomIcon sx={{ fontSize: 22 }} />,
      gradient: isDark
        ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(2, 132, 199, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)',
      accentColor: '#0EA5E9',
    },
    {
      key: 'onLeave',
      metric: kpis.onLeave,
      icon: <EventBusyIcon sx={{ fontSize: 22 }} />,
      gradient: isDark
        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)',
      accentColor: '#F59E0B',
    },
    {
      key: 'overtimeHours',
      metric: kpis.overtimeHours,
      icon: <MoreTimeIcon sx={{ fontSize: 22 }} />,
      gradient: isDark
        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)',
      accentColor: '#EF4444',
    },
  ];

  if (viewState === 'loading') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: 2,
          mb: 3,
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} sx={{ p: 2, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="rectangular" width="100%" height={6} sx={{ mt: 1.5, borderRadius: 1 }} />
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)',
        },
        gap: 2,
        mb: 3,
      }}
    >
      {cardConfig.map(({ key, metric, icon, gradient, accentColor }) => {
        const isUp = metric.trend === 'up';
        const isTrendGood = metric.isPositive;
        const trendBg = isTrendGood
          ? isDark
            ? 'rgba(16, 185, 129, 0.15)'
            : 'rgba(16, 185, 129, 0.1)'
          : isDark
            ? 'rgba(239, 68, 68, 0.15)'
            : 'rgba(239, 68, 68, 0.1)';
        const trendText = isTrendGood ? theme.palette.success.main : theme.palette.error.main;

        return (
          <Card
            key={key}
            sx={{
              position: 'relative',
              background: gradient,
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: isDark
                  ? '0 8px 24px -4px rgba(0,0,0,0.6)'
                  : '0 8px 20px -4px rgba(15, 23, 42, 0.08)',
              },
            }}
          >
            <CardContent sx={{ p: 2.2, '&:last-child': { pb: 2.2 } }}>
              {/* Header: Title and Icon */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: theme.palette.text.secondary,
                    fontSize: '0.72rem',
                  }}
                >
                  {metric.title}
                </Typography>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)',
                    color: accentColor,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  }}
                >
                  {icon}
                </Box>
              </Box>

              {/* Metric Value & Trend Badge */}
              <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', sm: '1.75rem' },
                    letterSpacing: '-0.02em',
                  }}
                >
                  {metric.value}
                </Typography>

                <Tooltip title={`${metric.delta > 0 ? '+' : ''}${metric.delta}% ${metric.deltaPeriod}`}>
                  <Chip
                    icon={
                      isUp ? (
                        <TrendingUpIcon sx={{ fontSize: '14px !important', color: `${trendText} !important` }} />
                      ) : (
                        <TrendingDownIcon sx={{ fontSize: '14px !important', color: `${trendText} !important` }} />
                      )
                    }
                    label={`${metric.delta > 0 ? '+' : ''}${metric.delta}%`}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      backgroundColor: trendBg,
                      color: trendText,
                      border: 'none',
                    }}
                  />
                </Tooltip>
              </Box>

              {/* Subtitle and Sparkline */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.735rem',
                    lineHeight: 1.3,
                    maxWidth: '65%',
                  }}
                >
                  {metric.subtitle}
                </Typography>

                <Box sx={{ opacity: 0.85 }}>
                  <Sparkline data={metric.sparklineData} color={accentColor} />
                </Box>
              </Box>

              {/* Progress bar if present */}
              {metric.progressValue !== undefined && (
                <Box sx={{ mt: 1.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, metric.progressValue)}
                    sx={{
                      height: 5,
                      borderRadius: 2,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: accentColor,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};
