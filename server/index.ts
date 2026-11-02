import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyticsRoutes from './routes/analyticsRoutes.ts';
import employeeRoutes from './routes/employeeRoutes.ts';
import { getDatabase, closeDatabase } from './db/database.ts';
import { seedDatabase } from './db/seed.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for development
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  try {
    const db = getDatabase();
    const result = db.prepare('SELECT COUNT(*) as empCount FROM employees').get() as { empCount: number };
    res.json({
      status: 'healthy',
      database: 'connected (SQLite)',
      employeesCount: result.empCount,
      timestamp: new Date().toISOString(),
      version: '2.0.0',
    });
  } catch (error: any) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Database Seed / Reset Endpoint (Useful for test validation)
app.post('/api/seed', (_req, res) => {
  try {
    seedDatabase();
    res.json({ success: true, message: 'Database reseeded successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mount Routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api', employeeRoutes);

// 404 handler for API routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ success: false, error: `API endpoint ${req.method} ${req.path} not found` });
  } else {
    res.status(404).send('Not Found');
  }
});

// Auto-seed if database is empty
const db = getDatabase();
const count = (db.prepare('SELECT COUNT(*) as count FROM employees').get() as { count: number })?.count || 0;
if (count === 0) {
  console.log('Database appears empty, running initial seed...');
  seedDatabase();
}

// Start Server
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Workforce Analytics Backend REST API is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`💾 SQLite Database: workforce.sqlite`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Employees API: http://localhost:${PORT}/api/employees`);
  console.log(`📊 Analytics KPIs: http://localhost:${PORT}/api/analytics/kpis`);
  console.log(`======================================================\n`);
});

// Graceful Shutdown
const handleShutdown = () => {
  console.log('\nShutting down server gracefully...');
  server.close(() => {
    closeDatabase();
    console.log('Database connection closed.');
    process.exit(0);
  });
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

export default app;
