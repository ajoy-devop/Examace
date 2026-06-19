const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, requirePlan, requireAdmin } = require('../middleware/auth');

// ─── GET /api/questions ───────────────────────────────────────────────────────
// Fetch questions with filters
router.get('/', authenticate, async (req, res) => {
  const { subject, chapter_id, difficulty, type, search, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Determine plan-based filter
    const planOrder = { free: ['free'], pro: ['free', 'pro'], topper: ['free', 'pro', 'topper'] };
    const planResult = await db.query(
      `SELECT plan FROM subscriptions WHERE user_id = $1 AND status = 'active' LIMIT 1`,
      [req.user.id]
    );
    const userPlan = planResult.rows[0]?.plan || 'free';
    const allowedPlans = planOrder[userPlan];

    let conditions = [`q.plan_required = ANY($1)`];
    let params = [allowedPlans];
    let pIdx = 2;

    if (subject) {
      conditions.push(`sub.name ILIKE $${pIdx++}`);
      params.push(subject);
    }
    if (chapter_id) {
      conditions.push(`q.chapter_id = $${pIdx++}`);
      params.push(chapter_id);
    }
    if (difficulty) {
      conditions.push(`q.difficulty = $${pIdx++}`);
      params.push(difficulty.toLowerCase());
    }
    if (type) {
      conditions.push(`q.type = $${pIdx++}`);
      params.push(type.toLowerCase().replace(' ', '_'));
    }
    if (search) {
      conditions.push(`(q.text ILIKE $${pIdx} OR ch.name ILIKE $${pIdx})`);
      params.push(`%${search}%`);
      pIdx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT q.id, q.text, q.type, q.difficulty, q.options, q.marks, q.is_pyq, q.pyq_year,
             ch.name AS chapter, sub.name AS subject, q.plan_required
      FROM questions q
      JOIN chapters ch ON ch.id = q.chapter_id
      JOIN subjects sub ON sub.id = ch.subject_id
      ${where}
      ORDER BY q.created_at DESC
      LIMIT $${pIdx} OFFSET $${pIdx + 1}
    `;
    params.push(parseInt(limit), parseInt(offset));

    const countQuery = `
      SELECT COUNT(*) FROM questions q
      JOIN chapters ch ON ch.id = q.chapter_id
      JOIN subjects sub ON sub.id = ch.subject_id
      ${where}
    `;

    const [data, count] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, params.slice(0, -2)),
    ]);

    res.json({
      questions: data.rows,
      total: parseInt(count.rows[0].count),
      page: parseInt(page),
      pages: Math.ceil(count.rows[0].count / limit),
    });
  } catch (err) {
    console.error('Questions fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// ─── GET /api/questions/:id/answer ────────────────────────────────────────────
router.get('/:id/answer', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT correct_answer, solution FROM questions WHERE id = $1',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Question not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch answer' });
  }
});

// ─── POST /api/questions (Admin) ──────────────────────────────────────────────
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { chapter_id, type, difficulty, text, options, correct_answer, solution, marks, is_pyq, pyq_year, plan_required } = req.body;

  if (!chapter_id || !type || !difficulty || !text) {
    return res.status(400).json({ error: 'chapter_id, type, difficulty, and text are required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO questions (chapter_id, type, difficulty, text, options, correct_answer, solution, marks, is_pyq, pyq_year, plan_required, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [chapter_id, type, difficulty, text, JSON.stringify(options), correct_answer, solution, marks || 1, is_pyq || false, pyq_year, plan_required || 'free', req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// ─── PUT /api/questions/:id (Admin) ───────────────────────────────────────────
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { text, difficulty, options, correct_answer, solution, plan_required } = req.body;
  try {
    const result = await db.query(
      `UPDATE questions SET text=$1, difficulty=$2, options=$3, correct_answer=$4,
       solution=$5, plan_required=$6, updated_at=NOW() WHERE id=$7 RETURNING *`,
      [text, difficulty, JSON.stringify(options), correct_answer, solution, plan_required, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Question not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// ─── DELETE /api/questions/:id (Admin) ────────────────────────────────────────
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM questions WHERE id = $1', [req.params.id]);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

module.exports = router;
