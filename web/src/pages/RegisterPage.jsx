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
import { registerSchema } from '@/lib/validators';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);

    try {
      await registerUser(values);
      toast.success('Your account is ready.');
      navigate('/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="glass-panel rounded-[2rem] p-8 shadow-soft sm:p-10">
          <p className="font-display text-sm uppercase tracking-[0.28em] text-brand-300">Register</p>
          <h2 className="mt-4 font-display text-3xl text-white">Create your inventory command center</h2>
          <p className="mt-3 text-sm text-slate-400">
            Every user gets an isolated workspace with secure access to their own products and stock history.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <FormField label="Display name" error={errors.displayName?.message}>
              <Input placeholder="Alex Johnson" {...register('displayName')} />
            </FormField>

            <FormField label="Email address" error={errors.email?.message}>
              <Input placeholder="you@company.com" type="email" {...register('email')} />
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <Input placeholder="Use at least 6 characters" type="password" {...register('password')} />
            </FormField>

            <Button className="w-full" isLoading={submitting} type="submit">
              Create account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Already have an account?{' '}
            <Link className="font-semibold text-brand-300 transition hover:text-brand-200" to="/login">
              Sign in
            </Link>
          </p>
        </section>

        <section className="hidden rounded-[2rem] border border-white/10 bg-slate-950/40 p-10 shadow-soft lg:block">
          <p className="font-display text-sm uppercase tracking-[0.28em] text-brand-300">Operational clarity</p>
          <div className="mt-8 space-y-6">
            {[
              {
                title: 'Protected stock changes',
                description: 'Quantity updates run through Firebase Functions, which stop negative stock and store a movement audit.',
              },
              {
                title: 'Soft deletion',
                description: 'Products stay recoverable in Firestore while disappearing from active screens.',
              },
              {
                title: 'Realtime dashboard',
                description: 'Totals, low stock alerts, and recent movements update live from Firestore subscriptions.',
              },
            ].map((item, index) => (
              <div key={item.title} className="relative rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="absolute -left-3 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-400 text-sm font-bold text-slate-950">
                  {index + 1}
                </div>
                <h3 className="pl-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 pl-4 text-sm text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
