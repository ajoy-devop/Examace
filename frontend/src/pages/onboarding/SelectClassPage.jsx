import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';

const classes = [
  { value: '11', label: 'Class 11', desc: 'First year — build your foundation' },
  { value: '12', label: 'Class 12', desc: 'Board year — aim for 85%+' },
];

export default function SelectClassPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [selected, setSelected] = useState(null);

  const handleNext = () => {
    if (!selected) return;
    updateUser({ class: selected });
    navigate('/onboarding/stream');
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1,2,3].map(n => (
            <div key={n} className={clsx(
              'h-1.5 rounded-full transition-all',
              n === 1 ? 'w-12 bg-indigo-500' : 'w-8 bg-white/10'
            )} />
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <GraduationCap size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Select your class</h1>
          <p className="text-slate-400 text-sm mt-2">Step 1 of 3 — We'll personalize your content</p>
        </div>

        <div className="glass-card p-6 space-y-3">
          {classes.map(cls => (
            <button
              key={cls.value}
              onClick={() => setSelected(cls.value)}
              className={clsx(
                'w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer',
                selected === cls.value
                  ? 'border-indigo-500/60 bg-indigo-500/15 shadow-glow'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              )}
              aria-pressed={selected === cls.value}
            >
              <div className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg transition-all',
                selected === cls.value
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/5 text-slate-400'
              )}>
                {cls.value}
              </div>
              <div>
                <p className="font-semibold text-white">{cls.label}</p>
                <p className="text-xs text-slate-400">{cls.desc}</p>
              </div>
              {selected === cls.value && (
                <div className="ml-auto w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}

          <div className="pt-2">
            <Button fullWidth size="lg" disabled={!selected} onClick={handleNext}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
