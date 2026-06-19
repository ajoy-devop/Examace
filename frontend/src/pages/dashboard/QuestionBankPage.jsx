import React, { useState } from 'react';
import { Search, Filter, BookOpen, ChevronRight, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { clsx } from 'clsx';

const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const types = ['All', 'MCQ', 'Short Answer', 'Long Answer', 'Numerical'];

const mockQuestions = [
  { id: 1, subject: 'Physics', chapter: 'Laws of Motion', difficulty: 'Medium', type: 'MCQ', text: 'A body of mass 5 kg is acted upon by a net force of 20 N. What is its acceleration?', options: ['2 m/s²', '4 m/s²', '10 m/s²', '100 m/s²'], answer: 1 },
  { id: 2, subject: 'Chemistry', chapter: 'Atomic Structure', difficulty: 'Easy', type: 'MCQ', text: 'The number of electrons in the outermost shell of sodium (Na, Z=11) is:', options: ['1', '2', '3', '8'], answer: 0 },
  { id: 3, subject: 'Mathematics', chapter: 'Limits', difficulty: 'Hard', type: 'Numerical', text: 'Find the value of lim(x→0) [sin(3x)/x]', options: null, answer: '3' },
  { id: 4, subject: 'Physics', chapter: 'Gravitation', difficulty: 'Easy', type: 'MCQ', text: 'The value of acceleration due to gravity on the surface of Earth is approximately:', options: ['8.9 m/s²', '9.8 m/s²', '10.8 m/s²', '11.2 m/s²'], answer: 1 },
  { id: 5, subject: 'Chemistry', chapter: 'Chemical Bonding', difficulty: 'Medium', type: 'Short Answer', text: 'Explain the concept of hybridization and its types with one example each.', options: null, answer: null },
  { id: 6, subject: 'Mathematics', chapter: 'Matrices', difficulty: 'Medium', type: 'Numerical', text: 'If A = [[2,3],[1,4]], find det(A).', options: null, answer: '5' },
];

const diffColors = { Easy: 'success', Medium: 'warning', Hard: 'danger' };

function QuestionCard({ q, index }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card p-5 border border-white/5 hover:border-indigo-500/20 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xs text-slate-500 font-mono mt-0.5">Q{index + 1}</span>
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="info">{q.subject}</Badge>
            <Badge variant="default">{q.chapter}</Badge>
            <Badge variant={diffColors[q.difficulty]}>{q.difficulty}</Badge>
            <Badge variant="default">{q.type}</Badge>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">{q.text}</p>
        </div>
      </div>

      {q.options ? (
        <div className="space-y-2 mt-4">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => !revealed && setSelected(i)}
              className={clsx(
                'w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all duration-200',
                revealed && i === q.answer
                  ? 'border-green-500/50 bg-green-500/10 text-green-300'
                  : revealed && selected === i && i !== q.answer
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                  : selected === i
                  ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                  : 'border-white/5 text-slate-300 hover:border-white/15 hover:bg-white/5'
              )}
              disabled={revealed}
            >
              <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
          <Button
            size="sm"
            variant={revealed ? 'ghost' : 'outline'}
            onClick={() => setRevealed(!revealed)}
            className="mt-2"
          >
            {revealed ? 'Hide Answer' : 'Check Answer'}
          </Button>
        </div>
      ) : (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            {expanded ? 'Hide' : 'Show'} answer hint
            <ChevronRight size={12} className={clsx('transition-transform', expanded && 'rotate-90')} />
          </button>
          {expanded && q.answer && (
            <div className="mt-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-300">
              Answer: {q.answer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuestionBankPage() {
  const [subject, setSubject] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [type, setType] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = mockQuestions.filter(q => {
    if (subject !== 'All' && q.subject !== subject) return false;
    if (difficulty !== 'All' && q.difficulty !== difficulty) return false;
    if (type !== 'All' && q.type !== type) return false;
    if (search && !q.text.toLowerCase().includes(search.toLowerCase()) && !q.chapter.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={18} className="text-indigo-400" />
          <h1 className="text-2xl font-display font-bold text-white">Question Bank</h1>
        </div>
        <p className="text-slate-400 text-sm">Practice chapter-wise questions · Filter by subject, difficulty, and type</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search questions or chapters..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-navy-800/60 border border-white/10 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
            aria-label="Search questions"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Subject</label>
            <div className="flex flex-wrap gap-1.5">
              {subjects.map(s => (
                <button key={s} onClick={() => setSubject(s)}
                  className={clsx('px-3 py-1 rounded-lg text-xs font-medium border transition-all',
                    subject === s
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                      : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300'
                  )}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Difficulty</label>
            <div className="flex gap-1.5">
              {difficulties.map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={clsx('px-3 py-1 rounded-lg text-xs font-medium border transition-all',
                    difficulty === d
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                      : 'border-white/10 text-slate-400 hover:border-white/20'
                  )}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Type</label>
            <div className="flex flex-wrap gap-1.5">
              {types.map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={clsx('px-3 py-1 rounded-lg text-xs font-medium border transition-all',
                    type === t
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                      : 'border-white/10 text-slate-400 hover:border-white/20'
                  )}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">
          Showing <span className="text-white font-medium">{filtered.length}</span> questions
        </p>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <CheckCircle size={12} className="text-green-400" />
          <span>Click options to check answers</span>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Search size={32} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No questions match your filters</p>
            <button onClick={() => { setSubject('All'); setDifficulty('All'); setType('All'); setSearch(''); }}
              className="text-sm text-indigo-400 hover:text-indigo-300 mt-2 transition-colors">
              Clear all filters
            </button>
          </div>
        ) : (
          filtered.map((q, i) => <QuestionCard key={q.id} q={q} index={i} />)
        )}
      </div>
    </DashboardLayout>
  );
}
