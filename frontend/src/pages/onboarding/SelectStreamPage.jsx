import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Calculator, BookOpen, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { clsx } from 'clsx';

const streams = [
  {
    value: 'science',
    label: 'Science',
    icon: FlaskConical,
    desc: 'Physics, Chemistry, Maths, Biology',
    available: true,
    color: 'from-indigo-500 to-violet-600',
  },
  {
    value: 'commerce',
    label: 'Commerce',
    icon: Calculator,
    desc: 'Accounts, Economics, Business Studies',
    available: false,
    color: 'from-slate-600 to-slate-700',
  },
  {
    value: 'arts',
    label: 'Arts',
    icon: BookOpen,
    desc: 'History, Political Science, Literature',
    available: false,
    color: 'from-slate-600 to-slate-700',
  },
];

export default function SelectStreamPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [selected, setSelected] = useState(null);

  const handleNext = () => {
    if (!selected) return;
    updateUser({ stream: selected });
    navigate('/onboarding/plan');
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1,2,3].map(n => (
            <div key={n} className={clsx(
              'h-1.5 rounded-full transition-all',
              n <= 2 ? 'w-12 bg-indigo-500' : 'w-8 bg-white/10'
            )} />
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <FlaskConical size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Select your stream</h1>
          <p className="text-slate-400 text-sm mt-2">Step 2 of 3 — We'll load the right subjects</p>
        </div>

        <div className="glass-card p-6 space-y-3">
          {streams.map(stream => {
            const Icon = stream.icon;
            return (
              <button
                key={stream.value}
                onClick={() => stream.available && setSelected(stream.value)}
                disabled={!stream.available}
                className={clsx(
                  'w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left',
                  !stream.available && 'cursor-not-allowed opacity-50',
                  stream.available && selected === stream.value
                    ? 'border-indigo-500/60 bg-indigo-500/15 shadow-glow cursor-pointer'
                    : stream.available
                    ? 'border-white/10 hover:border-white/20 hover:bg-white/5 cursor-pointer'
                    : 'border-white/5'
                )}
                aria-pressed={selected === stream.value}
              >
                <div className={clsx(
                  'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center transition-all',
                  stream.color
                )}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{stream.label}</p>
                    {!stream.available && <Badge variant="comingsoon">Soon</Badge>}
                  </div>
                  <p className="text-xs text-slate-400">{stream.desc}</p>
                </div>
                {selected === stream.value && (
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
            </Button>
            <Button fullWidth size="lg" disabled={!selected} onClick={handleNext}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
