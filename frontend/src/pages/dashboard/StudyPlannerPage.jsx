import React, { useState } from 'react';
import { CalendarDays, CheckCircle, Circle, Lock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

const subjects = ['Physics', 'Chemistry', 'Mathematics'];

function generatePlan(examDate, targetPct) {
  const today = new Date();
  const exam = new Date(examDate);
  const daysLeft = Math.max(1, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));

  const chapters = {
    Physics: ['Motion', 'Laws of Motion', 'Work & Energy', 'Gravitation', 'Waves', 'Optics', 'Electrostatics', 'Current Electricity'],
    Chemistry: ['Atomic Structure', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox', 'Organic Basics', 'Hydrocarbons'],
    Mathematics: ['Sets', 'Relations', 'Trigonometry', 'Complex Numbers', 'Quadratic', 'Permutation', 'Binomial', 'Limits & Derivatives'],
  };

  const plan = [];
  let dayIndex = 0;
  const chaptersPerDay = targetPct >= 85 ? 1 : 2;

  for (const subject of subjects) {
    for (const chapter of chapters[subject]) {
      if (dayIndex >= daysLeft - 3) break;
      const date = new Date(today);
      date.setDate(today.getDate() + dayIndex);
      plan.push({
        date: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        subject,
        chapter,
        tasks: [
          `Read ${chapter} notes (30 min)`,
          `Solve 10 practice questions (20 min)`,
          targetPct >= 85 ? `Review PYQs for ${chapter} (15 min)` : null,
        ].filter(Boolean),
        done: false,
      });
      if (plan.length % chaptersPerDay === 0) dayIndex++;
    }
  }

  // Last 3 days = revision
  for (let i = 0; i < 3; i++) {
    const date = new Date(exam);
    date.setDate(exam.getDate() - (2 - i));
    plan.push({
      date: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      subject: 'Revision',
      chapter: i === 2 ? 'Day before exam — Light revision only' : `Full revision Day ${i + 1}`,
      tasks: i === 2
        ? ['Go through formula sheet', 'Sleep early', 'Stay calm']
        : ['Revise all formulas', 'Solve 1 mock test', 'Note weak areas'],
      isRevision: true,
      done: false,
    });
  }

  return plan.slice(0, Math.min(plan.length, daysLeft));
}

function LockedOverlay() {
  return (
    <div className="relative">
      <div className="glass-card p-12 text-center border border-amber-500/20">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-amber-400" />
        </div>
        <Badge variant="pro" className="mb-3">Pro Feature</Badge>
        <h2 className="text-xl font-display font-bold text-white mb-2">Study Planner</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
          Enter your exam date and target percentage. Get a personalized day-by-day study plan automatically generated for you.
        </p>
        <Link to="/onboarding/plan">
          <Button variant="pro" size="lg">Upgrade to Pro</Button>
        </Link>
      </div>
    </div>
  );
}

export default function StudyPlannerPage() {
  const { user } = useAuth();
  const isPro = user?.plan === 'pro' || user?.plan === 'topper';

  const [examDate, setExamDate] = useState('');
  const [targetPct, setTargetPct] = useState(85);
  const [plan, setPlan] = useState(null);
  const [checkedTasks, setCheckedTasks] = useState({});

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleGenerate = () => {
    if (!examDate) return;
    setPlan(generatePlan(examDate, targetPct));
    setCheckedTasks({});
  };

  const toggleTask = (dayIdx, taskIdx) => {
    const key = `${dayIdx}-${taskIdx}`;
    setCheckedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isPro) return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays size={18} className="text-blue-400" />
          <h1 className="text-2xl font-display font-bold text-white">Study Planner</h1>
        </div>
        <p className="text-slate-400 text-sm">Personalized daily study schedule based on your exam date</p>
      </div>
      <LockedOverlay />
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays size={18} className="text-blue-400" />
          <h1 className="text-2xl font-display font-bold text-white">Study Planner</h1>
        </div>
        <p className="text-slate-400 text-sm">Enter your exam date and we'll build your daily plan</p>
      </div>

      {/* Input form */}
      <div className="glass-card p-6 mb-6 border border-blue-500/15">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1.5">
              Exam Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              value={examDate}
              min={minDateStr}
              onChange={e => setExamDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-navy-800/60 text-slate-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1.5">
              Target Percentage: <span className="text-indigo-400 font-bold">{targetPct}%</span>
            </label>
            <input
              type="range"
              min={60}
              max={100}
              value={targetPct}
              onChange={e => setTargetPct(Number(e.target.value))}
              className="w-full h-2 rounded-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>60%</span><span>85%+</span><span>100%</span>
            </div>
          </div>
          <Button size="lg" onClick={handleGenerate} disabled={!examDate}>
            Generate Plan
          </Button>
        </div>
      </div>

      {/* Generated plan */}
      {plan && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-white">Your Study Plan</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {plan.length} days · Target {targetPct}% · Exam on {new Date(examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2 text-xs text-slate-400">
              {subjects.map(s => (
                <span key={s} className={clsx(
                  'px-2 py-1 rounded-lg border',
                  s === 'Physics' ? 'border-indigo-500/30 text-indigo-400' :
                  s === 'Chemistry' ? 'border-green-500/30 text-green-400' :
                  'border-amber-500/30 text-amber-400'
                )}>{s}</span>
              ))}
              <span className="px-2 py-1 rounded-lg border border-rose-500/30 text-rose-400">Revision</span>
            </div>
          </div>

          <div className="space-y-3">
            {plan.map((day, dayIdx) => {
              const allDone = day.tasks.every((_, ti) => checkedTasks[`${dayIdx}-${ti}`]);
              return (
                <div
                  key={dayIdx}
                  className={clsx(
                    'glass-card p-4 border transition-all',
                    allDone ? 'border-green-500/20 bg-green-500/5' :
                    day.isRevision ? 'border-rose-500/20' : 'border-white/5'
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Date pill */}
                    <div className="flex-shrink-0 text-center">
                      <div className={clsx(
                        'w-16 rounded-xl py-2 px-1 text-center',
                        day.isRevision ? 'bg-rose-500/15 border border-rose-500/30' :
                        day.subject === 'Physics' ? 'bg-indigo-500/15 border border-indigo-500/20' :
                        day.subject === 'Chemistry' ? 'bg-green-500/15 border border-green-500/20' :
                        'bg-amber-500/15 border border-amber-500/20'
                      )}>
                        <p className="text-xs font-medium text-slate-300">{day.date.split(' ')[0]}</p>
                        <p className="text-lg font-bold text-white font-display leading-tight">{day.date.split(' ')[1]}</p>
                        <p className="text-xs text-slate-400">{day.date.split(' ')[2]}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {!day.isRevision && (
                          <Badge variant={
                            day.subject === 'Physics' ? 'info' :
                            day.subject === 'Chemistry' ? 'success' : 'warning'
                          }>{day.subject}</Badge>
                        )}
                        {day.isRevision && <Badge variant="danger">Revision</Badge>}
                        <h3 className="text-sm font-semibold text-white">{day.chapter}</h3>
                        {allDone && <CheckCircle size={14} className="text-green-400 ml-auto flex-shrink-0" />}
                      </div>
                      <ul className="space-y-1.5">
                        {day.tasks.map((task, ti) => {
                          const key = `${dayIdx}-${ti}`;
                          const done = checkedTasks[key];
                          return (
                            <li key={ti}>
                              <button
                                onClick={() => toggleTask(dayIdx, ti)}
                                className={clsx(
                                  'flex items-center gap-2 text-xs transition-all w-full text-left',
                                  done ? 'text-slate-500 line-through' : 'text-slate-300 hover:text-white'
                                )}
                              >
                                {done
                                  ? <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                                  : <Circle size={13} className="text-slate-600 flex-shrink-0" />
                                }
                                {task}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
