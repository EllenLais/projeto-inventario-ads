import { cn } from '@/lib/cn';

export default function Card({ children, className }) {
  return (
    <div className={cn('glass-panel rounded-3xl p-6 shadow-soft', className)}>
      {children}
    </div>
  );
}

