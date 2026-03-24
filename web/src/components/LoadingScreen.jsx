export default function LoadingScreen({ label = 'Loading your workspace...' }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel w-full max-w-sm rounded-3xl p-10 text-center shadow-soft">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-300/30 border-t-brand-300" />
        <p className="mt-6 text-sm font-medium text-slate-300">{label}</p>
      </div>
    </div>
  );
}

