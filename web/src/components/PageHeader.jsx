export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="font-display text-sm uppercase tracking-[0.28em] text-brand-300">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 text-sm text-slate-300 sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

