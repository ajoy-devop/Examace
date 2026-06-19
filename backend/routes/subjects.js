const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/subjects — public
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT sub.id, sub.name, sub.icon, sub.is_active,
              s.name AS stream, c.name AS class
       FROM subjects sub
       LEFT JOIN streams s ON s.id = sub.stream_id
       LEFT JOIN classes c ON c.id = sub.class_id
       WHERE sub.is_active = TRUE
       ORDER BY sub.name`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// GET /api/subjects/:id/chapters — public
router.get('/:id/chapters', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, order_num FROM chapters
       WHERE subject_id = $1 AND is_active = TRUE
       ORDER BY order_num`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

module.exports = router;
