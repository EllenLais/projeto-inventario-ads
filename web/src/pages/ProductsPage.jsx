import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import FormField, { Input } from '@/components/FormField';
import PageHeader from '@/components/PageHeader';
import ProductTable from '@/components/ProductTable';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';

export default function ProductsPage() {
  const { user } = useAuth();
  const { products, loading, error } = useProducts(user?.uid);
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.category, product.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [products, search]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalog"
        title="Manage products with confidence"
        description="Review inventory levels, edit product details, and jump into stock history for any item."
        action={
          <Link to="/products/new">
            <Button>Create product</Button>
          </Link>
        }
      />

      <div className="grid gap-5 md:grid-cols-[1fr_auto]">
        <FormField label="Search products">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              className="pl-11"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, category, or description"
              value={search}
            />
          </div>
        </FormField>

        <div className="self-end rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
          {loading ? 'Loading products...' : `${filteredProducts.length} products shown`}
        </div>
      </div>

      {error ? <p className="text-sm text-rose-200">{error}</p> : null}

      {filteredProducts.length === 0 && !loading ? (
        <EmptyState
          title={products.length === 0 ? 'No products yet' : 'No products match your search'}
          description={
            products.length === 0
              ? 'Start your inventory with a first product and the dashboard will begin filling in automatically.'
              : 'Try a broader search or create a new product.'
          }
          action={
            <Link to="/products/new">
              <Button variant="secondary">Add product</Button>
            </Link>
          }
        />
      ) : (
        <ProductTable products={filteredProducts} />
      )}
    </div>
  );
}

