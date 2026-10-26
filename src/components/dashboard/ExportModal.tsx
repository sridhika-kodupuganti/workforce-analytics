import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  FormGroup,
  IconButton,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TableChartIcon from '@mui/icons-material/TableChart';
import { useWorkforce } from '../../context/useWorkforce.ts';

export const ExportModal: React.FC = () => {
  const { isExportOpen, setIsExportOpen, filteredEmployees } = useWorkforce();
  const [format, setFormat] = useState<'csv' | 'json' | 'summary'>('csv');
  const [includeEmployees, setIncludeEmployees] = useState(true);
  const [includeAttendance, setIncludeAttendance] = useState(true);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isExportOpen) return null;

  const handleExport = () => {
    if (format === 'csv') {
      // Generate CSV string
      const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Location', 'Status', 'WorkModel', 'HoursToday', 'OvertimeHours'];
      const rows = filteredEmployees.map((e) => [
        e.id,
        `"${e.name}"`,
        e.email,
        `"${e.role}"`,
        `"${e.department}"`,
        `"${e.location}"`,
        e.status,
        e.workModel,
        e.hoursWorkedToday,
        e.overtimeHoursThisMonth,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `workforce_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredEmployees, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', dataStr);
      link.setAttribute('download', `workforce_data_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setIsExportOpen(false);
    }, 1200);
  };

  return (
    <Dialog
      open={isExportOpen}
      onClose={() => setIsExportOpen(false)}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TableChartIcon color="primary" fontSize="small" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Export Analytics Report
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => setIsExportOpen(false)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2 }}>
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Report generated and downloaded successfully!
          </Alert>
        )}

        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend" sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>
            Choose File Format
          </FormLabel>
          <RadioGroup value={format} onChange={(e) => setFormat(e.target.value as any)}>
            <FormControlLabel
              value="csv"
              control={<Radio size="small" />}
              label="CSV Spreadsheets (.csv) — Recommended"
            />
            <FormControlLabel
              value="json"
              control={<Radio size="small" />}
              label="JSON Raw Object Data (.json)"
            />
            <FormControlLabel
              value="summary"
              control={<Radio size="small" />}
              label="Executive Executive Briefing (.pdf summary)"
            />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>
            Included Modules ({filteredEmployees.length} matching records)
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={includeEmployees}
                  onChange={(e) => setIncludeEmployees(e.target.checked)}
                />
              }
              label="Employee Directory & Attendance Roster"
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={includeAttendance}
                  onChange={(e) => setIncludeAttendance(e.target.checked)}
                />
              }
              label="30-day Time-series & Department Metrics"
            />
          </FormGroup>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button onClick={() => setIsExportOpen(false)} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
        >
          Download Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};
