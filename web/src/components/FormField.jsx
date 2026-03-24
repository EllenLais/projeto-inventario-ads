import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export default function FormField({ label, error, hint, className, children }) {
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      <span className="text-sm font-semibold text-slate-100">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      {error ? <span className="text-sm text-rose-300">{error}</span> : null}
    </label>
  );
}

export const Input = forwardRef(function Input(props, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30',
        props.className,
      )}
    />
  );
});

export const Textarea = forwardRef(function Textarea(props, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={cn(
        'min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30',
        props.className,
      )}
    />
  );
});

export const Select = forwardRef(function Select(props, ref) {
  return (
    <select
      ref={ref}
      {...props}
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30',
        props.className,
      )}
    />
  );
});
