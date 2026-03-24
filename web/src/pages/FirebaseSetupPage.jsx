import Card from '@/components/Card';
import { firebaseStatus } from '@/services/firebase/client';

export default function FirebaseSetupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <Card className="w-full max-w-3xl space-y-8">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.28em] text-brand-300">
            Firebase setup required
          </p>
          <h1 className="mt-3 font-display text-4xl text-white">
            The app is missing its Firebase environment values
          </h1>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            The current Vite mode is <span className="font-semibold text-white">{firebaseStatus.mode}</span>,
            so this app expects values in{' '}
            <code className="rounded bg-white/10 px-2 py-1 text-brand-200">
              web/{firebaseStatus.expectedEnvFile}
            </code>
            .
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">Missing keys</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {firebaseStatus.missingConfig.map((item) => (
                <li key={item}>
                  <code className="rounded bg-slate-950/70 px-2 py-1 text-brand-200">{item}</code>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">Quick fix</p>
            <ol className="mt-3 space-y-3 text-sm text-slate-300">
              <li>1. Copy the example file for this environment.</li>
              <li>2. Paste the Firebase Web App values from the Firebase Console.</li>
              <li>3. Restart the Vite dev server.</li>
            </ol>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <p className="text-sm font-semibold text-white">Suggested commands</p>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-200">
{`cp web/.env.dev.example web/.env.dev
# then fill in the values from Firebase Console

npm run dev`}
          </pre>
        </div>
      </Card>
    </div>
  );
}

