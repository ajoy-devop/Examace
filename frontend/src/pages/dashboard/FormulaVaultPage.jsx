import React, { useState } from 'react';
import { FlaskConical, Search, Copy, Check, Lock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

const formulaData = {
  Physics: {
    'Motion': [
      { name: 'Velocity', formula: 'v = u + at', desc: 'Final velocity from initial velocity and acceleration' },
      { name: 'Displacement', formula: 's = ut + ½at²', desc: 'Displacement under constant acceleration' },
      { name: 'Velocity-Displacement', formula: 'v² = u² + 2as', desc: 'Relates final velocity and displacement' },
      { name: 'Average Velocity', formula: 'v_avg = (u + v) / 2', desc: 'For uniform acceleration only' },
    ],
    'Laws of Motion': [
      { name: 'Newton\'s 2nd Law', formula: 'F = ma', desc: 'Force equals mass times acceleration' },
      { name: 'Momentum', formula: 'p = mv', desc: 'Linear momentum of a body' },
      { name: 'Impulse', formula: 'J = F·Δt = Δp', desc: 'Change in momentum equals impulse' },
    ],
    'Gravitation': [
      { name: 'Gravitational Force', formula: 'F = Gm₁m₂/r²', desc: 'Newton\'s law of universal gravitation' },
      { name: 'Escape Velocity', formula: 'v_e = √(2gR)', desc: 'Minimum speed to escape Earth\'s gravity' },
      { name: 'Orbital Velocity', formula: 'v_o = √(gR)', desc: 'Velocity for circular orbit near Earth' },
    ],
    'Work & Energy': [
      { name: 'Work Done', formula: 'W = F·d·cos θ', desc: 'Work done by force at angle θ' },
      { name: 'Kinetic Energy', formula: 'KE = ½mv²', desc: 'Energy due to motion' },
      { name: 'Potential Energy', formula: 'PE = mgh', desc: 'Gravitational potential energy' },
    ],
  },
  Chemistry: {
    'Atomic Structure': [
      { name: 'Energy of Orbital', formula: 'E_n = -13.6/n² eV', desc: 'Energy of electron in nth orbit (Hydrogen)' },
      { name: 'Radius of Orbit', formula: 'r_n = 0.529n²/Z Å', desc: 'Bohr radius for nth orbit' },
      { name: 'De Broglie', formula: 'λ = h/mv', desc: 'Wavelength of matter waves' },
    ],
    'Thermodynamics': [
      { name: 'First Law', formula: 'ΔU = q + w', desc: 'Change in internal energy' },
      { name: 'Enthalpy', formula: 'ΔH = ΔU + ΔnRT', desc: 'For gaseous reactions' },
      { name: 'Gibbs Energy', formula: 'ΔG = ΔH - TΔS', desc: 'Spontaneity criterion' },
    ],
    'Equilibrium': [
      { name: 'Equilibrium Constant', formula: 'Kc = [Products]^n / [Reactants]^m', desc: 'At equilibrium state' },
      { name: 'pH', formula: 'pH = -log[H⁺]', desc: 'Hydrogen ion concentration measure' },
      { name: 'Henderson-Hasselbalch', formula: 'pH = pKa + log([A⁻]/[HA])', desc: 'Buffer solution pH' },
    ],
  },
  Mathematics: {
    'Trigonometry': [
      { name: 'sin²+cos²', formula: 'sin²θ + cos²θ = 1', desc: 'Pythagorean identity' },
      { name: '1+tan²', formula: '1 + tan²θ = sec²θ', desc: 'Pythagorean identity' },
      { name: 'sin(A+B)', formula: 'sin(A+B) = sinA·cosB + cosA·sinB', desc: 'Sum formula' },
      { name: 'cos(A+B)', formula: 'cos(A+B) = cosA·cosB - sinA·sinB', desc: 'Sum formula' },
    ],
    'Limits & Derivatives': [
      { name: 'Power Rule', formula: 'd/dx(xⁿ) = nxⁿ⁻¹', desc: 'Derivative of power function' },
      { name: 'sin limit', formula: 'lim(x→0) sin(x)/x = 1', desc: 'Standard limit' },
      { name: 'Chain Rule', formula: 'd/dx[f(g(x))] = f\'(g(x))·g\'(x)', desc: 'Derivative of composite function' },
    ],
    'Quadratic': [
      { name: 'Quadratic Formula', formula: 'x = (-b ± √(b²-4ac)) / 2a', desc: 'Roots of ax²+bx+c=0' },
      { name: 'Sum of roots', formula: 'α + β = -b/a', desc: 'Sum of roots of quadratic' },
      { name: 'Product of roots', formula: 'α · β = c/a', desc: 'Product of roots of quadratic' },
    ],
  },
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-all text-slate-500 hover:text-indigo-400 p-1 rounded"
      aria-label="Copy formula"
    >
      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
    </button>
  );
}

