import React from 'react';
import { clsx } from 'clsx';

export default function Card({ children, className = '', hover = false, glow = false, ...props }) {
  return (
    <div
      className={clsx(
        'glass-card p-5 transition-all duration-300',
        hover && 'hover:border-indigo-500/30 hover:-translate-y-0.5 hover:shadow-card-hover cursor-pointer',
        glow && 'shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={clsx('text-lg font-bold text-slate-100 font-display', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={clsx('text-sm text-slate-400 mt-1', className)}>
      {children}
    </p>
  );
}
