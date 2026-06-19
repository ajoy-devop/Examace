const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, requirePlan } = require('../middleware/auth');

// ─── GET /api/tests ───────────────────────────────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT mt.id, mt.title, mt.description, mt.duration_mins, mt.total_marks,
              mt.plan_required, mt.created_at,
              COUNT(mtq.question_id) AS question_count,
              s.name AS subject
       FROM mock_tests mt
       LEFT JOIN mock_test_questions mtq ON mtq.mock_test_id = mt.id
       LEFT JOIN subjects s ON s.id = mt.subject_id
       WHERE mt.is_active = TRUE
       GROUP BY mt.id, s.name
       ORDER BY mt.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

// ─── GET /api/tests/:id ───────────────────────────────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
  try {
    const testResult = await db.query(
      'SELECT * FROM mock_tests WHERE id = $1 AND is_active = TRUE',
      [req.params.id]
    );
    if (!testResult.rows.length) return res.status(404).json({ error: 'Test not found' });

    const questionsResult = await db.query(
      `SELECT q.id, q.text, q.type, q.difficulty, q.options, q.marks,
              ch.name AS chapter, sub.name AS subject
       FROM questions q
       JOIN mock_test_questions mtq ON mtq.question_id = q.id
       JOIN chapters ch ON ch.id = q.chapter_id
       JOIN subjects sub ON sub.id = ch.subject_id
       WHERE mtq.mock_test_id = $1
       ORDER BY mtq.order_num`,
      [req.params.id]
    );

    res.json({
      test: testResult.rows[0],
      questions: questionsResult.rows,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch test' });
  }
});

// ─── POST /api/tests/:id/submit ───────────────────────────────────────────────
router.post('/:id/submit', authenticate, async (req, res) => {
  const { answers, timeTakenSecs } = req.body;

  try {
    const testResult = await db.query('SELECT * FROM mock_tests WHERE id = $1', [req.params.id]);
    if (!testResult.rows.length) return res.status(404).json({ error: 'Test not found' });

    const questionsResult = await db.query(
      `SELECT q.id, q.correct_answer, q.marks, sub.name AS subject
       FROM questions q
       JOIN mock_test_questions mtq ON mtq.question_id = q.id
       JOIN chapters ch ON ch.id = q.chapter_id
       JOIN subjects sub ON sub.id = ch.subject_id
       WHERE mtq.mock_test_id = $1`,
      [req.params.id]
    );

    // Calculate scores
    let totalScore = 0;
    const subjectScores = {};
    const subjectTotals = {};

    for (const q of questionsResult.rows) {
      const sub = q.subject;
      if (!subjectScores[sub]) { subjectScores[sub] = 0; subjectTotals[sub] = 0; }
      subjectTotals[sub] += q.marks;

      if (answers[q.id] && answers[q.id] === q.correct_answer) {
        totalScore += q.marks;
        subjectScores[sub] += q.marks;
      }
    }

    const totalMarks = testResult.rows[0].total_marks;
    const percentage = ((totalScore / totalMarks) * 100).toFixed(2);

    // Compute percentage per subject
    const subjectPcts = {};
    for (const [sub, score] of Object.entries(subjectScores)) {
      subjectPcts[sub] = Math.round((score / subjectTotals[sub]) * 100);
    }

    const insertResult = await db.query(
      `INSERT INTO test_results
         (user_id, mock_test_id, score, total_marks, percentage, time_taken_secs, answers, subject_scores, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING id`,
      [req.user.id, req.params.id, totalScore, totalMarks, percentage, timeTakenSecs,
       JSON.stringify(answers), JSON.stringify(subjectPcts)]
    );

    res.json({
      resultId: insertResult.rows[0].id,
      score: totalScore,
      totalMarks,
      percentage: parseFloat(percentage),
      subjectScores: subjectPcts,
    });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: 'Failed to submit test' });
  }
});

// ─── GET /api/tests/results/my ────────────────────────────────────────────────
router.get('/results/my', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT tr.*, mt.title AS test_title
       FROM test_results tr
       JOIN mock_tests mt ON mt.id = tr.mock_test_id
       WHERE tr.user_id = $1
       ORDER BY tr.completed_at DESC
       LIMIT 20`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

module.exports = router;
