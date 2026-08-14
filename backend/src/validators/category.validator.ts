import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
  body: z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  }),
});

export const categoryParamsSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
});
