import React, { useState } from 'react';
import {
  Users, BookOpen, FileText, Upload, CreditCard, BarChart3,
  Plus, Trash2, Edit2, Search, ChevronDown, Shield, FlaskConical,
  CheckCircle, AlertCircle, Package
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { clsx } from 'clsx';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'questions', label: 'Questions', icon: BookOpen },
  { id: 'subjects', label: 'Subjects & Chapters', icon: FlaskConical },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'plans', label: 'Plans', icon: Package },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

const mockUsers = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', class: '12', stream: 'Science', plan: 'pro', joined: 'Jun 12', status: 'active' },
  { id: 2, name: 'Priya Devi', email: 'priya@example.com', class: '11', stream: 'Science', plan: 'free', joined: 'Jun 14', status: 'active' },
  { id: 3, name: 'Ankit Roy', email: 'ankit@example.com', class: '12', stream: 'Science', plan: 'topper', joined: 'Jun 10', status: 'active' },
  { id: 4, name: 'Sneha Das', email: 'sneha@example.com', class: '11', stream: 'Science', plan: 'pro', joined: 'Jun 15', status: 'inactive' },
  { id: 5, name: 'Rohan Bose', email: 'rohan@example.com', class: '12', stream: 'Science', plan: 'free', joined: 'Jun 16', status: 'active' },
];

const mockPayments = [
  { id: 'PAY001', user: 'Rahul Sharma', plan: 'Pro', amount: '₹199', date: 'Jun 12', status: 'success', method: 'UPI' },
  { id: 'PAY002', user: 'Ankit Roy', plan: 'Topper', amount: '₹349', date: 'Jun 10', status: 'success', method: 'Card' },
  { id: 'PAY003', user: 'Sneha Das', plan: 'Pro', amount: '₹199', date: 'Jun 15', status: 'failed', method: 'UPI' },
  { id: 'PAY004', user: 'Meera Gill', plan: 'Pro', amount: '₹199', date: 'Jun 17', status: 'success', method: 'Netbanking' },
];

const subjects = [
  { name: 'Physics', class: '11 & 12', chapters: 14, questions: 420 },
  { name: 'Chemistry', class: '11 & 12', chapters: 16, questions: 390 },
  { name: 'Mathematics', class: '11 & 12', chapters: 16, questions: 480 },
  { name: 'Biology', class: '11 & 12', chapters: 20, questions: 310 },
];

