import React from 'react';
import { clsx } from 'clsx';

export default function Input({
  label,
  error,
  helper,
  className = '',
  containerClassName = '',
  icon: Icon,
  required = false,
  ...props
}) {
  const id = props.id || props.name;
  return (
    <div className={clsx('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-300"
        >
          {label}
          {required && <span className="text-rose-400 ml-1" aria-label="required">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          id={id}
          className={clsx(
            'w-full rounded-xl border bg-navy-800/60 text-slate-100 placeholder-slate-500',
            'px-4 py-3 text-sm transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon && 'pl-10',
            error
              ? 'border-rose-500/50 focus:ring-rose-500/30'
              : 'border-white/10 hover:border-white/20',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-rose-400 flex items-center gap-1" role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          {error}
        </p>
      )}
      {helper && !error && (
        <p id={`${id}-helper`} className="text-xs text-slate-500">{helper}</p>
      )}
    </div>
  );
}
