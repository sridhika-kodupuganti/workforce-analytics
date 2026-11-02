import { getDatabase } from './database.ts';
import fs from 'fs';
import path from 'path';

export function seedDatabase() {
  const db = getDatabase();

  console.log('🌱 Starting SQLite Workforce database seeding...');

  const currentDir = import.meta.dirname || path.dirname(new URL(import.meta.url).pathname);
  const schemaPath = path.resolve(currentDir, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSql);

  // Check if already seeded
  const checkCount = db.prepare('SELECT COUNT(*) as count FROM employees').get() as { count: number };
  if (checkCount && checkCount.count > 0) {
    console.log(`ℹ️  Database already contains ${checkCount.count} employees. Resetting for fresh seed...`);
    db.exec('DELETE FROM activities; DELETE FROM attendance_records; DELETE FROM employees; DELETE FROM departments;');
  }

  // 1. Seed Departments
  const departments = [
    { name: 'Engineering', code: 'ENG', head: 'Alex Chen', budget: 1450000, target: 96.0 },
    { name: 'Product & Design', code: 'PRD', head: 'Sophia Vance', budget: 780000, target: 95.0 },
    { name: 'Sales', code: 'SLS', head: 'Marcus Thorne', budget: 950000, target: 94.0 },
    { name: 'Marketing', code: 'MKT', head: 'Elena Rostova', budget: 620000, target: 95.0 },
    { name: 'Human Resources', code: 'HR', head: 'Sarah Chen', budget: 410000, target: 97.0 },
    { name: 'Customer Success', code: 'CS', head: 'Priya Sharma', budget: 520000, target: 96.0 },
    { name: 'Finance & Ops', code: 'FIN', head: 'David Kim', budget: 590000, target: 98.0 },
  ];

  const insertDept = db.prepare(`
    INSERT INTO departments (name, code, head, budget, target_attendance_rate)
    VALUES (?, ?, ?, ?, ?)
  `);

  const deptIdMap: Record<string, number> = {};
  for (const dept of departments) {
    const res = insertDept.run(dept.name, dept.code, dept.head, dept.budget, dept.target);
    deptIdMap[dept.name] = Number(res.lastInsertRowid);
  }
  console.log(`✅ Seeded ${departments.length} departments.`);

  // 2. Comprehensive Seed Employees Data
  const locations = ['New York (HQ)', 'San Francisco', 'London', 'Singapore', 'Berlin', 'Remote'];
  
  const seedStaffData = [
    {
      id: 'EMP-001',
      name: 'Sarah Chen',
      email: 'sarah.chen@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      role: 'VP of People & Culture',
      department: 'Human Resources',
      location: 'New York (HQ)',
      employmentType: 'Full-time',
      workModel: 'Hybrid',
      status: 'Present',
      clockInTime: '08:42 AM',
      hoursWorkedToday: 7.5,
      overtimeHoursThisMonth: 4.0,
      joinDate: '2021-03-15',
      phone: '+1 (212) 555-0192',
    },
    {
      id: 'EMP-002',
      name: 'Julian Alvarez',
      email: 'julian.a@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      role: 'Lead Cloud Infrastructure Architect',
      department: 'Engineering',
      location: 'San Francisco',
      employmentType: 'Full-time',
      workModel: 'On-site',
      status: 'Present',
      clockInTime: '08:15 AM',
      hoursWorkedToday: 8.5,
      overtimeHoursThisMonth: 14.5,
      joinDate: '2020-07-01',
      phone: '+1 (415) 555-0144',
    },
    {
      id: 'EMP-003',
      name: 'Sridhika Kodupuganti',
      email: 'sridhika.k@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
      role: 'Senior Staff Frontend Architect',
      department: 'Engineering',
      location: 'New York (HQ)',
      employmentType: 'Full-time',
      workModel: 'Hybrid',
      status: 'Present',
      clockInTime: '08:30 AM',
      hoursWorkedToday: 8.0,
      overtimeHoursThisMonth: 12.0,
      joinDate: '2021-11-10',
      phone: '+1 (212) 555-0178',
    },
    {
      id: 'EMP-004',
      name: 'Priya Sharma',
      email: 'priya.s@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
      role: 'Head of Customer Experience',
      department: 'Customer Success',
      location: 'London',
      employmentType: 'Full-time',
      workModel: 'Hybrid',
      status: 'Present',
      clockInTime: '09:02 AM',
      hoursWorkedToday: 6.8,
      overtimeHoursThisMonth: 6.0,
      joinDate: '2022-01-20',
      phone: '+44 20 7946 0912',
    },
    {
      id: 'EMP-005',
      name: 'Marcus Thorne',
      email: 'marcus.t@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      role: 'Director of Enterprise Growth',
      department: 'Sales',
      location: 'New York (HQ)',
      employmentType: 'Full-time',
      workModel: 'On-site',
      status: 'Overtime',
      clockInTime: '07:45 AM',
      hoursWorkedToday: 9.8,
      overtimeHoursThisMonth: 18.0,
      joinDate: '2019-09-01',
      phone: '+1 (212) 555-0111',
    },
    {
      id: 'EMP-006',
      name: 'Elena Rostova',
      email: 'elena.r@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
      role: 'Global Brand Director',
      department: 'Marketing',
      location: 'Berlin',
      employmentType: 'Full-time',
      workModel: 'Hybrid',
      status: 'Remote',
      clockInTime: '09:10 AM',
      hoursWorkedToday: 6.5,
      overtimeHoursThisMonth: 2.0,
      joinDate: '2022-04-12',
      phone: '+49 30 1234567',
    },
    {
      id: 'EMP-007',
      name: 'David Kim',
      email: 'david.kim@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
      role: 'Head of Strategic Finance',
      department: 'Finance & Ops',
      location: 'Singapore',
      employmentType: 'Full-time',
      workModel: 'On-site',
      status: 'Present',
      clockInTime: '08:50 AM',
      hoursWorkedToday: 7.2,
      overtimeHoursThisMonth: 8.5,
      joinDate: '2020-02-14',
      phone: '+65 6789 0123',
    },
    {
      id: 'EMP-008',
      name: 'Amara Okafor',
      email: 'amara.o@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=256',
      role: 'Senior Staff Security Engineer',
      department: 'Engineering',
      location: 'London',
      employmentType: 'Full-time',
      workModel: 'Remote',
      status: 'Remote',
      clockInTime: '08:55 AM',
      hoursWorkedToday: 7.5,
      overtimeHoursThisMonth: 7.0,
      joinDate: '2021-08-01',
      phone: '+44 20 7946 0888',
    },
    {
      id: 'EMP-009',
      name: 'Liam Brennan',
      email: 'liam.b@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=256',
      role: 'Senior Product Designer',
      department: 'Product & Design',
      location: 'San Francisco',
      employmentType: 'Contractor',
      workModel: 'Hybrid',
      status: 'On Leave',
      clockInTime: undefined,
      hoursWorkedToday: 0,
      overtimeHoursThisMonth: 0,
      leaveType: 'Annual',
      joinDate: '2023-02-01',
      phone: '+1 (415) 555-0199',
    },
    {
      id: 'EMP-010',
      name: 'Zoe Martinez',
      email: 'zoe.m@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
      role: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'New York (HQ)',
      employmentType: 'Full-time',
      workModel: 'Hybrid',
      status: 'Absent',
      clockInTime: undefined,
      hoursWorkedToday: 0,
      overtimeHoursThisMonth: 0,
      leaveType: undefined,
      joinDate: '2022-09-15',
      phone: '+1 (212) 555-0155',
    },
    {
      id: 'EMP-011',
      name: 'Kai Takahashi',
      email: 'kai.t@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
      role: 'Senior Backend Engineer',
      department: 'Engineering',
      location: 'Singapore',
      employmentType: 'Full-time',
      workModel: 'On-site',
      status: 'Present',
      clockInTime: '08:45 AM',
      hoursWorkedToday: 7.8,
      overtimeHoursThisMonth: 10.0,
      joinDate: '2021-05-18',
      phone: '+65 6789 0456',
    },
    {
      id: 'EMP-012',
      name: 'Rachel Green',
      email: 'rachel.g@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=256',
      role: 'Senior Talent Acquisition Partner',
      department: 'Human Resources',
      location: 'London',
      employmentType: 'Full-time',
      workModel: 'Hybrid',
      status: 'Present',
      clockInTime: '09:05 AM',
      hoursWorkedToday: 6.9,
      overtimeHoursThisMonth: 3.5,
      joinDate: '2022-06-01',
      phone: '+44 20 7946 0777',
    },
    {
      id: 'EMP-013',
      name: 'Vikram Mehta',
      email: 'vikram.m@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
      role: 'Principal Database Architect',
      department: 'Engineering',
      location: 'New York (HQ)',
      employmentType: 'Full-time',
      workModel: 'Hybrid',
      status: 'Present',
      clockInTime: '08:20 AM',
      hoursWorkedToday: 8.2,
      overtimeHoursThisMonth: 16.0,
      joinDate: '2020-04-10',
      phone: '+1 (212) 555-0163',
    },
    {
      id: 'EMP-014',
      name: 'Chloe Dupont',
      email: 'chloe.d@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      role: 'Marketing Content Specialist',
      department: 'Marketing',
      location: 'Berlin',
      employmentType: 'Part-time',
      workModel: 'Remote',
      status: 'Remote',
      clockInTime: '09:30 AM',
      hoursWorkedToday: 4.5,
      overtimeHoursThisMonth: 0,
      joinDate: '2023-05-15',
      phone: '+49 30 7654321',
    },
    {
      id: 'EMP-015',
      name: 'Lucas Silva',
      email: 'lucas.s@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
      role: 'Enterprise Account Executive',
      department: 'Sales',
      location: 'San Francisco',
      employmentType: 'Full-time',
      workModel: 'On-site',
      status: 'Present',
      clockInTime: '08:35 AM',
      hoursWorkedToday: 7.7,
      overtimeHoursThisMonth: 9.0,
      joinDate: '2021-10-01',
      phone: '+1 (415) 555-0182',
    },
    {
      id: 'EMP-016',
      name: 'Nia Williams',
      email: 'nia.w@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256',
      role: 'Operations & Payroll Lead',
      department: 'Finance & Ops',
      location: 'New York (HQ)',
      employmentType: 'Full-time',
      workModel: 'Hybrid',
      status: 'On Leave',
      clockInTime: undefined,
      hoursWorkedToday: 0,
      overtimeHoursThisMonth: 0,
      leaveType: 'Sick',
      joinDate: '2020-11-20',
      phone: '+1 (212) 555-0198',
    },
    {
      id: 'EMP-017',
      name: 'Oliver Hansen',
      email: 'oliver.h@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
      role: 'Frontend UI/UX Developer',
      department: 'Engineering',
      location: 'Berlin',
      employmentType: 'Full-time',
      workModel: 'Hybrid',
      status: 'Present',
      clockInTime: '09:00 AM',
      hoursWorkedToday: 7.0,
      overtimeHoursThisMonth: 5.5,
      joinDate: '2022-03-01',
      phone: '+49 30 9876543',
    },
    {
      id: 'EMP-018',
      name: 'Maya Lin',
      email: 'maya.l@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
      role: 'Product Strategy Lead',
      department: 'Product & Design',
      location: 'Singapore',
      employmentType: 'Full-time',
      workModel: 'On-site',
      status: 'Present',
      clockInTime: '08:50 AM',
      hoursWorkedToday: 7.5,
      overtimeHoursThisMonth: 8.0,
      joinDate: '2021-07-15',
      phone: '+65 6789 0888',
    },
    {
      id: 'EMP-019',
      name: 'Darius Vance',
      email: 'darius.v@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=256',
      role: 'Growth Marketing Manager',
      department: 'Marketing',
      location: 'New York (HQ)',
      employmentType: 'Full-time',
      workModel: 'Hybrid',
      status: 'Present',
      clockInTime: '08:40 AM',
      hoursWorkedToday: 7.6,
      overtimeHoursThisMonth: 4.5,
      joinDate: '2022-08-10',
      phone: '+1 (212) 555-0133',
    },
    {
      id: 'EMP-020',
      name: 'Hana Tanaka',
      email: 'hana.t@workforceiq.corp',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256',
      role: 'Enterprise Support Engineer',
      department: 'Customer Success',
      location: 'Tokyo/Remote',
      employmentType: 'Full-time',
      workModel: 'Remote',
      status: 'Remote',
      clockInTime: '08:30 AM',
      hoursWorkedToday: 8.0,
      overtimeHoursThisMonth: 6.0,
      joinDate: '2023-01-10',
      phone: '+81 3 5555 0122',
    },
  ];

  // Generate 40 additional realistic employees to total 60 staff members across all departments
  const firstNames = ['James', 'Emma', 'Daniel', 'Grace', 'Benjamin', 'Mia', 'Samuel', 'Charlotte', 'Noah', 'Ava', 'Ethan', 'Harper', 'Alexander', 'Ella', 'William', 'Emily', 'Logan', 'Aria', 'Mason', 'Chloe', 'Lucas', 'Layla', 'Henry', 'Lily', 'Sebastian', 'Aubrey', 'Jack', 'Zoey', 'Owen', 'Penelope', 'Aiden', 'Riley', 'Elijah', 'Nora', 'Carter', 'Scarlett', 'Gabriel', 'Hannah', 'Jayden', 'Mila'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Miller', 'Wilson', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner'];
  const depts = ['Engineering', 'Product & Design', 'Sales', 'Marketing', 'Human Resources', 'Customer Success', 'Finance & Ops'];
  const roles = [
    'Software Engineer', 'Senior DevOps Engineer', 'Product Manager', 'UX Designer',
    'Account Executive', 'Sales Development Rep', 'Digital Marketer', 'Content Strategist',
    'HR Generalist', 'Technical Recruiter', 'CS Specialist', 'Financial Analyst',
  ];
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
  ];

  for (let i = 21; i <= 60; i++) {
    const fn = firstNames[(i - 21) % firstNames.length];
    const ln = lastNames[(i - 21) % lastNames.length];
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@workforceiq.corp`;
    const dept = depts[i % depts.length];
    const loc = locations[i % locations.length];
    const role = roles[i % roles.length];
    const avatar = avatars[i % avatars.length];

    // Status distribution: ~70% Present, 15% Remote, 8% On Leave, 5% Absent, 2% Overtime
    let status = 'Present';
    let leaveType = undefined;
    let clockIn = '08:45 AM';
    let hoursWorked = 7.5;
    let otHours = 3.0;

    const mod = i % 20;
    if (mod === 3 || mod === 7 || mod === 14) {
      status = 'Remote';
      clockIn = '09:00 AM';
    } else if (mod === 9 || mod === 18) {
      status = 'On Leave';
      leaveType = mod === 9 ? 'Annual' : 'Sick';
      clockIn = undefined;
      hoursWorked = 0;
      otHours = 0;
    } else if (mod === 12) {
      status = 'Absent';
      clockIn = undefined;
      hoursWorked = 0;
      otHours = 0;
    } else if (mod === 5 || mod === 17) {
      status = 'Overtime';
      clockIn = '07:30 AM';
      hoursWorked = 9.5;
      otHours = 14.0;
    }

    const empType = i % 15 === 0 ? 'Contractor' : i % 25 === 0 ? 'Intern' : 'Full-time';
    const workModel = loc === 'Remote' ? 'Remote' : (i % 3 === 0 ? 'On-site' : 'Hybrid');

    seedStaffData.push({
      id: `EMP-${i.toString().padStart(3, '0')}`,
      name,
      email,
      avatar,
      role,
      department: dept,
      location: loc,
      employmentType: empType,
      workModel,
      status,
      clockInTime: clockIn,
      hoursWorkedToday: hoursWorked,
      overtimeHoursThisMonth: otHours,
      leaveType,
      joinDate: `202${(i % 4) + 1}-0${(i % 9) + 1}-15`,
      phone: `+1 (555) 010-${(100 + i)}`,
    });
  }

  const insertEmp = db.prepare(`
    INSERT INTO employees (
      id, name, email, avatar, role, department_id, department, location,
      employment_type, work_model, status, clock_in_time, hours_worked_today,
      overtime_hours_this_month, leave_type, join_date, phone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const emp of seedStaffData) {
    const deptId = deptIdMap[emp.department] || 1;
    insertEmp.run(
      emp.id,
      emp.name,
      emp.email,
      emp.avatar,
      emp.role,
      deptId,
      emp.department,
      emp.location,
      emp.employmentType,
      emp.workModel,
      emp.status,
      emp.clockInTime || null,
      emp.hoursWorkedToday,
      emp.overtimeHoursThisMonth,
      emp.leaveType || null,
      emp.joinDate,
      emp.phone || null,
    );
  }
  console.log(`✅ Seeded ${seedStaffData.length} employees with strict typing.`);

  // 3. Seed 30 Days of Historical Attendance Telemetry for all employees
  const insertAttendance = db.prepare(`
    INSERT INTO attendance_records (
      employee_id, date, status, clock_in, clock_out, hours_worked, overtime_hours, work_location, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const today = new Date();
  const insertManyAttendance = db.transaction(() => {
    for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
      const d = new Date(today);
      d.setDate(d.getDate() - dayOffset);
      const dateStr = d.toISOString().split('T')[0];

      // Skip weekends
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      for (const emp of seedStaffData) {
        // Daily variation based on hash of employee id and day
        const seedVal = (emp.id.charCodeAt(5) || 1) + dayOffset;
        let dayStatus = 'Present';
        let hrs = 8.0;
        let ot = 0;

        if (seedVal % 17 === 0) {
          dayStatus = 'On Leave';
          hrs = 0;
        } else if (seedVal % 29 === 0) {
          dayStatus = 'Absent';
          hrs = 0;
        } else if (seedVal % 7 === 0 || emp.workModel === 'Remote') {
          dayStatus = 'Remote';
          hrs = 7.5;
        } else if (seedVal % 13 === 0) {
          dayStatus = 'Overtime';
          hrs = 9.5;
          ot = 1.5;
        }

        insertAttendance.run(
          emp.id,
          dateStr,
          dayStatus,
          dayStatus !== 'Absent' && dayStatus !== 'On Leave' ? '08:45 AM' : null,
          dayStatus !== 'Absent' && dayStatus !== 'On Leave' ? '05:15 PM' : null,
          hrs,
          ot,
          emp.location,
          dayStatus === 'Overtime' ? 'Sprint release deployment' : null,
        );
      }
    }
  });

  insertManyAttendance();
  console.log(`✅ Seeded 30 days of daily attendance telemetry.`);

  // 4. Seed Live Workforce Activities & Audit Logs
  const initialActivities = [
    {
      id: 'ACT-101',
      employee_id: 'EMP-002',
      employee_name: 'Julian Alvarez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      department: 'Engineering',
      role: 'Lead Cloud Infrastructure Architect',
      activity_type: 'Clock-in',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      status: 'Completed',
      details: 'Biometric Turnstile Gate B badge-in verified (San Francisco Office)',
    },
    {
      id: 'ACT-102',
      employee_id: 'EMP-003',
      employee_name: 'Sridhika Kodupuganti',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
      department: 'Engineering',
      role: 'Senior Staff Frontend Architect',
      activity_type: 'Clock-in',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      status: 'Completed',
      details: 'RFID Security Gate A turnstile badge-in verified (New York HQ)',
    },
    {
      id: 'ACT-103',
      employee_id: 'EMP-001',
      employee_name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      department: 'Human Resources',
      role: 'VP of People & Culture',
      activity_type: 'Leave Approved',
      timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
      status: 'Approved',
      details: 'Approved 3-day annual leave request for Liam Brennan (Product & Design)',
    },
    {
      id: 'ACT-104',
      employee_id: 'EMP-006',
      employee_name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
      department: 'Marketing',
      role: 'Global Brand Director',
      activity_type: 'Remote Check-in',
      timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
      status: 'Completed',
      details: 'Signed in via Secure VPN Gateway (Berlin Hub)',
    },
    {
      id: 'ACT-105',
      employee_id: 'EMP-005',
      employee_name: 'Marcus Thorne',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      department: 'Sales',
      role: 'Director of Enterprise Growth',
      activity_type: 'Overtime Logged',
      timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
      status: 'Completed',
      details: 'Logged 2.5 hours Q4 Enterprise Contract finalization session',
    },
    {
      id: 'ACT-106',
      employee_id: 'EMP-010',
      employee_name: 'Zoe Martinez',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
      department: 'Customer Success',
      role: 'Customer Success Manager',
      activity_type: 'Absent Reported',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      status: 'Flagged',
      details: 'No badge-in recorded by 10:00 AM; automated absence notification dispatched',
    },
  ];

  const insertActivity = db.prepare(`
    INSERT INTO activities (
      id, employee_id, employee_name, avatar, department, role, activity_type, timestamp, status, details
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const act of initialActivities) {
    insertActivity.run(
      act.id,
      act.employee_id,
      act.employee_name,
      act.avatar,
      act.department,
      act.role,
      act.activity_type,
      act.timestamp,
      act.status,
      act.details,
    );
  }

  console.log(`✅ Seeded ${initialActivities.length} real-time activity stream events.`);
  console.log('🎉 SQLite Workforce Database seeding completed successfully!\n');
}

// Direct CLI execution
if (process.argv[1]?.includes('seed')) {
  seedDatabase();
}

