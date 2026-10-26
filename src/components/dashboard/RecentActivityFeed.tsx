import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import { useWorkforce } from '../../context/useWorkforce.ts';
import type { ActivityItem } from '../../types/workforce.ts';

const getActivityIcon = (type: ActivityItem['activityType']) => {
  switch (type) {
    case 'Clock-in':
      return <LoginIcon fontSize="small" sx={{ color: '#10B981' }} />;
    case 'Clock-out':
      return <LogoutIcon fontSize="small" sx={{ color: '#64748B' }} />;
    case 'Leave Approved':
      return <CheckCircleIcon fontSize="small" sx={{ color: '#0EA5E9' }} />;
    case 'Leave Requested':
      return <PendingActionsIcon fontSize="small" sx={{ color: '#F59E0B' }} />;
    case 'Remote Check-in':
      return <WifiTetheringIcon fontSize="small" sx={{ color: '#6366F1' }} />;
    case 'Overtime Logged':
      return <AccessTimeIcon fontSize="small" sx={{ color: '#EC4899' }} />;
    case 'Shift Swapped':
      return <SwapHorizIcon fontSize="small" sx={{ color: '#8B5CF6' }} />;
    default:
      return <HistoryIcon fontSize="small" />;
  }
};

const getStatusChip = (status: ActivityItem['status']) => {
  switch (status) {
    case 'Completed':
      return <Chip label="Completed" size="small" color="success" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600 }} />;
    case 'Approved':
      return <Chip label="Approved" size="small" color="info" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600 }} />;
    case 'Pending':
      return <Chip label="Pending" size="small" color="warning" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600 }} />;
    case 'Flagged':
      return <Chip label="Flagged" size="small" color="error" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600 }} />;
    default:
      return <Chip label={status} size="small" sx={{ height: 20, fontSize: '0.68rem' }} />;
  }
};

export const RecentActivityFeed: React.FC = () => {
  const theme = useTheme();
  const { filteredActivities, employees, setSelectedEmployee, viewState } = useWorkforce();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const isDark = theme.palette.mode === 'dark';

  if (viewState === 'loading') {
    return (
      <Card sx={{ p: 2.5, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="text" width="30%" height={28} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        {Array.from({ length: 4 }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1.5 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="80%" height={16} />
            </Box>
            <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 1 }} />
          </Box>
        ))}
      </Card>
    );
  }

  const handleRowClick = (employeeId: string) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (emp) {
      setSelectedEmployee(emp);
    }
  };

  const paginatedActivities = filteredActivities.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                backgroundColor: isDark ? 'rgba(52, 211, 153, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                color: theme.palette.success.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HistoryIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                Recent Workforce Activity
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Live clock-in events, shift handovers, and leave status updates
              </Typography>
            </Box>
          </Box>

          <Chip
            label={`${filteredActivities.length} Events`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.72rem' }}
          />
        </Box>

        {/* Table view */}
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, color: theme.palette.text.secondary, fontSize: '0.72rem' } }}>
                <TableCell>EMPLOYEE</TableCell>
                <TableCell>ACTIVITY</TableCell>
                <TableCell>DETAILS</TableCell>
                <TableCell>TIME</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell align="right">ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: theme.palette.text.secondary }}>
                    No recent activities matching the current filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedActivities.map((act) => (
                  <TableRow
                    key={act.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onClick={() => handleRowClick(act.employeeId)}
                  >
                    {/* Employee Avatar & Name */}
                    <TableCell sx={{ py: 1.2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Avatar
                          src={act.avatar}
                          alt={act.employeeName}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8125rem', lineHeight: 1.2 }}>
                            {act.employeeName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.7rem' }}>
                            {act.department}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Activity Type with Icon */}
                    <TableCell sx={{ py: 1.2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        {getActivityIcon(act.activityType)}
                        <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                          {act.activityType}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Details */}
                    <TableCell sx={{ py: 1.2, maxWidth: 300 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '0.75rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {act.details}
                      </Typography>
                    </TableCell>

                    {/* Timestamp */}
                    <TableCell sx={{ py: 1.2, whiteSpace: 'nowrap' }}>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.72rem' }}>
                        {act.timestamp}
                      </Typography>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell sx={{ py: 1.2 }}>
                      {getStatusChip(act.status)}
                    </TableCell>

                    {/* View Action */}
                    <TableCell align="right" sx={{ py: 1.2 }}>
                      <Tooltip title="View Profile & Logs">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(act.employeeId);
                          }}
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredActivities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.75rem',
            },
          }}
        />
      </CardContent>
    </Card>
  );
};
