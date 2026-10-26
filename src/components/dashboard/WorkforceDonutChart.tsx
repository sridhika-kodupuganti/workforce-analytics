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
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';
import PieChartIcon from '@mui/icons-material/PieChart';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useWorkforce } from '../../context/useWorkforce.ts';
import {
  WORK_MODEL_DISTRIBUTION,
  EMPLOYMENT_TYPE_DISTRIBUTION,
  DEPARTMENT_PIE_DISTRIBUTION,
} from '../../data/mockData.ts';
import type { WorkforceDistributionItem } from '../../types/workforce.ts';

const DonutTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({ active, payload }) => {
  const theme = useTheme();
  if (!active || !payload || !payload.length) return null;

  const item = payload[0]?.payload as WorkforceDistributionItem | undefined;
  if (!item) return null;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#1E293B' : '#0F172A',
        color: '#F8FAFC',
        px: 1.5,
        py: 1,
        borderRadius: 2,
        boxShadow: theme.shadows[6],
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
        <FiberManualRecordIcon sx={{ fontSize: 10, color: item.color }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
          {item.name}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
        <strong>{item.value}</strong> employees ({item.percentage}%)
      </Typography>
    </Box>
  );
};

export const WorkforceDonutChart: React.FC = () => {
  const theme = useTheme();
  const { viewState } = useWorkforce();
  const [sliceType, setSliceType] = useState<'workModel' | 'employmentType' | 'department'>('workModel');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isDark = theme.palette.mode === 'dark';

  if (viewState === 'loading') {
    return (
      <Card sx={{ p: 2.5, borderRadius: 3, height: 380 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="text" width="45%" height={28} />
          <Skeleton variant="rectangular" width={160} height={32} sx={{ borderRadius: 1 }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
          <Skeleton variant="circular" width={220} height={220} />
        </Box>
      </Card>
    );
  }

  const dataset: WorkforceDistributionItem[] =
    sliceType === 'workModel'
      ? WORK_MODEL_DISTRIBUTION
      : sliceType === 'employmentType'
        ? EMPLOYMENT_TYPE_DISTRIBUTION
        : DEPARTMENT_PIE_DISTRIBUTION;

  const total = dataset.reduce((sum, item) => sum + item.value, 0);

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
            mb: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  backgroundColor: isDark ? 'rgba(168, 85, 247, 0.15)' : 'rgba(139, 92, 246, 0.1)',
                  color: '#8B5CF6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PieChartIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                Workforce Structure
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 0.5, display: 'block' }}>
              Proportional distribution by work model, contract, or division
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={sliceType}
            exclusive
            onChange={(_e, val) => val && setSliceType(val)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                px: 1.1,
                py: 0.4,
                fontSize: '0.73rem',
                fontWeight: 600,
              },
            }}
          >
            <ToggleButton value="workModel">Model</ToggleButton>
            <ToggleButton value="employmentType">Contract</ToggleButton>
            <ToggleButton value="department">Dept</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Chart + Legend Flex Container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            flex: 1,
            position: 'relative',
          }}
        >
          {/* Donut Chart with Center Metric */}
          <Box sx={{ position: 'relative', width: 220, height: 220, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <RechartsTooltip content={<DonutTooltip />} />
                <Pie
                  data={dataset}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_data, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {dataset.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={isDark ? '#111827' : '#FFFFFF'}
                      strokeWidth={activeIndex === index ? 3 : 2}
                      style={{
                        transition: 'transform 0.2s ease',
                        cursor: 'pointer',
                        transform: activeIndex === index ? 'scale(1.04)' : 'scale(1)',
                        transformOrigin: 'center center',
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Total Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                {total}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.675rem' }}>
                Total Staff
              </Typography>
            </Box>
          </Box>

          {/* Interactive Legend with values */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
              flex: 1,
              maxHeight: 220,
              overflowY: 'auto',
              pr: 0.5,
            }}
          >
            {dataset.map((item, idx) => {
              const isHovered = activeIndex === idx;
              return (
                <Box
                  key={item.name}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 0.8,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    backgroundColor: isHovered
                      ? isDark
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(0,0,0,0.04)'
                      : 'transparent',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                      {item.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.text.secondary, fontSize: '0.72rem', minWidth: 36, textAlign: 'right' }}
                    >
                      {item.percentage}%
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
