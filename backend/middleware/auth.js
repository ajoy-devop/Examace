const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await db.query(
      'SELECT id, name, email, role, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account suspended' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Require admin role
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Check plan access
const requirePlan = (minPlan) => {
  const planOrder = { free: 0, pro: 1, topper: 2 };
  return async (req, res, next) => {
    try {
      const result = await db.query(
        `SELECT plan FROM subscriptions
         WHERE user_id = $1 AND status = 'active'
         ORDER BY created_at DESC LIMIT 1`,
        [req.user.id]
      );
      const userPlan = result.rows[0]?.plan || 'free';
      if (planOrder[userPlan] < planOrder[minPlan]) {
        return res.status(403).json({
          error: `This feature requires ${minPlan} plan`,
          required: minPlan,
          current: userPlan,
        });
      }
      req.userPlan = userPlan;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { authenticate, requireAdmin, requirePlan };
