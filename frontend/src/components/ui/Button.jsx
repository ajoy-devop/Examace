import React from 'react';
import { clsx } from 'clsx';

const variants = {
  primary: 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-glow hover:shadow-glow border border-indigo-400/30',
  secondary: 'bg-violet-500 hover:bg-violet-600 text-white shadow-glow-violet hover:shadow-glow-violet border border-violet-400/30',
  outline: 'border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-400',
  ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
  danger: 'bg-rose-500 hover:bg-rose-600 text-white border border-rose-400/30',
  free: 'bg-green-500 hover:bg-green-600 text-white border border-green-400/30',
  pro: 'bg-amber-500 hover:bg-amber-600 text-white border border-amber-400/30',
  topper: 'bg-rose-500 hover:bg-rose-600 text-white border border-rose-400/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  fullWidth = false,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-navy-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'cursor-pointer select-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
}
