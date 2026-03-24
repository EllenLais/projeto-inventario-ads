import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Boxes,
  LogOut,
  PackagePlus,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/Button';
import { cn } from '@/lib/cn';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/firebaseErrors';
import { toast } from 'sonner';

const navigation = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/products', label: 'Products', icon: Boxes },
  { to: '/products/new', label: 'New Product', icon: PackagePlus },
];

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, profile, user } = useAuth();

  const isNavItemActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    if (path === '/products') {
      return location.pathname.startsWith('/products') && location.pathname !== '/products/new';
    }

    if (path === '/products/new') {
      return location.pathname === '/products/new';
    }

    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('You have been logged out.');
      navigate('/login');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl gap-4">
        <aside
          className={cn(
            'glass-panel fixed inset-y-4 left-4 z-40 w-[280px] rounded-3xl p-4 transition duration-300 lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]',
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <Link className="flex items-center gap-3" to="/">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-400 text-slate-950">
                  <Boxes className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-lg text-white">StockPilot</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-brand-300">Inventory OS</p>
                </div>
              </Link>
              <button
                className="rounded-2xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
                onClick={() => setSidebarOpen(false)}
                type="button"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-10 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    className={() =>
                      cn(
                        'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                        isNavItemActive(item.to)
                          ? 'bg-brand-400 text-slate-950'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white',
                      )
                    }
                    onClick={() => setSidebarOpen(false)}
                    to={item.to}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">
                {profile?.displayName || user?.displayName || 'Inventory User'}
              </p>
              <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
              <Button className="mt-4 w-full" onClick={handleLogout} variant="secondary">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {sidebarOpen ? (
          <button
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            type="button"
          />
        ) : null}

        <main className="flex-1">
          <div className="glass-panel min-h-[calc(100vh-2rem)] rounded-[2rem] p-5 shadow-soft sm:p-8">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <button
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100"
                onClick={() => setSidebarOpen(true)}
                type="button"
              >
                <PanelLeftOpen className="h-4 w-4" />
                Menu
              </button>
              <Link className="font-display text-lg text-white" to="/">
                StockPilot
              </Link>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
