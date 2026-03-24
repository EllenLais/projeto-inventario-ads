import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '@/components/Button';
import FormField, { Input } from '@/components/FormField';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/firebaseErrors';
import { loginSchema } from '@/lib/validators';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);

    try {
      await login(values);
      toast.success('Welcome back.');
      navigate('/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[2rem] border border-white/10 bg-hero-grid p-10 shadow-soft lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-brand-300">StockPilot IMS</p>
            <h1 className="mt-6 max-w-xl font-display text-5xl leading-tight text-white">
              Keep every product movement accountable.
            </h1>
            <p className="mt-5 max-w-lg text-base text-slate-300">
              Real-time inventory, guarded stock adjustments, and a workflow that keeps audit trails attached to every unit.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Realtime sync', 'Track products and movements instantly.'],
              ['Secure access', 'Each user sees only their own data.'],
              ['Branch-based deploys', 'Ship safely to dev and production.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-8 shadow-soft sm:p-10">
          <p className="font-display text-sm uppercase tracking-[0.28em] text-brand-300">Sign in</p>
          <h2 className="mt-4 font-display text-3xl text-white">Access your inventory workspace</h2>
          <p className="mt-3 text-sm text-slate-400">
            Use your email and password to resume work exactly where you left off.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <FormField label="Email address" error={errors.email?.message}>
              <Input placeholder="you@company.com" type="email" {...register('email')} />
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <Input placeholder="••••••••" type="password" {...register('password')} />
            </FormField>

            <Button className="w-full" isLoading={submitting} type="submit">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            New here?{' '}
            <Link className="font-semibold text-brand-300 transition hover:text-brand-200" to="/register">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

