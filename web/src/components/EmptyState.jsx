import { PackageSearch } from 'lucide-react';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="glass-panel rounded-3xl px-6 py-14 text-center shadow-soft">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-brand-300">
        <PackageSearch className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

