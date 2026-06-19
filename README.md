# ExamAce 🎯
**"All needed to score 85%+ in one place."**

A production-ready SaaS platform for Class 11 & 12 Science students — question banks, mock tests, formula vault, study planner, performance analytics, and more.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT + Google OAuth |
| Payments | Razorpay |

---

## Project Structure

```
examace/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── DashboardLayout.jsx
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── Input.jsx
│   │   │       └── Badge.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── SignupPage.jsx
│   │   │   │   └── ForgotPasswordPage.jsx
│   │   │   ├── onboarding/
│   │   │   │   ├── SelectClassPage.jsx
│   │   │   │   ├── SelectStreamPage.jsx
│   │   │   │   └── SelectPlanPage.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── QuestionBankPage.jsx
│   │   │   │   ├── MockTestPage.jsx
│   │   │   │   ├── StudyPlannerPage.jsx
│   │   │   │   ├── FormulaVaultPage.jsx
│   │   │   │   └── AnalyticsPage.jsx
│   │   │   └── admin/
│   │   │       └── AdminPage.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── config/
    │   ├── database.js
    │   └── schema.sql
    ├── middleware/
    │   └── auth.js
    ├── routes/
    │   ├── auth.js
    │   ├── questions.js
    │   ├── tests.js
    │   ├── payments.js
    │   ├── planner.js
    │   ├── subjects.js
    │   └── admin.js
    ├── .env.example
    ├── server.js
    └── package.json
```

---

## Quick Start

### 1. Database Setup
```bash
# Create database
createdb examace_db

# Run schema
psql -d examace_db -f backend/config/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Fill in your values in .env

npm install
npm run dev
# API runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## API Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/signup | ✗ | Register with email/password |
| POST | /api/auth/login | ✗ | Login |
| POST | /api/auth/google | ✗ | Google OAuth |
| GET | /api/auth/me | ✓ | Get current user |
| PATCH | /api/auth/onboarding | ✓ | Save class & stream |
| POST | /api/auth/forgot-password | ✗ | Request reset link |
| GET | /api/questions | ✓ | List questions (filtered) |
| POST | /api/questions | Admin | Add question |
| PUT | /api/questions/:id | Admin | Update question |
| DELETE | /api/questions/:id | Admin | Delete question |
| GET | /api/tests | ✓ | List mock tests |
| GET | /api/tests/:id | ✓ | Get test with questions |
| POST | /api/tests/:id/submit | ✓ | Submit answers, get result |
| GET | /api/tests/results/my | ✓ | My test history |
| POST | /api/payments/create-order | ✓ | Create Razorpay order |
| POST | /api/payments/verify | ✓ | Verify & activate plan |
| GET | /api/payments/history | ✓ | Payment history |
| POST | /api/planner/generate | Pro | Generate study plan |
| GET | /api/planner/my | Pro | Get my plan |
| GET | /api/subjects | ✗ | List subjects |
| GET | /api/subjects/:id/chapters | ✗ | List chapters |
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/admin/users | Admin | List all users |
| GET | /api/admin/payments | Admin | All payments |
| POST | /api/admin/subjects | Admin | Add subject |
| POST | /api/admin/chapters | Admin | Add chapter |

---

## Plans & Features

| Feature | Free | Pro | Topper |
|---------|------|-----|--------|
| Question Bank | 100 Qs | Unlimited | Unlimited |
| Mock Tests | 1/month | 20/month | Unlimited |
| Formula Vault | ✗ | ✓ | ✓ |
| Study Planner | ✗ | ✓ | ✓ |
| PYQ Library | ✗ | ✓ | ✓ |
| Performance Analytics | ✗ | ✗ | ✓ |
| Weak Topic Detection | ✗ | ✗ | ✓ |
| Marks Predictor | ✗ | ✗ | Coming Soon |
| AI Doubt Solver | — | — | Coming Soon |

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/examace_db
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY_ID=your-rzp-key-id
RAZORPAY_KEY_SECRET=your-rzp-key-secret
FRONTEND_URL=http://localhost:3000
```

---

## Roadmap

- [ ] AI Doubt Solver (Gemini / OpenAI integration)
- [ ] HS Final Marks Predictor
- [ ] Statewide Student Scoreboard
- [ ] AI Study Coach
- [ ] School Rankings
- [ ] Commerce stream support
- [ ] Arts stream support
- [ ] Mobile app (React Native)
