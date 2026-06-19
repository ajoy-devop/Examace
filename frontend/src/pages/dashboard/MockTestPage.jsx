import React, { useState, useEffect, useCallback } from 'react';
import { Clock, FileText, CheckCircle, XCircle, Trophy, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { clsx } from 'clsx';

const TEST_DURATION = 30 * 60; // 30 minutes in seconds

const mockTestQuestions = [
  { id: 1, subject: 'Physics', text: 'A ball is thrown vertically upward with velocity 20 m/s. The maximum height reached is:', options: ['10 m', '20 m', '40 m', '80 m'], correct: 1 },
  { id: 2, subject: 'Chemistry', text: 'The IUPAC name of CH₃-CH₂-OH is:', options: ['Methanol', 'Ethanol', 'Propanol', 'Butanol'], correct: 1 },
  { id: 3, subject: 'Mathematics', text: 'The derivative of sin(x) with respect to x is:', options: ['sin(x)', 'cos(x)', '-sin(x)', '-cos(x)'], correct: 1 },
  { id: 4, subject: 'Physics', text: 'Ohm\'s law states that current is:', options: ['Inversely proportional to voltage', 'Directly proportional to resistance', 'Directly proportional to voltage', 'Independent of voltage'], correct: 2 },
  { id: 5, subject: 'Chemistry', text: 'The atomic number of Carbon is:', options: ['4', '6', '8', '12'], correct: 1 },
  { id: 6, subject: 'Mathematics', text: 'What is the value of sin(90°)?', options: ['0', '0.5', '1', '√2'], correct: 2 },
  { id: 7, subject: 'Physics', text: 'Which of the following is a scalar quantity?', options: ['Force', 'Velocity', 'Speed', 'Acceleration'], correct: 2 },
  { id: 8, subject: 'Chemistry', text: 'pH of pure water at 25°C is:', options: ['0', '7', '14', '6'], correct: 1 },
  { id: 9, subject: 'Mathematics', text: 'The value of log₁₀(100) is:', options: ['1', '2', '10', '100'], correct: 1 },
  { id: 10, subject: 'Physics', text: 'The SI unit of electric charge is:', options: ['Ampere', 'Volt', 'Coulomb', 'Watt'], correct: 2 },
];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function TestScreen({ onSubmit }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);

  useEffect(() => {
    if (timeLeft <= 0) { onSubmit(answers); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, answers, onSubmit]);

  const q = mockTestQuestions[current];
  const progress = ((current + 1) / mockTestQuestions.length) * 100;
  const answered = Object.keys(answers).length;
  const urgency = timeLeft < 300;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="glass-card p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Question {current + 1}/{mockTestQuestions.length}</span>
          <Badge variant="info">{q.subject}</Badge>
        </div>
        <div className={clsx(
          'flex items-center gap-1.5 font-mono font-bold text-lg px-3 py-1 rounded-lg',
          urgency ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30 animate-pulse' : 'text-white'
        )}>
          <Clock size={16} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-white/5 mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }} />
      </div>

      {/* Question */}
      <div className="glass-card p-6 mb-4">
        <p className="text-white font-medium leading-relaxed mb-6">{q.text}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
              className={clsx(
                'w-full text-left px-4 py-3 rounded-xl text-sm border transition-all duration-200',
                answers[q.id] === i
                  ? 'border-indigo-500/60 bg-indigo-500/15 text-white'
                  : 'border-white/10 text-slate-300 hover:border-indigo-500/30 hover:bg-white/5'
              )}
            >
              <span className="font-mono text-xs mr-2 text-slate-500">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" size="sm" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>
          <ChevronLeft size={16} /> Prev
        </Button>

        <div className="flex gap-1 flex-wrap justify-center">
          {mockTestQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={clsx(
                'w-7 h-7 rounded-lg text-xs font-medium transition-all border',
                current === i
                  ? 'bg-indigo-500 border-indigo-400 text-white'
                  : answers[mockTestQuestions[i].id] !== undefined
                  ? 'bg-green-500/20 border-green-500/40 text-green-400'
                  : 'border-white/10 text-slate-500 hover:border-white/20'
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {current < mockTestQuestions.length - 1 ? (
          <Button size="sm" onClick={() => setCurrent(c => c + 1)}>
            Next <ChevronRight size={16} />
          </Button>
        ) : (
          <Button size="sm" variant="free" onClick={() => onSubmit(answers)}>
            Submit ({answered}/{mockTestQuestions.length})
          </Button>
        )}
      </div>
    </div>
  );
}

function ResultScreen({ answers, onRetry }) {
  const total = mockTestQuestions.length;
  const correct = mockTestQuestions.filter(q => answers[q.id] === q.correct).length;
  const wrong = Object.keys(answers).length - correct;
  const skipped = total - Object.keys(answers).length;
  const score = Math.round((correct / total) * 100);

  const subjectStats = ['Physics', 'Chemistry', 'Mathematics'].map(sub => {
    const qs = mockTestQuestions.filter(q => q.subject === sub);
    const c = qs.filter(q => answers[q.id] === q.correct).length;
    return { sub, correct: c, total: qs.length, pct: Math.round((c / qs.length) * 100) };
  });

  return (
    <div className="max-w-xl mx-auto animate-slide-up">
      {/* Score card */}
      <div className="glass-card p-8 text-center mb-6 border border-indigo-500/20">
        <div className="score-badge mx-auto mb-4">{score}%</div>
        <h2 className="text-2xl font-display font-bold text-white mb-1">
          {score >= 85 ? '🎉 Excellent!' : score >= 60 ? '👍 Good effort!' : '📚 Keep practicing!'}
        </h2>
        <p className="text-slate-400 text-sm">
          {score >= 85 ? 'You\'re on track for 85%+' : 'Review weak areas and try again'}
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="glass-card p-3 border border-green-500/20">
            <p className="text-2xl font-bold text-green-400">{correct}</p>
            <p className="text-xs text-slate-400">Correct</p>
          </div>
          <div className="glass-card p-3 border border-rose-500/20">
            <p className="text-2xl font-bold text-rose-400">{wrong}</p>
            <p className="text-xs text-slate-400">Wrong</p>
          </div>
          <div className="glass-card p-3 border border-slate-500/20">
            <p className="text-2xl font-bold text-slate-400">{skipped}</p>
            <p className="text-xs text-slate-400">Skipped</p>
          </div>
        </div>
      </div>

      {/* Subject breakdown */}
      <div className="glass-card p-5 mb-6">
        <h3 className="font-semibold text-white mb-4 text-sm">Subject-wise Analysis</h3>
        <div className="space-y-3">
          {subjectStats.map(({ sub, correct: c, total: t, pct }) => (
            <div key={sub}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{sub}</span>
                <span className="text-white font-medium">{c}/{t} ({pct}%)</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className={clsx(
                  'h-full rounded-full transition-all duration-700',
                  pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                )} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review answers */}
      <div className="glass-card p-5 mb-6">
        <h3 className="font-semibold text-white mb-4 text-sm">Answer Review</h3>
        <div className="space-y-3">
          {mockTestQuestions.map((q, i) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.correct;
            const attempted = userAns !== undefined;
            return (
              <div key={q.id} className={clsx(
                'p-3 rounded-lg border text-sm',
                isCorrect ? 'border-green-500/20 bg-green-500/5' :
                attempted ? 'border-rose-500/20 bg-rose-500/5' :
                'border-white/5 bg-white/2'
              )}>
                <div className="flex items-start gap-2">
                  {isCorrect ? <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" /> :
                   attempted ? <XCircle size={14} className="text-rose-400 mt-0.5 flex-shrink-0" /> :
                   <div className="w-3.5 h-3.5 rounded-full border border-slate-500 mt-0.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 text-xs mb-1 truncate">Q{i + 1}: {q.text}</p>
                    {!isCorrect && (
                      <p className="text-xs text-green-400">
                        ✓ {q.options[q.correct]}
                        {attempted && <span className="text-rose-400 ml-2">✗ {q.options[userAns]}</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button fullWidth size="lg" onClick={onRetry} variant="outline">
        <RotateCcw size={16} /> Retake Test
      </Button>
    </div>
  );
}

export default function MockTestPage() {
  const [status, setStatus] = useState('idle'); // idle | active | done
  const [answers, setAnswers] = useState({});

  const handleSubmit = useCallback((ans) => {
    setAnswers(ans);
    setStatus('done');
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={18} className="text-violet-400" />
          <h1 className="text-2xl font-display font-bold text-white">Mock Test</h1>
        </div>
        <p className="text-slate-400 text-sm">Simulated board exam · 10 questions · 30 minutes</p>
      </div>

      {status === 'idle' && (
        <div className="max-w-xl mx-auto">
          <div className="glass-card p-8 text-center border border-violet-500/20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-glow-violet">
              <FileText size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-display font-bold text-white mb-2">Full Mock Test</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              10 questions across Physics, Chemistry, and Mathematics.<br />
              You have 30 minutes. Results and analysis shown immediately.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
              {[
                { label: 'Questions', value: '10' },
                { label: 'Duration', value: '30 min' },
                { label: 'Subjects', value: '3' },
              ].map(s => (
                <div key={s.label} className="glass-card p-3 border border-white/5">
                  <p className="text-white font-bold text-lg font-display">{s.value}</p>
                  <p className="text-slate-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
            <Button fullWidth size="lg" onClick={() => setStatus('active')}>
              Start Mock Test
            </Button>
            <p className="text-xs text-slate-500 mt-3">Make sure you're in a quiet place · Timer starts immediately</p>
          </div>
        </div>
      )}

      {status === 'active' && <TestScreen onSubmit={handleSubmit} />}

      {status === 'done' && (
        <ResultScreen answers={answers} onRetry={() => { setAnswers({}); setStatus('idle'); }} />
      )}
    </DashboardLayout>
  );
}