// ─── Overview ───────────────────────────────────────────────────────────────
function OverviewTab() {
  const stats = [
    { label: 'Total Users', value: '5,241', delta: '+124 this week', color: 'indigo' },
    { label: 'Pro Subscribers', value: '892', delta: '+38 this week', color: 'amber' },
    { label: 'Topper Subscribers', value: '214', delta: '+12 this week', color: 'rose' },
    { label: 'MRR', value: '₹2.5L', delta: '+₹18K this week', color: 'green' },
    { label: 'Tests Taken', value: '18,420', delta: '+1,240 today', color: 'violet' },
    { label: 'Questions Solved', value: '1.2M', delta: 'All time', color: 'blue' },
  ];
  const colors = {
    indigo: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400',
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
    rose: 'border-rose-500/20 bg-rose-500/5 text-rose-400',
    green: 'border-green-500/20 bg-green-500/5 text-green-400',
    violet: 'border-violet-500/20 bg-violet-500/5 text-violet-400',
    blue: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
  };
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={clsx('glass-card p-5 border', colors[s.color])}>
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className="text-2xl font-display font-bold text-white">{s.value}</p>
            <p className="text-xs mt-1 opacity-70">{s.delta}</p>
          </div>
        ))}
      </div>
      <div className="glass-card p-5 border border-white/5">
        <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { msg: 'Ankit Roy upgraded to Topper plan', time: '2 min ago', icon: CheckCircle, color: 'text-green-400' },
            { msg: 'Payment failed for Sneha Das (Pro)', time: '14 min ago', icon: AlertCircle, color: 'text-rose-400' },
            { msg: 'New user signup: Rohan Bose', time: '1 hr ago', icon: Users, color: 'text-indigo-400' },
            { msg: 'Meera Gill completed Mock Test #3', time: '2 hr ago', icon: FileText, color: 'text-violet-400' },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <Icon size={15} className={a.color} />
                <span className="text-sm text-slate-300 flex-1">{a.msg}</span>
                <span className="text-xs text-slate-500 flex-shrink-0">{a.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Users ───────────────────────────────────────────────────────────────────
function UsersTab() {
  const [search, setSearch] = useState('');
  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-xl bg-navy-800/60 border border-white/10 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
          />
        </div>
        <Button size="sm"><Plus size={14} /> Add User</Button>
      </div>
      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-slate-400 uppercase tracking-wide">
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Class</th>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="text-white font-medium text-xs">{u.name}</p>
                        <p className="text-slate-500 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-xs">Class {u.class} · {u.stream}</td>
                  <td className="px-4 py-3"><Badge variant={u.plan}>{u.plan}</Badge></td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{u.joined}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('text-xs font-medium', u.status === 'active' ? 'text-green-400' : 'text-slate-500')}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all" aria-label="Edit user">
                        <Edit2 size={13} />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all" aria-label="Delete user">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Questions ────────────────────────────────────────────────────────────────
function QuestionsTab() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: 'Physics', chapter: '', type: 'MCQ', difficulty: 'Medium', text: '' });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-400 text-sm">Manage question bank content</p>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> Add Question
        </Button>
      </div>

      {showForm && (
        <div className="glass-card p-5 border border-indigo-500/20 mb-6 animate-slide-up">
          <h3 className="font-semibold text-white mb-4 text-sm">Add New Question</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            {[
              { label: 'Subject', key: 'subject', opts: ['Physics', 'Chemistry', 'Mathematics', 'Biology'] },
              { label: 'Type', key: 'type', opts: ['MCQ', 'Short Answer', 'Long Answer', 'Numerical'] },
              { label: 'Difficulty', key: 'difficulty', opts: ['Easy', 'Medium', 'Hard'] },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-slate-400 block mb-1">{f.label}</label>
                <select
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-navy-800/60 text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                >
                  {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="mb-3">
            <label className="text-xs text-slate-400 block mb-1">Chapter</label>
            <input
              type="text"
              placeholder="e.g. Laws of Motion"
              value={form.chapter}
              onChange={e => setForm(p => ({ ...p, chapter: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-navy-800/60 text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
            />
          </div>
          <div className="mb-4">
            <label className="text-xs text-slate-400 block mb-1">Question Text</label>
            <textarea
              rows={3}
              placeholder="Enter the question..."
              value={form.text}
              onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-navy-800/60 text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm">Save Question</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Questions', value: '1,600', color: 'indigo' },
          { label: 'MCQ', value: '980', color: 'violet' },
          { label: 'Short Answer', value: '360', color: 'amber' },
          { label: 'Numerical', value: '260', color: 'green' },
        ].map(s => (
          <div key={s.label} className={clsx(
            'glass-card p-4 border text-center',
            s.color === 'indigo' ? 'border-indigo-500/20' :
            s.color === 'violet' ? 'border-violet-500/20' :
            s.color === 'amber' ? 'border-amber-500/20' : 'border-green-500/20'
          )}>
            <p className="text-xl font-display font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Subjects & Chapters ─────────────────────────────────────────────────────
function SubjectsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-400 text-sm">Manage subjects and chapters</p>
        <Button size="sm"><Plus size={14} /> Add Subject</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map(s => (
          <div key={s.name} className="glass-card p-5 border border-white/5 hover:border-indigo-500/20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display font-semibold text-white">{s.name}</h3>
                <p className="text-xs text-slate-400">Class {s.class}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                  <Edit2 size={13} />
                </button>
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                  <Plus size={13} />
                </button>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-xl font-display font-bold text-white">{s.chapters}</p>
                <p className="text-xs text-slate-400">Chapters</p>
              </div>
              <div>
                <p className="text-xl font-display font-bold text-white">{s.questions}</p>
                <p className="text-xs text-slate-400">Questions</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Notes ────────────────────────────────────────────────────────────────────
function NotesTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-400 text-sm">Upload and manage study notes</p>
        <Button size="sm"><Upload size={14} /> Upload Notes</Button>
      </div>
      <div className="glass-card p-8 border-2 border-dashed border-white/10 text-center mb-4 hover:border-indigo-500/30 transition-all cursor-pointer">
        <Upload size={28} className="text-slate-500 mx-auto mb-3" />
        <p className="text-slate-300 text-sm font-medium">Drop PDF files here</p>
        <p className="text-slate-500 text-xs mt-1">or click to browse · PDF, DOCX up to 50MB</p>
      </div>
      <div className="space-y-2">
        {[
          { name: 'Physics Chapter 1 - Motion Notes.pdf', subject: 'Physics', size: '2.4 MB', uploaded: 'Jun 10' },
          { name: 'Chemistry Atomic Structure Complete.pdf', subject: 'Chemistry', size: '1.8 MB', uploaded: 'Jun 12' },
          { name: 'Math Trigonometry Quick Revision.pdf', subject: 'Mathematics', size: '0.9 MB', uploaded: 'Jun 14' },
        ].map(n => (
          <div key={n.name} className="glass-card p-3 border border-white/5 flex items-center gap-3">
            <FileText size={16} className="text-indigo-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{n.name}</p>
              <p className="text-xs text-slate-400">{n.subject} · {n.size} · {n.uploaded}</p>
            </div>
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all flex-shrink-0">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Plans ────────────────────────────────────────────────────────────────────
function PlansTab() {
  const plans = [
    { name: 'Free', price: '₹0', users: 4135, color: 'free' },
    { name: 'Pro', price: '₹199/mo', users: 892, color: 'pro' },
    { name: 'Topper', price: '₹349/mo', users: 214, color: 'topper' },
  ];
  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">Manage subscription plans and pricing</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.name} className="glass-card p-5 border border-white/5">
            <div className="flex items-start justify-between mb-4">
              <Badge variant={p.color}>{p.name}</Badge>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                <Edit2 size={13} />
              </button>
            </div>
            <p className="text-2xl font-display font-bold text-white mb-1">{p.price}</p>
            <p className="text-xs text-slate-400">{p.users.toLocaleString()} active users</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Payments ────────────────────────────────────────────────────────────────
function PaymentsTab() {
  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">All Razorpay transactions</p>
      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-slate-400 uppercase tracking-wide">
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Method</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockPayments.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{p.id}</td>
                  <td className="px-4 py-3 text-slate-200 text-xs">{p.user}</td>
                  <td className="px-4 py-3"><Badge variant={p.plan.toLowerCase()}>{p.plan}</Badge></td>
                  <td className="px-4 py-3 text-white font-medium text-xs">{p.amount}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{p.method}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{p.date}</td>
                  <td className="px-4 py-3">
                    <span className={clsx(
                      'text-xs font-medium px-2 py-0.5 rounded-full',
                      p.status === 'success'
                        ? 'bg-green-500/15 text-green-400'
                        : 'bg-rose-500/15 text-rose-400'
                    )}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabContent = {
    overview: <OverviewTab />,
    users: <UsersTab />,
    questions: <QuestionsTab />,
    subjects: <SubjectsTab />,
    notes: <NotesTab />,
    plans: <PlansTab />,
    payments: <PaymentsTab />,
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={18} className="text-rose-400" />
          <h1 className="text-2xl font-display font-bold text-white">Admin Panel</h1>
          <Badge variant="danger">Admin</Badge>
        </div>
        <p className="text-slate-400 text-sm">Manage all ExamAce content, users, and payments</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap mb-6 p-1 glass-card border border-white/5">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                activeTab === t.id
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {tabContent[activeTab]}
      </div>
    </DashboardLayout>
  );
}
