import React from 'react';
import { clsx } from 'clsx';

const variants = {
  free: 'badge-free',
  pro: 'badge-pro',
  topper: 'badge-topper',
  default: 'bg-slate-700/50 text-slate-300 border border-slate-600/30',
  success: 'bg-green-500/15 text-green-400 border border-green-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
  info: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
  comingsoon: 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
