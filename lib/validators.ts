import { z } from 'zod';

export const phoneRegex = /^\+7\d{10}$/;

const phoneField = z.preprocess(
  (val) => (typeof val === 'string' ? val : ''),
  z
    .string()
    .refine((s) => phoneRegex.test(s.replace(/\D/g, '').replace(/^8/, '7').replace(/^7/, '+7')) || phoneRegex.test(s), {
      message: 'Введите корректный номер',
    })
);

export const leadSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Укажите имя')
    .regex(/^[А-Яа-яЁё\s-]+$/, 'Только кириллица'),
  phone: phoneField,
  category: z.enum(['gold', 'tech']),
  details: z.record(z.any()).optional(),
  estimated_value: z.number().nonnegative().optional(),
  gdpr: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо согласие на обработку данных' }),
  }),
  website: z.string().max(0).optional(), // honeypot
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const goldInputSchema = z.object({
  karat: z.union([z.literal(375), z.literal(585), z.literal(750), z.literal(999)]),
  weight: z.number().min(0.01).max(1000),
});

export const techInputSchema = z.object({
  category: z.enum(['smartphone', 'laptop', 'other']),
  model: z.string().min(1),
  condition: z.enum(['excellent', 'good', 'defective']),
});
