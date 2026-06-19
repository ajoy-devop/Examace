import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, FileText, Brain, CalendarDays, FlaskConical, BarChart3,
  Sparkles, Check, ChevronDown, ChevronUp, ArrowRight, Star,
  Clock, Target, TrendingUp, Zap, Users, Award, Shield
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

// Features data
const features = [
  {
    icon: BookOpen,
    title: 'Chapter-wise Question Banks',
    desc: 'Thousands of questions sorted by chapter, difficulty, and type. Practice exactly what you need.',
    plan: 'free',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: FileText,
    title: 'Previous Year Questions',
    desc: 'Real board exam questions from the past 10 years, fully solved with step-by-step explanations.',
    plan: 'pro',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: FlaskConical,
    title: 'Formula Vault',
    desc: 'Every Physics, Chemistry, and Maths formula organized by chapter. Searchable, shareable, printable.',
    plan: 'pro',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Brain,
    title: 'Smart Mock Tests',
    desc: 'Timed tests that simulate real board conditions. Get instant scores and topic-wise breakdown.',
    plan: 'free',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: CalendarDays,
    title: 'Study Planner',
    desc: 'Enter your exam date and target marks. Get a day-by-day plan that actually fits your schedule.',
    plan: 'pro',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    desc: 'See exactly where you lose marks. Weak topic detection, progress tracking, improvement graphs.',
    plan: 'topper',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: Sparkles,
    title: 'AI Doubt Solver',
    desc: 'Get instant answers to any question, 24/7. Like having a personal tutor always available.',
    plan: 'coming',
    color: 'from-slate-500 to-slate-600',
    soon: true,
  },
  {
    icon: Award,
    title: 'Student Scoreboard',
    desc: 'See how you rank across your school and state. Compete, improve, and climb the leaderboard.',
    plan: 'coming',
    color: 'from-slate-500 to-slate-600',
    soon: true,
  },
];

const benefits = [
  { icon: Clock, title: 'Save Study Time', desc: 'Focus on high-yield topics instead of reading everything. Smart filters show what matters most.' },
  { icon: Target, title: 'Focus on Important Questions', desc: 'Curated question banks built around actual board exam patterns, not textbook exercises.' },
  { icon: TrendingUp, title: 'Track Progress', desc: 'Visual progress reports show improvement week by week. Know your strengths before the exam.' },
  { icon: Zap, title: 'Revise Faster', desc: 'Quick-revision modes, formula cards, and chapter summaries cut revision time in half.' },
  { icon: Award, title: 'Improve Exam Scores', desc: 'Students using ExamAce consistently score 15–20% higher than their previous attempts.' },
];

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    color: 'free',
    borderColor: 'border-green-500/30',
    glowColor: 'rgba(34,197,94,0.15)',
    features: [
      '100 practice questions',
      '1 mock test per month',
      'Basic chapter notes',
      'Score history',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹199',
    period: 'per month',
    color: 'pro',
    borderColor: 'border-amber-500/40',
    glowColor: 'rgba(245,158,11,0.15)',
    features: [
      'Unlimited questions',
      '20 mock tests per month',
      'Formula Vault access',
      'Previous year questions',
      'Study Planner',
      'Detailed solutions',
    ],
    cta: 'Start Pro',
    popular: true,
  },
  {
    id: 'topper',
    name: 'Topper',
    price: '₹349',
    period: 'per month',
    color: 'topper',
    borderColor: 'border-rose-500/40',
    glowColor: 'rgba(244,63,94,0.15)',
    features: [
      'Everything in Pro',
      'Unlimited mock tests',
      'Performance analytics',
      'Weak topic detection',
      'Personalized recommendations',
      'Priority support',
      'Future: Marks Predictor',
      'Future: State Scoreboard',
    ],
    cta: 'Go Topper',
    popular: false,
  },
];