function LockedOverlay() {
  return (
    <div className="glass-card p-12 text-center border border-amber-500/20">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
        <Lock size={28} className="text-amber-400" />
      </div>
      <Badge variant="pro" className="mb-3">Pro Feature</Badge>
      <h2 className="text-xl font-display font-bold text-white mb-2">Formula Vault</h2>
      <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
        Every Physics, Chemistry, and Mathematics formula organized by chapter. Searchable and quick to copy.
      </p>
      <Link to="/onboarding/plan">
        <Button variant="pro" size="lg">Upgrade to Pro</Button>
      </Link>
    </div>
  );
}

export default function FormulaVaultPage() {
  const { user } = useAuth();
  const isPro = user?.plan === 'pro' || user?.plan === 'topper';
  const [activeSubject, setActiveSubject] = useState('Physics');
  const [search, setSearch] = useState('');

  if (!isPro) return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical size={18} className="text-green-400" />
          <h1 className="text-2xl font-display font-bold text-white">Formula Vault</h1>
        </div>
      </div>
      <LockedOverlay />
    </DashboardLayout>
  );

  const subjectData = formulaData[activeSubject] || {};
  const allFormulas = Object.entries(subjectData).flatMap(([chapter, formulas]) =>
    formulas.map(f => ({ ...f, chapter }))
  );
  const filtered = search
    ? allFormulas.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.formula.toLowerCase().includes(search.toLowerCase()) ||
        f.chapter.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const subjectColors = {
    Physics: { badge: 'info', icon: 'text-indigo-400', border: 'border-indigo-500/20' },
    Chemistry: { badge: 'success', icon: 'text-green-400', border: 'border-green-500/20' },
    Mathematics: { badge: 'warning', icon: 'text-amber-400', border: 'border-amber-500/20' },
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical size={18} className="text-green-400" />
          <h1 className="text-2xl font-display font-bold text-white">Formula Vault</h1>
        </div>
        <p className="text-slate-400 text-sm">All formulas organized by subject and chapter · Click to copy</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search formulas, chapter names..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-3 rounded-xl bg-navy-800/60 border border-white/10 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
        />
      </div>

      {/* Subject tabs */}
      {!search && (
        <div className="flex gap-2 mb-6">
          {Object.keys(formulaData).map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                activeSubject === sub
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Search results */}
      {search && (
        <div>
          <p className="text-sm text-slate-400 mb-4">
            Found <span className="text-white font-medium">{filtered.length}</span> formulas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((f, i) => (
              <div key={i} className="glass-card p-4 border border-white/5 group hover:border-indigo-500/20 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-slate-500">{f.chapter}</p>
                    <p className="text-sm font-semibold text-white">{f.name}</p>
                  </div>
                  <CopyButton text={f.formula} />
                </div>
                <div className="bg-navy-950/80 rounded-lg p-2 mb-2 font-mono text-indigo-300 text-sm">
                  {f.formula}
                </div>
                <p className="text-xs text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chapter sections */}
      {!search && Object.entries(subjectData).map(([chapter, formulas]) => (
        <div key={chapter} className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-display font-semibold text-white text-sm">{chapter}</h2>
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-slate-500">{formulas.length} formulas</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {formulas.map((f, i) => (
              <div
                key={i}
                className={clsx(
                  'glass-card p-4 border group hover:border-indigo-500/20 transition-all duration-200',
                  subjectColors[activeSubject].border
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-white">{f.name}</p>
                  <CopyButton text={f.formula} />
                </div>
                <div className="bg-navy-950/80 rounded-lg p-2.5 mb-2 font-mono text-indigo-300 text-sm leading-relaxed">
                  {f.formula}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </DashboardLayout>
  );
}
