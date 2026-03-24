import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Card from '@/components/Card';
import FormField, { Input, Select } from '@/components/FormField';
import { stockMovementSchema } from '@/lib/validators';

export default function StockAdjustmentDialog({ isOpen, onClose, onSubmit, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(stockMovementSchema),
    defaultValues: {
      type: 'IN',
      quantity: 1,
      reason: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-lg p-0">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h3 className="text-xl font-semibold text-white">Adjust stock</h3>
            <p className="mt-1 text-sm text-slate-400">
              The backend validates this update and stores a movement record.
            </p>
          </div>
          <button
            className="rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            onClick={handleClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="space-y-5 px-6 py-6"
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values);
            reset();
          })}
        >
          <FormField label="Movement type" error={errors.type?.message}>
            <Select {...register('type')}>
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </Select>
          </FormField>

          <FormField label="Quantity" error={errors.quantity?.message}>
            <Input min="1" step="1" type="number" {...register('quantity')} />
          </FormField>

          <FormField label="Reason" error={errors.reason?.message} hint="Optional but useful for audits.">
            <Input placeholder="Purchase order #204" {...register('reason')} />
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={handleClose} type="button" variant="secondary">
              Cancel
            </Button>
            <Button isLoading={isSubmitting} type="submit">
              Save movement
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

