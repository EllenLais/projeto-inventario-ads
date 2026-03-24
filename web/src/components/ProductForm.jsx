import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import FormField, { Input, Textarea } from '@/components/FormField';
import { productSchema } from '@/lib/validators';

export default function ProductForm({
  initialValues,
  isEdit = false,
  onSubmit,
  isSubmitting = false,
}) {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      category: initialValues?.category || '',
      price: initialValues?.price ?? 0,
      initialQuantity: initialValues?.quantity ?? 0,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Product name" error={errors.name?.message}>
          <Input placeholder="Wireless scanner" {...register('name')} />
        </FormField>

        <FormField label="Category" error={errors.category?.message}>
          <Input placeholder="Peripherals" {...register('category')} />
        </FormField>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Unit price" error={errors.price?.message}>
          <Input min="0" step="0.01" type="number" placeholder="0.00" {...register('price')} />
        </FormField>

        {!isEdit ? (
          <FormField
            label="Initial stock"
            error={errors.initialQuantity?.message}
            hint="If you start above zero, the backend creates an initial IN movement."
          >
            <Input min="0" step="1" type="number" placeholder="0" {...register('initialQuantity')} />
          </FormField>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-slate-100">Stock is server-controlled</p>
            <p className="mt-2 text-sm text-slate-400">
              Use the stock adjustment workflow on the product details page so every change creates a movement record.
            </p>
          </div>
        )}
      </div>

      <FormField label="Description" error={errors.description?.message}>
        <Textarea
          placeholder="Notes for your team, supplier details, or handling instructions."
          {...register('description')}
        />
      </FormField>

      <div className="flex justify-end">
        <Button isLoading={isSubmitting} type="submit">
          {isEdit ? 'Save product' : 'Create product'}
        </Button>
      </div>
    </form>
  );
}

