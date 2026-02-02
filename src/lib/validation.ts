import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required').max(2000, 'Content must be less than 2000 characters'),
  urgent: z.boolean().default(false)
});

export const paymentSchema = z.object({
  owner_id: z.string().min(1, 'Owner is required'),
  unit: z.string().min(1, 'Unit is required'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid month format (YYYY-MM)'),
  amount: z.number().positive('Amount must be positive'),
  status: z.enum(['Pending', 'Paid'])
});

export const documentSchema = z.object({
  name: z.string().min(1, 'File name is required').max(255, 'File name must be less than 255 characters'),
  file: z.any().refine((file) => {
    if (!file) return false;
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  }, 'File size must be less than 10MB')
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  phone: z.string().optional(),
  address: z.string().optional()
});

export const condominiumSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  address: z.string().optional()
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type NoticeFormData = z.infer<typeof noticeSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type CondominiumFormData = z.infer<typeof condominiumSchema>;
