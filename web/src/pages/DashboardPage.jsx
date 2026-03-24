import { AlertTriangle, ArrowRight, Boxes, History, PackagePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import MovementBadge from '@/components/MovementBadge';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatDateTime } from '@/lib/formatters';

export default function DashboardPage() {
  const { user } = useAuth();
  const { totalProducts, totalStockItems, lowStockProducts, recentMovements, loading, error } =
    useDashboardData(user?.uid);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="See what needs attention now"
        description="A live snapshot of your catalog, stock volume, and the latest movements flowing through the system."
        action={
          <Link to="/products/new">
            <Button>
              <PackagePlus className="h-4 w-4" />
              Add product
            </Button>
          </Link>
        }
      />

      {error ? (
        <Card className="border-rose-400/30 bg-rose-500/10">
          <p className="text-sm font-medium text-rose-100">{error}</p>
        </Card>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-3">
        <StatCard
          label="Total products"
          value={loading ? '...' : totalProducts}
          helper="Active products currently visible in your catalog."
        />
        <StatCard
          accent="emerald"
          label="Total stock items"
          value={loading ? '...' : totalStockItems}
          helper="Combined quantity across all non-deleted products."
        />
        <StatCard
          accent="rose"
          label="Low stock alerts"
          value={loading ? '...' : lowStockProducts.length}
          helper="Products with fewer than 5 units on hand."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-sm uppercase tracking-[0.25em] text-brand-300">Low stock</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Products to replenish</h2>
            </div>
            <AlertTriangle className="h-6 w-6 text-rose-300" />
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
              <p className="text-lg font-semibold text-white">No urgent replenishment items</p>
              <p className="mt-2 text-sm text-slate-400">Everything is above the low-stock threshold right now.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-white">{product.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-rose-400/15 px-3 py-1 text-xs font-semibold text-rose-200">
                      {product.quantity} units left
                    </span>
                    <Link className="text-sm font-semibold text-brand-300 hover:text-brand-200" to={`/products/${product.id}`}>
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-sm uppercase tracking-[0.25em] text-brand-300">Movements</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Recent activity</h2>
            </div>
            <History className="h-6 w-6 text-slate-300" />
          </div>

          {recentMovements.length === 0 ? (
            <EmptyState
              title="No movement history yet"
              description="Create a product or adjust stock to start building your audit timeline."
              action={
                <Link to="/products/new">
                  <Button variant="secondary">Create first product</Button>
                </Link>
              }
            />
          ) : (
            <div className="mt-6 space-y-4">
              {recentMovements.map((movement) => (
                <div key={movement.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Product</p>
                      <p className="mt-1 font-semibold text-white">{movement.productName}</p>
                    </div>
                    <MovementBadge type={movement.type} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                    <p>{movement.quantity} units</p>
                    <p>{formatDateTime(movement.createdAt)}</p>
                  </div>
                  {movement.reason ? <p className="mt-3 text-sm text-slate-400">{movement.reason}</p> : null}
                </div>
              ))}
            </div>
          )}

          <Link className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200" to="/products">
            <Boxes className="h-4 w-4" />
            Go to products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </section>
    </div>
  );
}
