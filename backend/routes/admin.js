const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(authenticate, requireAdmin);

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [users, subs, payments, questions, tests] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users'),
      db.query(`SELECT plan, COUNT(*) FROM subscriptions WHERE status='active' GROUP BY plan`),
      db.query(`SELECT SUM(amount_paise) FROM payments WHERE status='success'`),
      db.query('SELECT COUNT(*) FROM questions'),
      db.query('SELECT COUNT(*) FROM test_results'),
    ]);

    const subMap = {};
    for (const row of subs.rows) subMap[row.plan] = parseInt(row.count);

    res.json({
      totalUsers: parseInt(users.rows[0].count),
      subscriptions: subMap,
      revenue: parseInt(payments.rows[0].sum || 0) / 100,
      totalQuestions: parseInt(questions.rows[0].count),
      totalTestsTaken: parseInt(tests.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  const { search, plan, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    let conditions = [];
    let params = [];
    let pIdx = 1;
    if (search) {
      conditions.push(`(u.name ILIKE $${pIdx} OR u.email ILIKE $${pIdx})`);
      params.push(`%${search}%`);
      pIdx++;
    }
    if (plan) {
      conditions.push(`s.plan = $${pIdx++}`);
      params.push(plan);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.is_active, u.created_at,
              up.onboarded, c.name AS class_name, st.name AS stream_name,
              s.plan
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.id
       LEFT JOIN classes c ON c.id = up.class_id
       LEFT JOIN streams st ON st.id = up.stream_id
       LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
       ${where}
       ORDER BY u.created_at DESC
       LIMIT $${pIdx} OFFSET $${pIdx + 1}`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ─── PATCH /api/admin/users/:id ───────────────────────────────────────────────
router.patch('/users/:id', async (req, res) => {
  const { is_active, role } = req.body;
  try {
    const result = await db.query(
      `UPDATE users SET is_active = COALESCE($1, is_active), role = COALESCE($2, role),
       updated_at = NOW() WHERE id = $3 RETURNING id, name, email, role, is_active`,
      [is_active, role, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ─── GET /api/admin/subjects ──────────────────────────────────────────────────
router.get('/subjects', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT sub.*, COUNT(ch.id) AS chapter_count,
              COUNT(q.id) AS question_count,
              s.name AS stream_name, c.name AS class_name
       FROM subjects sub
       LEFT JOIN chapters ch ON ch.subject_id = sub.id
       LEFT JOIN questions q ON q.chapter_id = ch.id
       LEFT JOIN streams s ON s.id = sub.stream_id
       LEFT JOIN classes c ON c.id = sub.class_id
       GROUP BY sub.id, s.name, c.name
       ORDER BY sub.name`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// ─── POST /api/admin/subjects ─────────────────────────────────────────────────
router.post('/subjects', async (req, res) => {
  const { name, stream_id, class_id } = req.body;
  if (!name || !stream_id || !class_id) {
    return res.status(400).json({ error: 'name, stream_id, and class_id are required' });
  }
  try {
    const result = await db.query(
      'INSERT INTO subjects (name, stream_id, class_id) VALUES ($1,$2,$3) RETURNING *',
      [name, stream_id, class_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

// ─── POST /api/admin/chapters ─────────────────────────────────────────────────
router.post('/chapters', async (req, res) => {
  const { subject_id, name, order_num } = req.body;
  if (!subject_id || !name) return res.status(400).json({ error: 'subject_id and name required' });
  try {
    const result = await db.query(
      'INSERT INTO chapters (subject_id, name, order_num) VALUES ($1,$2,$3) RETURNING *',
      [subject_id, name, order_num || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create chapter' });
  }
});

// ─── GET /api/admin/payments ──────────────────────────────────────────────────
router.get('/payments', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, u.name AS user_name, u.email AS user_email
       FROM payments p
       JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC
       LIMIT 100`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports = router;
