-- ExamAce Database Schema
-- Run this file to initialize the database: psql -d examace_db -f schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),               -- NULL for Google OAuth users
  google_id     VARCHAR(255) UNIQUE,
  avatar_url    VARCHAR(500),
  role          VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CLASSES ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classes (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(20) NOT NULL UNIQUE,  -- e.g. 'Class 11', 'Class 12'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO classes (name) VALUES ('Class 11'), ('Class 12') ON CONFLICT DO NOTHING;

-- ─── STREAMS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS streams (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50) NOT NULL UNIQUE, -- 'Science', 'Commerce', 'Arts'
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO streams (name, is_active) VALUES
  ('Science', TRUE),
  ('Commerce', FALSE),
  ('Arts', FALSE)
ON CONFLICT DO NOTHING;

-- ─── USER PROFILES ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id   INTEGER REFERENCES classes(id),
  stream_id  INTEGER REFERENCES streams(id),
  onboarded  BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SUBSCRIPTIONS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan               VARCHAR(20) NOT NULL CHECK (plan IN ('free', 'pro', 'topper')),
  status             VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  razorpay_sub_id    VARCHAR(255),
  starts_at          TIMESTAMPTZ DEFAULT NOW(),
  ends_at            TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Default free subscription on user creation (trigger)
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, plan) VALUES (NEW.id, 'free');
  INSERT INTO user_profiles (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_user_insert
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_default_subscription();

-- ─── SUBJECTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subjects (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  stream_id   INTEGER REFERENCES streams(id),
  class_id    INTEGER REFERENCES classes(id),
  icon        VARCHAR(50),
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CHAPTERS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chapters (
  id          SERIAL PRIMARY KEY,
  subject_id  INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name        VARCHAR(200) NOT NULL,
  order_num   INTEGER DEFAULT 1,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── QUESTIONS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id      INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  type            VARCHAR(30) NOT NULL CHECK (type IN ('mcq', 'short', 'long', 'numerical')),
  difficulty      VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  text            TEXT NOT NULL,
  options         JSONB,          -- [{label: 'A', text: '...'}, ...] for MCQ
  correct_answer  TEXT,           -- option label for MCQ, value for numerical
  solution        TEXT,
  marks           INTEGER DEFAULT 1,
  is_pyq          BOOLEAN DEFAULT FALSE,
  pyq_year        INTEGER,
  plan_required   VARCHAR(20) DEFAULT 'free' CHECK (plan_required IN ('free', 'pro', 'topper')),
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── MOCK TESTS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mock_tests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  subject_id      INTEGER REFERENCES subjects(id),
  class_id        INTEGER REFERENCES classes(id),
  duration_mins   INTEGER NOT NULL DEFAULT 180,
  total_marks     INTEGER NOT NULL DEFAULT 100,
  plan_required   VARCHAR(20) DEFAULT 'free' CHECK (plan_required IN ('free', 'pro', 'topper')),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Mock test questions junction
CREATE TABLE IF NOT EXISTS mock_test_questions (
  mock_test_id  UUID REFERENCES mock_tests(id) ON DELETE CASCADE,
  question_id   UUID REFERENCES questions(id) ON DELETE CASCADE,
  order_num     INTEGER DEFAULT 1,
  PRIMARY KEY (mock_test_id, question_id)
);

-- ─── TEST RESULTS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS test_results (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mock_test_id    UUID NOT NULL REFERENCES mock_tests(id),
  score           INTEGER NOT NULL,
  total_marks     INTEGER NOT NULL,
  percentage      DECIMAL(5,2),
  time_taken_secs INTEGER,
  answers         JSONB,          -- {question_id: selected_answer, ...}
  subject_scores  JSONB,          -- {Physics: 70, Chemistry: 80, ...}
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

-- ─── STUDY PLANS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_plans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_date       DATE NOT NULL,
  target_pct      INTEGER NOT NULL DEFAULT 85,
  plan_data       JSONB NOT NULL,   -- Generated day-by-day plan
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTES ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id    INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
  title         VARCHAR(300) NOT NULL,
  file_url      VARCHAR(500) NOT NULL,
  file_size_kb  INTEGER,
  plan_required VARCHAR(20) DEFAULT 'free' CHECK (plan_required IN ('free', 'pro', 'topper')),
  uploaded_by   UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PAYMENTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id       UUID REFERENCES subscriptions(id),
  razorpay_order_id     VARCHAR(255),
  razorpay_payment_id   VARCHAR(255),
  razorpay_signature    VARCHAR(500),
  plan                  VARCHAR(20) NOT NULL,
  amount_paise          INTEGER NOT NULL,   -- Amount in paise (100 paise = ₹1)
  currency              VARCHAR(10) DEFAULT 'INR',
  status                VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  payment_method        VARCHAR(50),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);
CREATE INDEX IF NOT EXISTS idx_test_results_user ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON study_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
