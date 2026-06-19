import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, FileText, Brain, CalendarDays,
  FlaskConical, BarChart3, Lock, Zap, ChevronLeft, ChevronRight, MessageCircleQuestion, Trophy, Bot, School
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';
import { clsx } from 'clsx';

const navSections = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', plan: 'free' },
    ]
  },
  {
    title: 'Study Tools',
    items: [
      { label: 'Question Bank', icon: BookOpen, href: '/dashboard/question-bank', plan: 'free' },
      { label: 'Mock Tests', icon: FileText, href: '/dashboard/mock-test', plan: 'free' },
      { label: 'Formula Vault', icon: FlaskConical, href: '/dashboard/formula-vault', plan: 'pro' },
      { label: 'Study Planner', icon: CalendarDays, href: '/dashboard/study-planner', plan: 'pro' },
    ]
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Performance', icon: BarChart3, href: '/dashboard/analytics', plan: 'topper' },
    ]
  },
  {
    title: 'Coming Soon',
    items: [
      { label: 'AI Doubt Solver', icon: MessageCircleQuestion, href: '#', plan: 'coming', soon: true },
      { label: 'Marks Predictor', icon: Brain, href: '#', plan: 'coming', soon: true },
      { label: 'Scoreboard', icon: Trophy, href: '#', plan: 'coming', soon: true },
      { label: 'AI Study Coach', icon: Bot, href: '#', plan: 'coming', soon: true },
      { label: 'School Rankings', icon: School, href: '#', plan: 'coming', soon: true },
    ]
  }
];

const planOrder = { free: 0, pro: 1, topper: 2 };

function canAccess(userPlan, requiredPlan) {
  if (requiredPlan === 'coming') return false;
  return planOrder[userPlan] >= planOrder[requiredPlan];
}

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col h-screen sticky top-0 border-r border-white/5 bg-navy-900/80 backdrop-blur transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-lg text-white">
            Exam<span className="gradient-text">Ace</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6" aria-label="Sidebar navigation">
        {navSections.map(section => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-2 mb-1 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map(item => {
                const isActive = location.pathname === item.href;
                const accessible = canAccess(user?.plan || 'free', item.plan);
                const Icon = item.icon;

                return (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className={clsx(
                        'flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-200 group relative',
                        isActive
                          ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                          : item.soon
                          ? 'text-slate-600 cursor-not-allowed'
                          : accessible
                          ? 'text-slate-400 hover:text-white hover:bg-white/5'
                          : 'text-slate-500 hover:bg-white/5'
                      )}
                      onClick={e => item.soon && e.preventDefault()}
                      title={collapsed ? item.label : undefined}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon size={16} className="flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="text-sm font-medium flex-1">{item.label}</span>
                          {item.soon && (
                            <span className="text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-1.5 py-0.5 rounded-full">
                              Soon
                            </span>
                          )}
                          {!item.soon && !accessible && (
                            <Lock size={12} className="text-slate-600" />
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User plan badge */}
      {!collapsed && user && (
        <div className="p-3 border-t border-white/5">
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">Current Plan</p>
            <Badge variant={user.plan}>{user.plan?.toUpperCase()}</Badge>
            {user.plan !== 'topper' && (
              <Link to="/onboarding/plan" className="block mt-2 text-xs text-indigo-400 hover:text-indigo-300">
                Upgrade →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-navy-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-card"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
