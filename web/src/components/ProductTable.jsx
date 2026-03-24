import { Link } from 'react-router-dom';
import { ArrowRight, Pencil } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { formatCurrency, formatDateTime } from '@/lib/formatters';

export default function ProductTable({ products }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-400">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Updated</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.id} className="text-sm text-slate-200">
                <td className="px-6 py-5">
                  <div>
                    <p className="font-semibold text-white">{product.name}</p>
                    <p className="mt-1 max-w-sm text-slate-400">
                      {product.description || 'No description provided.'}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-300">{product.category}</td>
                <td className="px-6 py-5">{formatCurrency(product.price)}</td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      product.quantity < 5
                        ? 'bg-rose-400/15 text-rose-200'
                        : 'bg-emerald-400/15 text-emerald-200'
                    }`}
                  >
                    {product.quantity} units
                  </span>
                </td>
                <td className="px-6 py-5 text-slate-400">{formatDateTime(product.updatedAt)}</td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-3">
                    <Link to={`/products/${product.id}/edit`}>
                      <Button className="px-3 py-2" variant="secondary">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/products/${product.id}`}>
                      <Button className="px-3 py-2" variant="ghost">
                        <ArrowRight className="h-4 w-4" />
                        Open
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

