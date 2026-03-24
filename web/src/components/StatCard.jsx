import Card from '@/components/Card';

export default function StatCard({ label, value, helper, accent = 'brand' }) {
  const accents = {
    brand: 'from-brand-400/20 to-brand-400/5 text-brand-200',
    emerald: 'from-emerald-400/20 to-emerald-400/5 text-emerald-200',
    rose: 'from-rose-400/20 to-rose-400/5 text-rose-200',
  };

  return (
    <Card className={`overflow-hidden bg-gradient-to-br ${accents[accent]}`}>
      <p className="text-sm font-medium text-slate-300">{label}</p>
      <p className="mt-3 text-4xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{helper}</p>
    </Card>
  );
}

