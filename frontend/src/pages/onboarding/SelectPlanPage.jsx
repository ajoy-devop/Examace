import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, Zap, Crown, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { clsx } from 'clsx';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    icon: Zap,
    color: 'free',
    borderSelected: 'border-green-500/50',
    borderDefault: 'border-white/10',
    glowSelected: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]',
    features: [
      '100 practice questions',
      '1 mock test per month',
      'Basic chapter notes',
    ],
    cta: 'Start Free',
    variant: 'outline',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹199',
    period: '/month',
    icon: Star,
    color: 'pro',
    borderSelected: 'border-amber-500/60',
    borderDefault: 'border-amber-500/20',
    glowSelected: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    popular: true,
    features: [
      'Unlimited questions',
      '20 mock tests / month',
      'Formula Vault',
      'Previous year questions',
      'Study Planner',
    ],
    cta: 'Start Pro',
    variant: 'pro',
  },
  {
    id: 'topper',
    name: 'Topper',
    price: '₹349',
    period: '/month',
    icon: Crown,
    color: 'topper',
    borderSelected: 'border-rose-500/60',
    borderDefault: 'border-rose-500/20',
    glowSelected: 'shadow-[0_0_30px_rgba(244,63,94,0.2)]',
    features: [
      'Everything in Pro',
      'Unlimited mock tests',
      'Performance analytics',
      'Weak topic detection',
      'Future: Marks Predictor',
    ],
    cta: 'Go Topper',
    variant: 'topper',
  },
];

export default function SelectPlanPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [selected, setSelected] = useState('free');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    updateUser({ plan: selected, onboarded: true });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl animate-slide-up">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-1.5 w-12 rounded-full bg-indigo-500 transition-all" />
          ))}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-white">Choose your plan</h1>
          <p className="text-slate-400 text-sm mt-2">Step 3 of 3 — You can upgrade anytime</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {plans.map(plan => {
            const isSelected = selected === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={clsx(
                  'glass-card p-5 text-left border transition-all duration-200 relative cursor-pointer',
                  isSelected
                    ? `${plan.borderSelected} ${plan.glowSelected}`
                    : `${plan.borderDefault} hover:border-white/20`
                )}
                aria-pressed={isSelected}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                      Popular
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <Badge variant={plan.color}>{plan.name}</Badge>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-display font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 text-xs ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <Check size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex-shrink-0">
            <ArrowLeft size={16} />
          </Button>
          <Button fullWidth size="lg" loading={loading} onClick={handleContinue}>
            {selected === 'free' ? 'Start for Free' : `Continue with ${plans.find(p => p.id === selected)?.name}`}
          </Button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          No credit card required for Free plan · Cancel Pro/Topper anytime
        </p>
      </div>
    </div>
  );
}
