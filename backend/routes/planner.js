const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, requirePlan } = require('../middleware/auth');

// ─── POST /api/planner/generate ───────────────────────────────────────────────
router.post('/generate', authenticate, requirePlan('pro'), async (req, res) => {
  const { examDate, targetPct } = req.body;

  if (!examDate || !targetPct) {
    return res.status(400).json({ error: 'examDate and targetPct are required' });
  }

  const today = new Date();
  const exam = new Date(examDate);
  const daysLeft = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

  if (daysLeft < 1) {
    return res.status(400).json({ error: 'Exam date must be in the future' });
  }

  try {
    // Get user profile to know class/stream
    const profileResult = await db.query(
      `SELECT up.class_id, up.stream_id, s.name AS stream
       FROM user_profiles up
       LEFT JOIN streams s ON s.id = up.stream_id
       WHERE up.user_id = $1`,
      [req.user.id]
    );
    const profile = profileResult.rows[0];

    // Get chapters for the user's subjects
    const chaptersResult = await db.query(
      `SELECT ch.id, ch.name AS chapter, sub.name AS subject
       FROM chapters ch
       JOIN subjects sub ON sub.id = ch.subject_id
       WHERE sub.stream_id = $1 AND sub.class_id = $2 AND ch.is_active = TRUE
       ORDER BY sub.name, ch.order_num`,
      [profile?.stream_id || 1, profile?.class_id || 2]
    );

    const chapters = chaptersResult.rows;
    const planData = [];
    let dayIdx = 0;

    for (const ch of chapters) {
      if (dayIdx >= daysLeft - 3) break;
      const date = new Date(today);
      date.setDate(today.getDate() + dayIdx);

      const tasks = [
        `Read ${ch.chapter} notes (30 min)`,
        `Solve 10 practice questions (20 min)`,
      ];
      if (targetPct >= 85) tasks.push(`Review PYQs for ${ch.chapter} (15 min)`);

      planData.push({
        date: date.toISOString().split('T')[0],
        subject: ch.subject,
        chapter: ch.chapter,
        chapterId: ch.id,
        tasks,
      });
      dayIdx++;
    }

    // Revision days
    for (let i = 0; i < Math.min(3, daysLeft); i++) {
      const date = new Date(exam);
      date.setDate(exam.getDate() - (2 - i));
      planData.push({
        date: date.toISOString().split('T')[0],
        subject: 'Revision',
        chapter: i === 2 ? 'Day before exam — rest & light review' : `Revision Day ${i + 1}`,
        tasks: i === 2
          ? ['Review formula sheet', 'Light practice only', 'Sleep on time']
          : ['Full syllabus revision', '1 mock test', 'Note weak areas'],
        isRevision: true,
      });
    }

    // Upsert study plan
    const result = await db.query(
      `INSERT INTO study_plans (user_id, exam_date, target_pct, plan_data)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE
         SET exam_date = $2, target_pct = $3, plan_data = $4, updated_at = NOW()
       RETURNING *`,
      [req.user.id, examDate, targetPct, JSON.stringify(planData)]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Planner error:', err);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
});

// ─── GET /api/planner/my ──────────────────────────────────────────────────────
router.get('/my', authenticate, requirePlan('pro'), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM study_plans WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'No plan found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

module.exports = router;
