import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Skeleton,
  Chip,
} from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useWorkforce } from '../../context/useWorkforce.ts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  const theme = useTheme();
  if (!active || !payload || !payload.length) return null;

  const present = payload.find((p) => p.dataKey === 'present')?.value || 0;
  const remote = payload.find((p) => p.dataKey === 'remote')?.value || 0;
  const onLeave = payload.find((p) => p.dataKey === 'onLeave')?.value || 0;
  const total = present + remote + onLeave;
  const rate = total > 0 ? (((present + remote) / total) * 100).toFixed(1) : 0;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#1E293B' : '#0F172A',
        color: '#F8FAFC',
        p: 1.5,
        borderRadius: 2,
        boxShadow: theme.shadows[6],
        border: `1px solid ${theme.palette.divider}`,
        minWidth: 180,
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '0.8rem' }}>
        {label} (Workday Summary)
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <FiberManualRecordIcon sx={{ fontSize: 10, color: '#4F46E5' }} />
            <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
              On-Site Present:
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
            {present}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <FiberManualRecordIcon sx={{ fontSize: 10, color: '#0EA5E9' }} />
            <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
              Remote Active:
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
            {remote}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <FiberManualRecordIcon sx={{ fontSize: 10, color: '#F59E0B' }} />
            <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
              On Leave / Absent:
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
            {onLeave}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 0.8,
            mt: 0.5,
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#34D399' }}>
            Effective Rate:
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#34D399' }}>
            {rate}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const AttendanceTrendChart: React.FC = () => {
  const theme = useTheme();
  const { trendData, filters, setFilter, viewState } = useWorkforce();

  const isDark = theme.palette.mode === 'dark';

  if (viewState === 'loading') {
    return (
      <Card sx={{ p: 2.5, borderRadius: 3, height: 380 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="text" width="40%" height={28} />
          <Skeleton variant="rectangular" width={160} height={32} sx={{ borderRadius: 1 }} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={280} sx={{ borderRadius: 2 }} />
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)',
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShowChartIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                Attendance & Presence Trends
              </Typography>
              <Chip
                label="96.5% Target Met"
                size="small"
                color="success"
                sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 0.5, display: 'block' }}>
              Daily time-series tracking badge-in on-site vs remote vs leaves
            </Typography>
          </Box>

          {/* Range Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ToggleButtonGroup
              value={filters.dateRange}
              exclusive
              onChange={(_e, val) => val && setFilter('dateRange', val)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 1.2,
                  py: 0.4,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                },
              }}
            >
              <ToggleButton value="7d">7D</ToggleButton>
              <ToggleButton value="14d">14D</ToggleButton>
              <ToggleButton value="30d">30D</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Recharts Area Container */}
        <Box sx={{ width: '100%', height: 290, minHeight: 290, flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorRemote" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorLeave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
              />

              <XAxis
                dataKey="date"
                tickLine={false}
                stroke={theme.palette.text.secondary}
                style={{ fontSize: '0.72rem' }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                stroke={theme.palette.text.secondary}
                style={{ fontSize: '0.72rem' }}
                domain={['dataMin - 10', 'auto']}
              />

              <RechartsTooltip content={<CustomTooltip />} />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 12, fontSize: '0.75rem' }}
              />

              <Area
                type="monotone"
                dataKey="present"
                name="On-site Badge-in"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorPresent)"
              />
              <Area
                type="monotone"
                dataKey="remote"
                name="Remote Active"
                stroke="#0EA5E9"
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#colorRemote)"
              />
              <Area
                type="monotone"
                dataKey="onLeave"
                name="On Leave"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLeave)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
