import React from 'react';
import { BarChart3, TrendingUp, AlertCircle, Lock, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

const mockScores = [
  { test: 'Test 1', score: 52, date: 'Jun 1' },
  { test: 'Test 2', score: 61, date: 'Jun 5' },
  { test: 'Test 3', score: 58, date: 'Jun 10' },
  { test: 'Test 4', score: 70, date: 'Jun 14' },
  { test: 'Test 5', score: 72, date: 'Jun 18' },
];

const subjectData = [
  { subject: 'Physics', score: 65, total: 100, weak: ['Gravitation', 'Optics'], strong: ['Motion', 'Laws of Motion'] },
  { subject: 'Chemistry', score: 78, total: 100, weak: ['Thermodynamics'], strong: ['Atomic Structure', 'Chemical Bonding'] },
  { subject: 'Mathematics', score: 70, total: 100, weak: ['Limits', 'Complex Numbers'], strong: ['Trigonometry', 'Sets'] },
];

const weakTopics = [
  { topic: 'Gravitation', subject: 'Physics', accuracy: 34, attempts: 12 },
  { topic: 'Thermodynamics', subject: 'Chemistry', accuracy: 41, attempts: 8 },
  { topic: 'Limits', subject: 'Mathematics', accuracy: 45, attempts: 15 },
  { topic: 'Complex Numbers', subject: 'Mathematics', accuracy: 38, attempts: 10 },
];

function MiniBarChart({ data }) {
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs text-slate-400 font-medium">{d.score}%</span>
          <div className="w-full rounded-t-md bg-indigo-500/20 relative overflow-hidden" style={{ height: `${(d.score / 100) * 70}px` }}>
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-md transition-all duration-700"
              style={{ height: '100%' }}
            />
          </div>
          <span className="text-xs text-slate-500 truncate w-full text-center">{d.date}</span>
        </div>
      ))}
    </div>
  );
}

function LockedOverlay() {
  return (
    <div className="glass-card p-12 text-center border border-rose-500/20">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
        <Lock size={28} className="text-rose-400" />
      </div>
      <Badge variant="topper" className="mb-3">Topper Feature</Badge>
      <h2 className="text-xl font-display font-bold text-white mb-2">Performance Analytics</h2>
      <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
        Deep performance insights, weak topic detection, score trends, and personalized recommendations to help you hit 85%+.
      </p>
      <Link to="/onboarding/plan">
        <Button variant="topper" size="lg">Upgrade to Topper</Button>
      </Link>
    </div>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const isTopper = user?.plan === 'topper';

  if (!isTopper) return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={18} className="text-rose-400" />
          <h1 className="text-2xl font-display font-bold text-white">Performance Analytics</h1>
        </div>
      </div>
      <LockedOverlay />
    </DashboardLayout>
  );

  const avgScore = Math.round(mockScores.reduce((a, b) => a + b.score, 0) / mockScores.length);
  const latest = mockScores[mockScores.length - 1].score;
  const trend = latest - mockScores[mockScores.length - 2].score;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={18} className="text-rose-400" />
          <h1 className="text-2xl font-display font-bold text-white">Performance Analytics</h1>
        </div>
        <p className="text-slate-400 text-sm">Based on 5 mock tests · Last updated today</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Avg Score', value: `${avgScore}%`, sub: 'across all tests', color: 'border-indigo-500/20 bg-indigo-500/5' },
          { label: 'Latest Score', value: `${latest}%`, sub: `${trend >= 0 ? '+' : ''}${trend}% from prev`, color: 'border-green-500/20 bg-green-500/5' },
          { label: 'Tests Taken', value: '5', sub: 'this month', color: 'border-violet-500/20 bg-violet-500/5' },
          { label: 'Target Gap', value: `${Math.max(0, 85 - latest)}%`, sub: 'to reach 85%', color: 'border-amber-500/20 bg-amber-500/5' },
        ].map(s => (
          <div key={s.label} className={clsx('glass-card p-4 border', s.color)}>
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className="text-2xl font-display font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Score trend */}
        <div className="glass-card p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white">Score Trend</h2>
            <Badge variant="info">Last 5 Tests</Badge>
          </div>
          <MiniBarChart data={mockScores} />
          <div className="mt-3 flex items-center gap-1.5 text-xs text-green-400">
            <TrendingUp size={13} />
            <span>+20% improvement over 5 tests</span>
          </div>
        </div>

        {/* Subject breakdown */}
        <div className="glass-card p-5 border border-white/5">
          <h2 className="font-display font-semibold text-white mb-4">Subject Breakdown</h2>
          <div className="space-y-4">
            {subjectData.map(s => (
              <div key={s.subject}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-300 font-medium">{s.subject}</span>
                  <span className={clsx(
                    'font-bold font-display',
                    s.score >= 75 ? 'text-green-400' : s.score >= 60 ? 'text-amber-400' : 'text-rose-400'
                  )}>{s.score}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all duration-700',
                      s.score >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                      s.score >= 60 ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                      'bg-gradient-to-r from-rose-500 to-pink-400'
                    )}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weak topics */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={16} className="text-rose-400" />
          <h2 className="font-display font-semibold text-white">Weak Topics — Focus Here</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {weakTopics.map(t => (
            <div key={t.topic} className="glass-card p-4 border border-rose-500/15 bg-rose-500/5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-white text-sm">{t.topic}</p>
                  <p className="text-xs text-slate-400">{t.subject}</p>
                </div>
                <span className="text-rose-400 font-bold text-sm font-display">{t.accuracy}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${t.accuracy}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{t.attempts} attempts</span>
                <Link to="/dashboard/question-bank" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Practice now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strong topics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={16} className="text-green-400" />
          <h2 className="font-display font-semibold text-white">Strong Topics — Keep It Up</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {subjectData.flatMap(s => s.strong.map(t => ({ topic: t, subject: s.subject }))).map(t => (
            <span key={t.topic} className="px-3 py-1.5 rounded-xl text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-400">
              ✓ {t.topic} · {t.subject}
            </span>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
