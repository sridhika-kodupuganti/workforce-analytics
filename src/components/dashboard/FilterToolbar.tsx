import React from 'react';
import {
  Box,
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Chip,
  Typography,
  useTheme,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DomainIcon from '@mui/icons-material/Domain';
import PlaceIcon from '@mui/icons-material/Place';
import BadgeIcon from '@mui/icons-material/Badge';
import { useWorkforce } from '../../context/useWorkforce.ts';
import type { Department, Location, AttendanceStatus } from '../../types/workforce.ts';

const DEPARTMENTS: Department[] = [
  'All',
  'Engineering',
  'Product & Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Customer Success',
  'Finance & Ops',
];

const LOCATIONS: Location[] = [
  'All',
  'New York (HQ)',
  'San Francisco',
  'London',
  'Singapore',
  'Berlin',
  'Remote',
];

const STATUSES: AttendanceStatus[] = [
  'All',
  'Present',
  'Remote',
  'On Leave',
  'Half-Day',
  'Overtime',
];

export const FilterToolbar: React.FC = () => {
  const theme = useTheme();
  const { filters, setFilter, resetFilters, activeFilterCount } = useWorkforce();

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        mb: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {/* Top row: Label, Filter controls */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr) auto',
          },
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        {/* Date Range Selector */}
        <FormControl size="small" fullWidth>
          <InputLabel id="date-range-label" sx={{ fontSize: '0.85rem' }}>
            Time Window
          </InputLabel>
          <Select
            labelId="date-range-label"
            id="date-range-select"
            value={filters.dateRange}
            label="Time Window"
            onChange={(e) => setFilter('dateRange', e.target.value as any)}
            startAdornment={
              <CalendarMonthIcon
                fontSize="small"
                sx={{ mr: 1, color: theme.palette.text.secondary, fontSize: 18 }}
              />
            }
            sx={{ borderRadius: 2, fontSize: '0.85rem' }}
          >
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="14d">Last 14 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days (Standard)</MenuItem>
            <MenuItem value="90d">Last Quarter (90 Days)</MenuItem>
          </Select>
        </FormControl>

        {/* Department Selector */}
        <FormControl size="small" fullWidth>
          <InputLabel id="department-label" sx={{ fontSize: '0.85rem' }}>
            Department
          </InputLabel>
          <Select
            labelId="department-label"
            id="department-select"
            value={filters.department}
            label="Department"
            onChange={(e) => setFilter('department', e.target.value as Department)}
            startAdornment={
              <DomainIcon
                fontSize="small"
                sx={{ mr: 1, color: theme.palette.text.secondary, fontSize: 18 }}
              />
            }
            sx={{ borderRadius: 2, fontSize: '0.85rem' }}
          >
            {DEPARTMENTS.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Location Selector */}
        <FormControl size="small" fullWidth>
          <InputLabel id="location-label" sx={{ fontSize: '0.85rem' }}>
            Hub / Office Location
          </InputLabel>
          <Select
            labelId="location-label"
            id="location-select"
            value={filters.location}
            label="Hub / Office Location"
            onChange={(e) => setFilter('location', e.target.value as Location)}
            startAdornment={
              <PlaceIcon
                fontSize="small"
                sx={{ mr: 1, color: theme.palette.text.secondary, fontSize: 18 }}
              />
            }
            sx={{ borderRadius: 2, fontSize: '0.85rem' }}
          >
            {LOCATIONS.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc === 'All' ? 'All Locations' : loc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Selector */}
        <FormControl size="small" fullWidth>
          <InputLabel id="status-label" sx={{ fontSize: '0.85rem' }}>
            Attendance Status
          </InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={filters.status}
            label="Attendance Status"
            onChange={(e) => setFilter('status', e.target.value as AttendanceStatus)}
            startAdornment={
              <BadgeIcon
                fontSize="small"
                sx={{ mr: 1, color: theme.palette.text.secondary, fontSize: 18 }}
              />
            }
            sx={{ borderRadius: 2, fontSize: '0.85rem' }}
          >
            {STATUSES.map((st) => (
              <MenuItem key={st} value={st}>
                {st === 'All' ? 'All Attendance Statuses' : st}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Reset Action Button */}
        <Button
          variant="outlined"
          color="inherit"
          size="medium"
          startIcon={<RestartAltIcon />}
          onClick={resetFilters}
          disabled={activeFilterCount === 0}
          sx={{
            height: 40,
            borderRadius: 2,
            whiteSpace: 'nowrap',
            fontSize: '0.8125rem',
            borderColor: activeFilterCount > 0 ? theme.palette.primary.main : undefined,
            color: activeFilterCount > 0 ? theme.palette.primary.main : theme.palette.text.secondary,
          }}
        >
          Reset {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </Button>
      </Box>

      {/* Active Filter Chips Bar (if any filter is selected) */}
      {activeFilterCount > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            pt: 1,
            borderTop: `1px dashed ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '0.75rem',
            }}
          >
            <FilterAltIcon sx={{ fontSize: 15 }} />
            Active Filters ({activeFilterCount}):
          </Typography>

          {filters.dateRange !== '30d' && (
            <Chip
              label={`Window: ${filters.dateRange}`}
              size="small"
              onDelete={() => setFilter('dateRange', '30d')}
              color="primary"
              variant="outlined"
            />
          )}

          {filters.department !== 'All' && (
            <Chip
              label={`Dept: ${filters.department}`}
              size="small"
              onDelete={() => setFilter('department', 'All')}
              color="primary"
              variant="outlined"
            />
          )}

          {filters.location !== 'All' && (
            <Chip
              label={`Location: ${filters.location}`}
              size="small"
              onDelete={() => setFilter('location', 'All')}
              color="primary"
              variant="outlined"
            />
          )}

          {filters.status !== 'All' && (
            <Chip
              label={`Status: ${filters.status}`}
              size="small"
              onDelete={() => setFilter('status', 'All')}
              color="primary"
              variant="outlined"
            />
          )}

          {filters.searchQuery.trim() !== '' && (
            <Chip
              label={`Search: "${filters.searchQuery}"`}
              size="small"
              onDelete={() => setFilter('searchQuery', '')}
              color="primary"
              variant="outlined"
            />
          )}

          <Button
            size="small"
            onClick={resetFilters}
            sx={{ fontSize: '0.75rem', ml: 'auto', p: 0.5 }}
          >
            Clear All
          </Button>
        </Box>
      )}
    </Paper>
  );
};
