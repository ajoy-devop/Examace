import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, FileText, FlaskConical, CalendarDays, BarChart3,
  Lock, ArrowRight, TrendingUp, Target, Zap, Brain,
  MessageCircleQuestion, Trophy, Bot, Flame
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

const planOrder = { free: 0, pro: 1, topper: 2 };
function canAccess(userPlan, requiredPlan) {
  return planOrder[userPlan] >= planOrder[requiredPlan];
}

function StatCard({ label, value, sub, color = 'indigo' }) {
  const colors = {
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20 text-indigo-400',
    green:  'from-green-500/20 to-green-600/10 border-green-500/20 text-green-400',
    amber:  'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
    violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/20 text-violet-400',
  };
  return (
    <div className={clsx('glass-card p-4 bg-gradient-to-br border', colors[color])}>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-display font-bold text-white">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-70">{sub}</p>}
    </div>
  );
}

function ToolCard({ title, desc, icon: Icon, href, plan, userPlan, gradient, comingSoon }) {
  const accessible = !comingSoon && canAccess(userPlan, plan);
  const locked = !comingSoon && !accessible;

  return (
    <div className={clsx(
      'glass-card p-5 border border-white/5 relative overflow-hidden group transition-all duration-300',
      accessible && !comingSoon && 'hover:border-indigo-500/30 hover:-translate-y-0.5 hover:shadow-card-hover',
      comingSoon && 'opacity-60',
    )}>
      {/* Gradient accent */}
      <div className={clsx(
        'absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity',
        gradient
      )} />

      <div className="flex items-start justify-between mb-3 relative">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', gradient)}>
          <Icon size={18} className="text-white" />
        </div>
        {comingSoon ? (
          <Badge variant="comingsoon">Soon</Badge>
        ) : locked ? (
          <Lock size={14} className="text-slate-600 mt-1" />
        ) : (
          <Badge variant={plan}>{plan}</Badge>
        )}
      </div>

      <h3 className="font-display font-semibold text-white text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed mb-4">{desc}</p>

      {comingSoon ? (
        <span className="text-xs text-violet-400">Coming soon — stay tuned</span>
      ) : locked ? (
        <Link to="/onboarding/plan">
          <Button variant="outline" size="sm" className="text-xs">
            Upgrade to {plan} <ArrowRight size={12} />
          </Button>
        </Link>
      ) : (
        <Link to={href}>
          <Button variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300 p-0">
            Open <ArrowRight size={12} />
          </Button>
        </Link>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const plan = user?.plan || 'free';

  const tools = [
    // FREE
    {
      title: 'Question Bank',
      desc: 'Practice chapter-wise questions with difficulty filters.',
      icon: BookOpen,
      href: '/dashboard/question-bank',
      plan: 'free',
      gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    },
    {
      title: 'Mock Tests',
      desc: 'Timed tests with instant results and score analysis.',
      icon: FileText,
      href: '/dashboard/mock-test',
      plan: 'free',
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
    },
    // PRO
    {
      title: 'Formula Vault',
      desc: 'Every formula organized by subject and chapter.',
      icon: FlaskConical,
      href: '/dashboard/formula-vault',
      plan: 'pro',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-600',
    },
    {
      title: 'Study Planner',
      desc: 'Day-by-day plan based on your exam date and target.',
      icon: CalendarDays,
      href: '/dashboard/study-planner',
      plan: 'pro',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
    // TOPPER
    {
      title: 'Performance Analytics',
      desc: 'Deep insights, weak topic detection, progress tracking.',
      icon: BarChart3,
      href: '/dashboard/analytics',
      plan: 'topper',
      gradient: 'bg-gradient-to-br from-rose-500 to-pink-600',
    },
    // COMING SOON
    {
      title: 'AI Doubt Solver',
      desc: 'Get instant answers to any question, 24/7.',
      icon: MessageCircleQuestion,
      href: '#',
      plan: 'coming',
      gradient: 'bg-gradient-to-br from-slate-600 to-slate-700',
      comingSoon: true,
    },
    {
      title: 'Marks Predictor',
      desc: 'AI-powered HS Final marks prediction engine.',
      icon: Brain,
      href: '#',
      plan: 'coming',
      gradient: 'bg-gradient-to-br from-slate-600 to-slate-700',
      comingSoon: true,
    },
    {
      title: 'Student Scoreboard',
      desc: 'Rank yourself across school and state.',
      icon: Trophy,
      href: '#',
      plan: 'coming',
      gradient: 'bg-gradient-to-br from-slate-600 to-slate-700',
      comingSoon: true,
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Class {user?.class || '12'} · {user?.stream?.charAt(0).toUpperCase() + (user?.stream?.slice(1) || 'Science')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={plan} className="text-sm px-3 py-1">{plan?.toUpperCase()} PLAN</Badge>
            {plan !== 'topper' && (
              <Link to="/onboarding/plan">
                <Button size="sm" variant="outline">Upgrade</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Questions Solved" value="47" sub="of 100 free" color="indigo" />
        <StatCard label="Mock Tests Done" value="1" sub="of 1 this month" color="violet" />
        <StatCard label="Avg. Score" value="72%" sub="+5% from last test" color="green" />
        <StatCard label="Study Streak" value="3" sub="days in a row 🔥" color="amber" />
      </div>

      {/* Quick access */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Flame size={16} className="text-amber-400" />
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Today's Goal</h2>
        </div>
        <div className="glass-card p-4 border border-amber-500/15 bg-amber-500/5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-white font-medium text-sm">Complete 10 Physics questions</p>
              <p className="text-slate-400 text-xs mt-0.5">Chapter 2 — Laws of Motion · ~15 min</p>
            </div>
            <Link to="/dashboard/question-bank">
              <Button size="sm">
                Start Now <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full w-[30%] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
          </div>
          <p className="text-xs text-slate-500 mt-1">3 / 10 done</p>
        </div>
      </div>

      {/* FREE Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="free">Free</Badge>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Free Tools</h2>
          <div className="flex-1 h-px bg-white/5" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.filter(t => t.plan === 'free').map(tool => (
            <ToolCard key={tool.title} {...tool} userPlan={plan} />
          ))}
        </div>
      </section>

      {/* PRO Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="pro">Pro</Badge>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Pro Tools</h2>
          <div className="flex-1 h-px bg-white/5" />
          {!canAccess(plan, 'pro') && (
            <Link to="/onboarding/plan" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Unlock all <ArrowRight size={12} />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.filter(t => t.plan === 'pro').map(tool => (
            <ToolCard key={tool.title} {...tool} userPlan={plan} />
          ))}
        </div>
      </section>

      {/* TOPPER Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="topper">Topper</Badge>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Topper Tools</h2>
          <div className="flex-1 h-px bg-white/5" />
          {!canAccess(plan, 'topper') && (
            <Link to="/onboarding/plan" className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1">
              Unlock <ArrowRight size={12} />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.filter(t => t.plan === 'topper').map(tool => (
            <ToolCard key={tool.title} {...tool} userPlan={plan} />
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="comingsoon">Coming Soon</Badge>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Future Features</h2>
          <div className="flex-1 h-px bg-white/5" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.filter(t => t.comingSoon).map(tool => (
            <ToolCard key={tool.title} {...tool} userPlan={plan} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
