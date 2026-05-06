// server.js — Smart Hostel Management System Backend
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: '*',          // Restrict to your frontend domain in production
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve frontend (smart_hostel.html) ───────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/complaints',require('./routes/complaints'));
app.use('/api/ragging',   require('./routes/ragging'));
app.use('/api/notices',   require('./routes/notices'));
app.use('/api/menu',      require('./routes/menu'));
app.use('/api/students',  require('./routes/students'));

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Catch-all → serve frontend for SPA navigation ────────────
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'smart_hostel.html'));
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'An unexpected server error occurred.' });
});

// ── Start server ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🏨  Smart Hostel Management System`);
  console.log(`🚀  Server running at http://localhost:${PORT}`);
  console.log(`📋  API base:         http://localhost:${PORT}/api`);
  console.log(`🌐  Frontend:         http://localhost:${PORT}\n`);
});

module.exports = app;