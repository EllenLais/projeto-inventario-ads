import { AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '@/components/Button';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import MovementBadge from '@/components/MovementBadge';
import PageHeader from '@/components/PageHeader';
import StockAdjustmentDialog from '@/components/StockAdjustmentDialog';
import { useAuth } from '@/hooks/useAuth';
import { useProductRecord } from '@/hooks/useProductRecord';
import { formatCurrency, formatDateTime, formatMovementType } from '@/lib/formatters';
import { getErrorMessage } from '@/lib/firebaseErrors';
import { deleteProduct, updateStock } from '@/services/productService';

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { product, movements, loading, error } = useProductRecord(user?.uid, productId);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <div className="text-sm text-slate-300">Loading product...</div>;
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This item does not exist, was deleted, or does not belong to the current account."
        action={
          <Link to="/products">
            <Button variant="secondary">Back to products</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Product details"
        title={product.name}
        description={product.description || 'No description added for this product.'}
        action={
          <div className="flex flex-wrap gap-3">
            <Link to={`/products/${product.id}/edit`}>
              <Button variant="secondary">
                <Pencil className="h-4 w-4" />
                Edit metadata
              </Button>
            </Link>
            <Button onClick={() => setModalOpen(true)}>
              <AlertTriangle className="h-4 w-4" />
              Adjust stock
            </Button>
          </div>
        }
      />

      {error ? <p className="text-sm text-rose-200">{error}</p> : null}

      <section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <Card className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Category</p>
              <p className="mt-2 text-xl font-semibold text-white">{product.category}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Price</p>
              <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(product.price)}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Current stock</p>
              <p className="mt-2 text-xl font-semibold text-white">{product.quantity} units</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Last updated</p>
              <p className="mt-2 text-xl font-semibold text-white">{formatDateTime(product.updatedAt)}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-rose-100">Danger zone</p>
                <p className="mt-2 text-sm text-rose-100/80">
                  Deleting a product performs a soft delete so data stays recoverable in Firestore.
                </p>
              </div>
              <Button
                onClick={async () => {
                  const confirmed = window.confirm(
                    'Soft delete this product? It will disappear from active lists but remain in Firestore.',
                  );

                  if (!confirmed) {
                    return;
                  }

                  setSubmitting(true);

                  try {
                    await deleteProduct({ productId: product.id });
                    toast.success('Product deleted successfully.');
                    navigate('/products');
                  } catch (deleteError) {
                    toast.error(getErrorMessage(deleteError));
                  } finally {
                    setSubmitting(false);
                  }
                }}
                variant="danger"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-sm uppercase tracking-[0.25em] text-brand-300">Timeline</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Movement history</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
              {movements.length} entries
            </span>
          </div>

          {movements.length === 0 ? (
            <EmptyState
              title="No movements recorded yet"
              description="Once stock changes are made, every entry will appear here in chronological order."
            />
          ) : (
            <div className="mt-6 space-y-4">
              {movements.map((movement) => (
                <div key={movement.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{formatMovementType(movement.type)}</p>
                      <p className="mt-1 text-sm text-slate-400">{formatDateTime(movement.createdAt)}</p>
                    </div>
                    <MovementBadge type={movement.type} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                    <p>{movement.quantity} units</p>
                    <p>{movement.reason || 'No reason supplied'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <StockAdjustmentDialog
        isOpen={modalOpen}
        isSubmitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={async (values) => {
          setSubmitting(true);

          try {
            await updateStock({
              productId: product.id,
              ...values,
            });
            toast.success('Stock updated successfully.');
            setModalOpen(false);
          } catch (stockError) {
            toast.error(getErrorMessage(stockError));
          } finally {
            setSubmitting(false);
          }
        }}
      />
    </div>
  );
}