const faqs = [
  {
    q: 'Which classes and subjects does ExamAce cover?',
    a: 'Currently, ExamAce covers Class 11 and Class 12 Science stream (Physics, Chemistry, Mathematics, Biology). Commerce and Arts streams are coming soon.',
  },
  {
    q: 'Can I use ExamAce on my phone?',
    a: 'Yes! ExamAce is designed mobile-first. It works perfectly on any smartphone, tablet, or computer.',
  },
  {
    q: 'How are the mock tests structured?',
    a: 'Mock tests follow the exact pattern of CBSE/HS board exams — MCQs, short answers, and long-form questions with proper time limits and instant scoring.',
  },
  {
    q: 'Is there a free trial for Pro or Topper plans?',
    a: 'The Free plan gives you full access to 100 questions and 1 mock test per month with no credit card needed. You can upgrade anytime.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel anytime from your account settings. You keep Pro/Topper access until the end of your current billing period.',
  },
  {
    q: 'When will AI Doubt Solver be available?',
    a: "We're actively building AI features. AI Doubt Solver and Marks Predictor are targeted for release in the next 2–3 months. Topper plan users get first access.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 p-5 text-left group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-medium text-slate-100 group-hover:text-white transition-colors">{q}</span>
        <span className="flex-shrink-0 text-indigo-400">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4 animate-fade-in">
          {a}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-mesh text-slate-100">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-500 text-white px-4 py-2 rounded-lg z-50">
        Skip to content
      </a>
      <Navbar transparent />

      {/* ─── HERO ─── */}
      <section id="main-content" className="relative min-h-screen flex items-center justify-center pt-16 px-4 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center py-20">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm mb-8 animate-fade-in">
            <Zap size={14} />
            <span>Class 11 & 12 · Science Stream · Board Exams</span>
          </div>

          {/* Score badge — signature element */}
          <div className="flex justify-center mb-8 animate-float">
            <div className="score-badge">
              <span>85%</span>
              <span className="text-xs font-medium opacity-80">+</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white mb-6 text-balance leading-tight animate-slide-up">
            All needed to score{' '}
            <span className="gradient-text">85%+</span>
            <br />in one place.
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Question banks, mock tests, study plans, formula vaults, performance analysis,
            and exam prep tools built for Class 11 and 12 students.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Button size="xl" onClick={() => navigate('/signup')} className="min-w-44">
              Get Started Free
              <ArrowRight size={18} />
            </Button>
            <Button size="xl" variant="outline" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              View Plans
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-slate-500 animate-fade-in">
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-indigo-400" />
              <span>5,000+ students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-amber-400" />
              <span>4.8 avg rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-green-400" />
              <span>Free to start</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="info" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Everything you need to crack your boards
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              No more juggling between textbooks, YouTube, and coaching notes. It's all here.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Card
                  key={f.title}
                  hover={!f.soon}
                  className={f.soon ? 'opacity-60' : ''}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-display font-semibold text-white text-sm flex-1">{f.title}</h3>
                    {f.soon ? (
                      <Badge variant="comingsoon">Soon</Badge>
                    ) : (
                      <Badge variant={f.plan}>{f.plan}</Badge>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="py-24 px-4 bg-navy-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="info" className="mb-4">Why ExamAce</Badge>
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Why students choose us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-all">
                    <Icon size={22} className="text-indigo-400" />
                  </div>
                  <h3 className="font-display font-semibold text-white mb-2 text-sm">{b.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="info" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-slate-400">Start free. Upgrade when you're ready. No hidden charges.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`glass-card p-6 border ${plan.borderColor} relative flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover`}
                style={{ boxShadow: plan.popular ? `0 0 40px ${plan.glowColor}` : undefined }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <Badge variant={plan.color} className="mb-3">{plan.name}</Badge>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400 text-sm">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.color === 'free' ? 'outline' : plan.color === 'pro' ? 'pro' : 'topper'}
                  fullWidth
                  onClick={() => navigate('/signup')}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 px-4 bg-navy-800/20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="info" className="mb-4">FAQ</Badge>
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Common questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map(faq => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center glass-card p-12 border border-indigo-500/20 shadow-glow">
          <div className="score-badge mx-auto mb-6 w-20 h-20 text-2xl">85%</div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to hit your target score?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of Class 11 & 12 students already using ExamAce to prepare smarter.
          </p>
          <Button size="xl" onClick={() => navigate('/signup')}>
            Start for Free — No Credit Card
            <ArrowRight size={18} />
          </Button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <span className="font-display font-bold text-white">Exam<span className="gradient-text">Ace</span></span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                All needed to score 85%+ in one place. Built for Class 11 & 12 students.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300 text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><a href="#features" className="hover:text-slate-300 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-slate-300 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300 text-sm mb-3">Subjects</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>Physics</li>
                <li>Chemistry</li>
                <li>Mathematics</li>
                <li>Biology</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300 text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><a href="/" className="hover:text-slate-300 transition-colors">Privacy Policy</a></li>
                <li><a href="/" className="hover:text-slate-300 transition-colors">Terms of Service</a></li>
                <li><a href="/" className="hover:text-slate-300 transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} ExamAce. Built for Indian students. Payments powered by Razorpay.
          </div>
        </div>
      </footer>
    </div>
  );
}
