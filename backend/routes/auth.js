const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if email exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, name, email, role`,
      [name, email, passwordHash]
    );

    const user = result.rows[0];
    const token = signToken(user.id);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.password_hash, u.role,
              up.class_id, up.stream_id, up.onboarded,
              s.plan
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.id
       LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
       WHERE u.email = $1`,
      [email]
    );

    const user = result.rows[0];
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user.id);
    const { password_hash, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ─── POST /api/auth/google ────────────────────────────────────────────────────
// In production: verify Google ID token using google-auth-library
router.post('/google', async (req, res) => {
  const { googleId, email, name, avatarUrl } = req.body;

  if (!googleId || !email) {
    return res.status(400).json({ error: 'Google ID and email required' });
  }

  try {
    // Upsert user
    const result = await db.query(
      `INSERT INTO users (google_id, email, name, avatar_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (google_id) DO UPDATE
         SET name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url, updated_at = NOW()
       RETURNING id, name, email, role`,
      [googleId, email, name, avatarUrl]
    );

    const user = result.rows[0];
    const token = signToken(user.id);

    res.json({ user, token });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Google sign-in failed' });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.avatar_url, u.role,
              up.class_id, up.stream_id, up.onboarded,
              c.name AS class_name, st.name AS stream_name,
              sub.plan
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.id
       LEFT JOIN classes c ON c.id = up.class_id
       LEFT JOIN streams st ON st.id = up.stream_id
       LEFT JOIN subscriptions sub ON sub.user_id = u.id AND sub.status = 'active'
       WHERE u.id = $1`,
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// ─── PATCH /api/auth/onboarding ───────────────────────────────────────────────
router.patch('/onboarding', authenticate, async (req, res) => {
  const { classId, streamId } = req.body;
  try {
    await db.query(
      `UPDATE user_profiles
       SET class_id = $1, stream_id = $2, onboarded = TRUE, updated_at = NOW()
       WHERE user_id = $3`,
      [classId, streamId, req.user.id]
    );
    res.json({ message: 'Onboarding complete' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update onboarding' });
  }
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
], async (req, res) => {
  // In production: generate reset token, email it
  // Here we just acknowledge the request
  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

module.exports = router;
