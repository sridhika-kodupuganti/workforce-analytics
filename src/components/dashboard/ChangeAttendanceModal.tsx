import React, { useState } from 'react';
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
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  IconButton,
  Alert,
  Divider,
  alpha,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import { useWorkforce } from '../../context/useWorkforce.ts';
import type { AttendanceStatus, Employee } from '../../types/workforce.ts';

interface StatusOption {
  value: Exclude<AttendanceStatus, 'All'>;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: 'success' | 'info' | 'warning' | 'error' | 'secondary' | 'primary';
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'Present',
    label: 'Present (On-Site)',
    description: 'Working at designated office / facility',
    icon: <CheckCircleOutlinedIcon fontSize="small" />,
    color: 'success',
  },
  {
    value: 'Remote',
    label: 'Remote (WFH)',
    description: 'Working remotely from approved home location',
    icon: <HomeWorkIcon fontSize="small" />,
    color: 'info',
  },
  {
    value: 'On Leave',
    label: 'On Leave (PTO)',
    description: 'Approved paid/unpaid leave or medical absence',
    icon: <BeachAccessIcon fontSize="small" />,
    color: 'warning',
  },
  {
    value: 'Absent',
    label: 'Absent',
    description: 'Unscheduled absence or unavailable',
    icon: <CancelOutlinedIcon fontSize="small" />,
    color: 'error',
  },
  {
    value: 'Overtime',
    label: 'Overtime Shift',
    description: 'Extended hours past standard work schedule',
    icon: <MoreTimeIcon fontSize="small" />,
    color: 'secondary',
  },
  {
    value: 'Half-Day',
    label: 'Half-Day',
    description: '4-hour partial morning or afternoon shift',
    icon: <HistoryToggleOffIcon fontSize="small" />,
    color: 'primary',
  },
];

interface DialogContentProps {
  employee: Employee;
  onClose: () => void;
}

const ChangeAttendanceDialogContent: React.FC<DialogContentProps> = ({ employee, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { updateStatus } = useWorkforce();

  const [selectedStatus, setSelectedStatus] = useState<Exclude<AttendanceStatus, 'All'>>(employee.status);
  const [clockInTime, setClockInTime] = useState<string>(employee.clockInTime || '08:30 AM');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSetCurrentTime = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    setClockInTime(timeStr);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateStatus(employee.id, selectedStatus, clockInTime);
      setSuccessNotice(`Attendance successfully updated to ${selectedStatus} for ${employee.name}`);
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 700);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3.5,
            border: `1px solid ${theme.palette.divider}`,
            backgroundImage: 'none',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <AccessTimeIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Log & Modify Attendance
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Update real-time presence record & shift logs
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5 }}>
        {/* Employee Header Card */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.8,
            mb: 2.5,
            borderRadius: 2.5,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : alpha(theme.palette.primary.main, 0.04),
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Avatar
            alt={employee.name}
            sx={{
              width: 44,
              height: 44,
              fontSize: '1rem',
              fontWeight: 700,
              backgroundColor: alpha(theme.palette.primary.main, 0.18),
              color: theme.palette.primary.main,
              border: `2px solid ${theme.palette.primary.main}`,
            }}
          >
            {employee.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {employee.name}
              </Typography>
              <Chip
                label={`Current: ${employee.status}`}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.675rem', fontWeight: 600 }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {employee.role} · {employee.department} · {employee.location}
            </Typography>
          </Box>
        </Box>

        {successNotice && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {successNotice}
          </Alert>
        )}

        {/* Status Selection Grid */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.2 }}>
          Select New Status
        </Typography>

        <RadioGroup
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
        >
          <Grid container spacing={1.2} sx={{ mb: 2.5 }}>
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = selectedStatus === opt.value;
              return (
                <Grid size={{ xs: 12, sm: 6 }} key={opt.value}>
                  <Box
                    onClick={() => setSelectedStatus(opt.value)}
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      cursor: 'pointer',
                      border: `1.5px solid ${isSelected ? theme.palette[opt.color === 'secondary' ? 'primary' : opt.color].main : theme.palette.divider}`,
                      backgroundColor: isSelected
                        ? alpha(theme.palette[opt.color === 'secondary' ? 'primary' : opt.color].main, isDark ? 0.15 : 0.08)
                        : 'transparent',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette[opt.color === 'secondary' ? 'primary' : opt.color].main, isDark ? 0.1 : 0.04),
                      },
                    }}
                  >
                    <FormControlLabel
                      value={opt.value}
                      control={<Radio size="small" color={opt.color} sx={{ p: 0.3 }} />}
                      label=""
                      sx={{ m: 0 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Typography variant="body2" sx={{ fontWeight: isSelected ? 700 : 600, fontSize: '0.825rem' }}>
                          {opt.label}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.7rem', display: 'block', mt: 0.2 }}>
                        {opt.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </RadioGroup>

        <Divider sx={{ my: 2 }} />

        {/* Time and Notes Form */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.2 }}>
          Shift Details & Audit Note
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <TextField
                size="small"
                label="Clock-In Time"
                value={clockInTime}
                onChange={(e) => setClockInTime(e.target.value)}
                placeholder="e.g. 08:30 AM"
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <Button
                        size="small"
                        onClick={handleSetCurrentTime}
                        sx={{ fontSize: '0.7rem', py: 0.2, px: 0.8, minWidth: 'auto', textTransform: 'none' }}
                      >
                        Now
                      </Button>
                    ),
                  },
                }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              size="small"
              label="Manager Approval / Reason Note"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Remote work request approved"
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.8 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSubmitting}
          startIcon={<CheckCircleIcon />}
          sx={{ minWidth: 140 }}
        >
          {isSubmitting ? 'Saving...' : 'Apply Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const ChangeAttendanceModal: React.FC = () => {
  const { attendanceModalEmployee, setAttendanceModalEmployee } = useWorkforce();

  if (!attendanceModalEmployee) return null;

  return (
    <ChangeAttendanceDialogContent
      key={attendanceModalEmployee.id}
      employee={attendanceModalEmployee}
      onClose={() => setAttendanceModalEmployee(null)}
    />
  );
};
