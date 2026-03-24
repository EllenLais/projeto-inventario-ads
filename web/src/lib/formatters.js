export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value || 0));
}

export function formatDateTime(value) {
  if (!value) {
    return 'Pending sync';
  }

  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatMovementType(type) {
  return type === 'IN' ? 'Stock In' : 'Stock Out';
}

