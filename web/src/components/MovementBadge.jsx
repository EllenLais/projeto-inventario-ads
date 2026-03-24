import { cn } from '@/lib/cn';

export default function MovementBadge({ type }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        type === 'IN'
          ? 'bg-emerald-400/15 text-emerald-200'
          : 'bg-rose-400/15 text-rose-200',
      )}
    >
      {type}
    </span>
  );
}

