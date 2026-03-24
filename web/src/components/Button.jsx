import { cn } from '@/lib/cn';

const styles = {
  primary:
    'bg-brand-400 text-slate-950 shadow-lg shadow-brand-500/20 hover:bg-brand-300 focus-visible:ring-brand-300',
  secondary:
    'border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10 focus-visible:ring-slate-300',
  ghost:
    'text-slate-200 hover:bg-white/10 focus-visible:ring-slate-300',
  danger:
    'bg-rose-500/90 text-white hover:bg-rose-400 focus-visible:ring-rose-300',
};

export default function Button({
  children,
  className,
  variant = 'primary',
  isLoading = false,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60',
        styles[variant],
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'Please wait...' : children}
    </button>
  );
}

