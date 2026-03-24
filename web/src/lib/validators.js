import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must contain at least 6 characters.'),
});

export const registerSchema = loginSchema.extend({
  displayName: z.string().min(2, 'Display name must contain at least 2 characters.').max(50),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must contain at least 2 characters.').max(120),
  description: z
    .string()
    .max(600, 'Description can contain up to 600 characters.')
    .optional()
    .or(z.literal('')),
  category: z.string().min(2, 'Category must contain at least 2 characters.').max(80),
  price: z.coerce.number().min(0, 'Price cannot be negative.'),
  initialQuantity: z.coerce
    .number()
    .int('Quantity must be a whole number.')
    .min(0, 'Quantity cannot be negative.')
    .optional(),
});

export const stockMovementSchema = z.object({
  type: z.enum(['IN', 'OUT']),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number.')
    .min(1, 'Quantity must be at least 1.'),
  reason: z
    .string()
    .max(180, 'Reason can contain up to 180 characters.')
    .optional()
    .or(z.literal('')),
});

