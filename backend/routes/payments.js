const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Razorpay instance (initialized lazily to avoid crash if keys not set)
let razorpay;
const getRazorpay = () => {
  if (!razorpay) {
    const Razorpay = require('razorpay');
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

const PLAN_PRICES = {
  pro: 19900,      // ₹199 in paise
  topper: 34900,   // ₹349 in paise
};

// ─── POST /api/payments/create-order ─────────────────────────────────────────
router.post('/create-order', authenticate, async (req, res) => {
  const { plan } = req.body;
  if (!PLAN_PRICES[plan]) {
    return res.status(400).json({ error: 'Invalid plan. Choose pro or topper.' });
  }

  try {
    const order = await getRazorpay().orders.create({
      amount: PLAN_PRICES[plan],
      currency: 'INR',
      receipt: `examace_${req.user.id}_${Date.now()}`,
      notes: { userId: req.user.id, plan },
    });

    // Record pending payment
    await db.query(
      `INSERT INTO payments (user_id, razorpay_order_id, plan, amount_paise, status)
       VALUES ($1, $2, $3, $4, 'pending')`,
      [req.user.id, order.id, plan, PLAN_PRICES[plan]]
    );

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// ─── POST /api/payments/verify ────────────────────────────────────────────────
router.post('/verify', authenticate, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment details' });
  }

  // Verify signature
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSig !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment signature invalid' });
  }

  try {
    // Get pending payment
    const paymentRecord = await db.query(
      `SELECT * FROM payments WHERE razorpay_order_id = $1 AND user_id = $2`,
      [razorpay_order_id, req.user.id]
    );
    if (!paymentRecord.rows.length) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    const { plan } = paymentRecord.rows[0];

    await db.query('BEGIN');

    // Update payment record
    await db.query(
      `UPDATE payments SET
         razorpay_payment_id = $1, razorpay_signature = $2, status = 'success', updated_at = NOW()
       WHERE razorpay_order_id = $3`,
      [razorpay_payment_id, razorpay_signature, razorpay_order_id]
    );

    // Cancel existing active subscriptions
    await db.query(
      `UPDATE subscriptions SET status = 'cancelled', updated_at = NOW()
       WHERE user_id = $1 AND status = 'active'`,
      [req.user.id]
    );

    // Create new subscription (monthly)
    const endsAt = new Date();
    endsAt.setMonth(endsAt.getMonth() + 1);

    await db.query(
      `INSERT INTO subscriptions (user_id, plan, status, razorpay_sub_id, ends_at)
       VALUES ($1, $2, 'active', $3, $4)`,
      [req.user.id, plan, razorpay_payment_id, endsAt]
    );

    await db.query('COMMIT');

    res.json({ success: true, plan, message: `Upgraded to ${plan} successfully` });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Payment verify error:', err);
    res.status(500).json({ error: 'Failed to activate subscription' });
  }
});

// ─── GET /api/payments/history ────────────────────────────────────────────────
router.get('/history', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, plan, amount_paise, status, payment_method, created_at
       FROM payments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [req.user.id]
    );
    res.json(result.rows.map(p => ({
      ...p,
      amount: `₹${(p.amount_paise / 100).toFixed(0)}`,
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

module.exports = router;
