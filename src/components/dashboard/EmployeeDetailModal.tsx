import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Grid,
  useTheme,
  IconButton,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import BadgeIcon from '@mui/icons-material/Badge';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WorkIcon from '@mui/icons-material/Work';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { useWorkforce } from '../../context/useWorkforce.ts';

export const EmployeeDetailModal: React.FC = () => {
  const theme = useTheme();
  const { selectedEmployee, setSelectedEmployee, updateStatus, setAttendanceModalEmployee } = useWorkforce();

  if (!selectedEmployee) return null;

  const isDark = theme.palette.mode === 'dark';

  return (
    <Dialog
      open={Boolean(selectedEmployee)}
      onClose={() => setSelectedEmployee(null)}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
            backgroundImage: 'none',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Employee Profile & Timecard
        </Typography>
        <IconButton size="small" onClick={() => setSelectedEmployee(null)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5 }}>
        {/* Header Hero */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            alt={selectedEmployee.name}
            sx={{
              width: 64,
              height: 64,
              fontSize: '1.5rem',
              fontWeight: 800,
              backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.22 : 0.12),
              color: theme.palette.primary.main,
              border: `3px solid ${theme.palette.primary.main}`,
            }}
          >
            {selectedEmployee.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, fontSize: '1.25rem' }}>
                {selectedEmployee.name}
              </Typography>
              <Chip
                label={selectedEmployee.status}
                size="small"
                color={
                  selectedEmployee.status === 'Present'
                    ? 'success'
                    : selectedEmployee.status === 'Remote'
                      ? 'primary'
                      : selectedEmployee.status === 'Absent'
                        ? 'error'
                        : selectedEmployee.status === 'Overtime'
                          ? 'secondary'
                          : 'warning'
                }
                sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.2 }}>
              {selectedEmployee.role} · {selectedEmployee.department}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
              ID: {selectedEmployee.id}
            </Typography>
          </Box>
        </Box>

        {/* 2-Column Info Grid */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmailIcon fontSize="inherit" /> Email Address
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                {selectedEmployee.email}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PlaceIcon fontSize="inherit" /> Assigned Hub
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                {selectedEmployee.location}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WorkIcon fontSize="inherit" /> Work Model & Contract
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                {selectedEmployee.workModel} · {selectedEmployee.employmentType}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ScheduleIcon fontSize="inherit" /> Clock-in & Hours Today
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                {selectedEmployee.clockInTime || 'Not logged'} ({selectedEmployee.hoursWorkedToday} hrs)
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <DateRangeIcon fontSize="inherit" /> Tenure & Join Date
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                {selectedEmployee.joinDate}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <BadgeIcon fontSize="inherit" /> Overtime Logged (Month)
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5, color: selectedEmployee.overtimeHoursThisMonth > 10 ? theme.palette.error.main : 'inherit' }}>
                {selectedEmployee.overtimeHoursThisMonth} hours
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Quick Attendance Change Bar */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2.5,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : alpha(theme.palette.primary.main, 0.04),
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <ScheduleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
              Change Attendance Status
            </Typography>
            <Button
              size="small"
              variant="text"
              onClick={() => {
                const emp = selectedEmployee;
                setSelectedEmployee(null);
                setAttendanceModalEmployee(emp);
              }}
              sx={{ fontSize: '0.75rem', textTransform: 'none' }}
            >
              Open Full Editor
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant={selectedEmployee.status === 'Present' ? 'contained' : 'outlined'}
              color="success"
              onClick={() => updateStatus(selectedEmployee.id, 'Present')}
              startIcon={<CheckCircleIcon />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Present
            </Button>
            <Button
              size="small"
              variant={selectedEmployee.status === 'Remote' ? 'contained' : 'outlined'}
              color="info"
              onClick={() => updateStatus(selectedEmployee.id, 'Remote')}
              startIcon={<LaptopMacIcon />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Remote
            </Button>
            <Button
              size="small"
              variant={selectedEmployee.status === 'On Leave' ? 'contained' : 'outlined'}
              color="warning"
              onClick={() => updateStatus(selectedEmployee.id, 'On Leave')}
              startIcon={<FlightTakeoffIcon />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              On Leave
            </Button>
            <Button
              size="small"
              variant={selectedEmployee.status === 'Absent' ? 'contained' : 'outlined'}
              color="error"
              onClick={() => updateStatus(selectedEmployee.id, 'Absent')}
              startIcon={<DoDisturbIcon />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Absent
            </Button>
            <Button
              size="small"
              variant={selectedEmployee.status === 'Overtime' ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => updateStatus(selectedEmployee.id, 'Overtime')}
              startIcon={<MoreTimeIcon />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Overtime
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button onClick={() => setSelectedEmployee(null)} color="inherit">
          Close
        </Button>
        <Button
          variant="contained"
          startIcon={<CheckCircleIcon />}
          onClick={async () => {
            if (selectedEmployee) {
              await updateStatus(selectedEmployee.id, 'Present');
              setSelectedEmployee(null);
            }
          }}
        >
          Verify Attendance (Present)
        </Button>
      </DialogActions>
    </Dialog>
  );
};
