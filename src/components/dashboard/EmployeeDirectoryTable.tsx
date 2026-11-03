import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ClearIcon from '@mui/icons-material/Clear';
import { useWorkforce } from '../../context/useWorkforce.ts';
import type { Employee, EmployeeSortField, SortOrder, AttendanceStatus } from '../../types/workforce.ts';

export const EmployeeDirectoryTable: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const {
    filteredEmployees,
    setSelectedEmployee,
    setAttendanceModalEmployee,
    filters,
    setFilter,
    resetFilters,
    updateStatus,
  } = useWorkforce();

  // Local sorting state
  const [sortField, setSortField] = useState<EmployeeSortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Local pagination state
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // Quick Action Menu state
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeMenuEmployee, setActiveMenuEmployee] = useState<Employee | null>(null);

  const handleSort = (field: EmployeeSortField) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort filtered employees
  const sortedEmployees = React.useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredEmployees, sortField, sortOrder]);

  // Paginate
  const paginatedEmployees = React.useMemo(() => {
    const start = page * rowsPerPage;
    return sortedEmployees.slice(start, start + rowsPerPage);
  }, [sortedEmployees, page, rowsPerPage]);

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return {
          bg: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
          text: theme.palette.success.main,
          border: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.25)',
        };
      case 'Remote':
        return {
          bg: isDark ? 'rgba(14, 165, 233, 0.15)' : 'rgba(14, 165, 233, 0.1)',
          text: theme.palette.info.main,
          border: isDark ? 'rgba(14, 165, 233, 0.3)' : 'rgba(14, 165, 233, 0.25)',
        };
      case 'Overtime':
        return {
          bg: isDark ? 'rgba(192, 132, 252, 0.15)' : 'rgba(124, 58, 237, 0.1)',
          text: isDark ? '#C084FC' : '#7C3AED',
          border: isDark ? 'rgba(192, 132, 252, 0.3)' : 'rgba(124, 58, 237, 0.25)',
        };
      case 'On Leave':
        return {
          bg: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
          text: theme.palette.warning.main,
          border: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.25)',
        };
      case 'Absent':
        return {
          bg: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
          text: theme.palette.error.main,
          border: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)',
        };
      default:
        return {
          bg: theme.palette.action.hover,
          text: theme.palette.text.secondary,
          border: theme.palette.divider,
        };
    }
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, emp: Employee) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setActiveMenuEmployee(emp);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setActiveMenuEmployee(null);
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.85) : alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(12px)',
        boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 10px 25px rgba(0, 0, 0, 0.03)',
        mb: 3,
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                Workforce Directory & Attendance Roster
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.3 }}>
                Showing <strong>{filteredEmployees.length}</strong> employees · Server-side search, multi-column sorting & pagination
              </Typography>
            </Box>

            {/* Quick in-table Search & Reset */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search staff, role, ID..."
                value={filters.searchQuery}
                onChange={(e) => setFilter('searchQuery', e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                    endAdornment: filters.searchQuery ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setFilter('searchQuery', '')}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
                sx={{
                  minWidth: { xs: 200, sm: 260 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : alpha(theme.palette.primary.main, 0.03),
                  },
                }}
              />

              {filters.searchQuery && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={resetFilters}
                  startIcon={<FilterListIcon />}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          </Box>
        }
        sx={{ pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}
      />

      <CardContent sx={{ p: 0 }}>
        <TableContainer sx={{ maxHeight: 620 }}>
          <Table stickyHeader aria-label="workforce directory table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, backgroundColor: isDark ? theme.palette.background.paper : alpha(theme.palette.primary.main, 0.03) }}>
                  <TableSortLabel
                    active={sortField === 'name'}
                    direction={sortField === 'name' ? sortOrder : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Employee
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: isDark ? theme.palette.background.paper : alpha(theme.palette.primary.main, 0.03) }}>
                  <TableSortLabel
                    active={sortField === 'role'}
                    direction={sortField === 'role' ? sortOrder : 'asc'}
                    onClick={() => handleSort('role')}
                  >
                    Role & Title
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: isDark ? theme.palette.background.paper : alpha(theme.palette.primary.main, 0.03) }}>
                  <TableSortLabel
                    active={sortField === 'department'}
                    direction={sortField === 'department' ? sortOrder : 'asc'}
                    onClick={() => handleSort('department')}
                  >
                    Department
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: isDark ? theme.palette.background.paper : alpha(theme.palette.primary.main, 0.03) }}>
                  <TableSortLabel
                    active={sortField === 'location'}
                    direction={sortField === 'location' ? sortOrder : 'asc'}
                    onClick={() => handleSort('location')}
                  >
                    Hub / Location
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: isDark ? theme.palette.background.paper : alpha(theme.palette.primary.main, 0.03) }}>
                  Work Model
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: isDark ? theme.palette.background.paper : alpha(theme.palette.primary.main, 0.03) }}>
                  <TableSortLabel
                    active={sortField === 'status'}
                    direction={sortField === 'status' ? sortOrder : 'asc'}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, backgroundColor: isDark ? theme.palette.background.paper : alpha(theme.palette.primary.main, 0.03) }}>
                  <TableSortLabel
                    active={sortField === 'hoursWorkedToday'}
                    direction={sortField === 'hoursWorkedToday' ? sortOrder : 'asc'}
                    onClick={() => handleSort('hoursWorkedToday')}
                  >
                    Hours Today
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, backgroundColor: isDark ? theme.palette.background.paper : alpha(theme.palette.primary.main, 0.03) }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 1, fontWeight: 600 }}>
                      No matching employee records found
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                      Try adjusting your search criteria, department, or location filters.
                    </Typography>
                    <Button variant="outlined" size="small" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEmployees.map((emp) => {
                  const statusStyle = getStatusColor(emp.status);
                  return (
                    <TableRow
                      key={emp.id}
                      hover
                      onClick={() => setSelectedEmployee(emp)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.08 : 0.04),
                        },
                      }}
                    >
                      {/* Name & ID */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            src={emp.avatar}
                            alt={emp.name}
                            sx={{ width: 38, height: 38, border: `2px solid ${theme.palette.divider}` }}
                          >
                            {emp.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {emp.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              {emp.id} · {emp.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {emp.role}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          {emp.employmentType}
                        </Typography>
                      </TableCell>

                      {/* Department */}
                      <TableCell>
                        <Chip
                          label={emp.department}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.75rem',
                            borderColor: theme.palette.divider,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        <Typography variant="body2">{emp.location}</Typography>
                      </TableCell>

                      {/* Work Model */}
                      <TableCell>
                        <Chip
                          icon={<LaptopMacIcon sx={{ fontSize: '13px !important' }} />}
                          label={emp.workModel}
                          size="small"
                          sx={{
                            fontSize: '0.72rem',
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                          }}
                        />
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={emp.status}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            border: `1px solid ${statusStyle.border}`,
                          }}
                        />
                        {emp.clockInTime && (
                          <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, mt: 0.3 }}>
                            In: {emp.clockInTime}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Hours Today */}
                      <TableCell align="right">
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {emp.hoursWorkedToday.toFixed(1)}h
                          </Typography>
                        </Box>
                        {emp.overtimeHoursThisMonth > 0 && (
                          <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary }}>
                            +{emp.overtimeHoursThisMonth}h OT
                          </Typography>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="View Profile">
                            <IconButton size="small" onClick={() => setSelectedEmployee(emp)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Update Attendance Record">
                            <IconButton
                              size="small"
                              aria-label={`Update attendance for ${emp.name}`}
                              onClick={() => setAttendanceModalEmployee(emp)}
                              sx={{
                                color: theme.palette.primary.main,
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : alpha(theme.palette.primary.main, 0.08),
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.15),
                                },
                              }}
                            >
                              <AccessTimeIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Quick Actions">
                            <IconButton size="small" onClick={(e) => openMenu(e, emp)}>
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Server-side compatible Table Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={sortedEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
          }}
        />
      </CardContent>

      {/* Row Quick Action Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            if (activeMenuEmployee) setSelectedEmployee(activeMenuEmployee);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Full Timecard & Details</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (activeMenuEmployee) setAttendanceModalEmployee(activeMenuEmployee);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <AccessTimeIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Change Attendance & Shift...</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={async () => {
            if (activeMenuEmployee) {
              await updateStatus(activeMenuEmployee.id, 'Present');
            }
            closeMenu();
          }}
        >
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Mark as Clocked In (Present)</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={async () => {
            if (activeMenuEmployee) {
              await updateStatus(activeMenuEmployee.id, 'Remote');
            }
            closeMenu();
          }}
        >
          <ListItemIcon>
            <LaptopMacIcon fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText>Mark as Remote Active</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={async () => {
            if (activeMenuEmployee) {
              await updateStatus(activeMenuEmployee.id, 'On Leave');
            }
            closeMenu();
          }}
        >
          <ListItemIcon>
            <FlightTakeoffIcon fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>Log Approved Leave</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={async () => {
            if (activeMenuEmployee) {
              await updateStatus(activeMenuEmployee.id, 'Absent');
            }
            closeMenu();
          }}
        >
          <ListItemIcon>
            <DoDisturbIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Mark as Absent</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};
