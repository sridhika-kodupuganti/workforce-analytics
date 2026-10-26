import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import DomainIcon from '@mui/icons-material/Domain';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useWorkforce } from '../../context/useWorkforce.ts';
import type { DepartmentMetric } from '../../types/workforce.ts';

const DepartmentTooltip: React.FC<{ active?: boolean; payload?: any[]; label?: string }> = ({
  active,
  payload,
  label,
}) => {
  const theme = useTheme();
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload as DepartmentMetric | undefined;
  if (!data) return null;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#1E293B' : '#0F172A',
        color: '#F8FAFC',
        p: 1.5,
        borderRadius: 2,
        boxShadow: theme.shadows[6],
        border: `1px solid ${theme.palette.divider}`,
        minWidth: 190,
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.8, fontSize: '0.8rem' }}>
        {label} Department
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <FiberManualRecordIcon sx={{ fontSize: 10, color: '#4F46E5' }} />
            <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
              Headcount:
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
            {data.headcount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <FiberManualRecordIcon sx={{ fontSize: 10, color: '#10B981' }} />
            <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
              Present (Office):
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
            {data.presentCount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <FiberManualRecordIcon sx={{ fontSize: 10, color: '#0EA5E9' }} />
            <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
              Remote Active:
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
            {data.remoteCount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <FiberManualRecordIcon sx={{ fontSize: 10, color: '#F59E0B' }} />
            <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
              On Leave:
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
            {data.onLeaveCount}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pt: 0.8,
            mt: 0.5,
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#38BDF8' }}>
            Attendance Rate:
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#38BDF8' }}>
            {data.attendanceRate}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const DepartmentDistributionChart: React.FC = () => {
  const theme = useTheme();
  const { departmentMetrics, viewState } = useWorkforce();
  const [sortBy, setSortBy] = useState<'headcount' | 'attendance'>('headcount');

  const isDark = theme.palette.mode === 'dark';

  if (viewState === 'loading') {
    return (
      <Card sx={{ p: 2.5, borderRadius: 3, height: 380 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="text" width="40%" height={28} />
          <Skeleton variant="rectangular" width={140} height={32} sx={{ borderRadius: 1 }} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={280} sx={{ borderRadius: 2 }} />
      </Card>
    );
  }

  const sortedData = [...departmentMetrics].sort((a, b) => {
    if (sortBy === 'headcount') return b.headcount - a.headcount;
    return b.attendanceRate - a.attendanceRate;
  });

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
                  backgroundColor: isDark ? 'rgba(14, 165, 233, 0.15)' : 'rgba(2, 132, 199, 0.1)',
                  color: theme.palette.secondary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DomainIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                Department Distribution & Attendance
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 0.5, display: 'block' }}>
              Headcount breakdown with on-site, remote, and attendance ratios
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.72rem' }}>
              Sort:
            </Typography>
            <ToggleButtonGroup
              value={sortBy}
              exclusive
              onChange={(_e, val) => val && setSortBy(val)}
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
              <ToggleButton value="headcount">Headcount</ToggleButton>
              <ToggleButton value="attendance">Rate %</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Bar Chart Container */}
        <Box sx={{ width: '100%', height: 290, minHeight: 290, flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 10, right: 10, left: -18, bottom: 25 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
              />
              <XAxis
                dataKey="department"
                tickLine={false}
                stroke={theme.palette.text.secondary}
                interval={0}
                angle={-20}
                textAnchor="end"
                style={{ fontSize: '0.7rem' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke={theme.palette.text.secondary}
                style={{ fontSize: '0.72rem' }}
              />
              <RechartsTooltip content={<DepartmentTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 10, fontSize: '0.75rem' }}
              />
              <Bar
                dataKey="presentCount"
                name="Present (Office)"
                stackId="dept"
                fill="#4F46E5"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="remoteCount"
                name="Remote Active"
                stackId="dept"
                fill="#0EA5E9"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="onLeaveCount"
                name="On Leave"
                stackId="dept"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
