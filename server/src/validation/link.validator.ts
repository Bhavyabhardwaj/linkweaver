import { z } from 'zod';

// Bio links
export const bioLinkValidator = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  url: z.string().url("Please provide a valid URL"),
  description: z.string().max(500).optional(),
  order: z.number().int().min(0).optional(),
  icon: z.string().max(10).optional()
})

// short links
export const shortLinkValidator = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  url: z.string().url("Please provide a valid URL"),
  description: z.string().max(500).optional(),
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be at most 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Slug can only contain letters, numbers, hyphens, and underscores")
    .optional(),
  expiresAt: z.preprocess((val: any) => {
    if (typeof val === 'string') return new Date(val);
    return val;
  }, z.date()).optional(),
  clickLimit: z.number().int().min(1).optional(),
  password: z.string().min(4).optional()
})

export const linkUpdateValidator = z.object({
  title: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  description: z.string().max(200).optional(),
  icon: z.string().max(10).optional(),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
  expiresAt: z.date().optional(),
  clickLimit: z.number().int().min(1).optional(),
  password: z.string().min(4).optional()
})

export const linkExpirationValidator = z.object({
  expiresAt: z.date().refine((date: Date) => date > new Date(), {
    message: "Expiration date must be in the future"
  })
})

export const linkExpirationUpdateValidator = z.object({
  expiresAt: z.date().nullable().optional().refine((date: Date | null | undefined) => !date || date > new Date(), {
    message: "Expiration date must be in the future"
  })
})

export const linkPasswordValidator = z.object({
  password: z.string().min(4, "Password must be at least 4 characters").max(50, "Password must be at most 50 characters")
})

export const linkPasswordAccessValidator = z.object({
  password: z.string().min(1, "Password is required")
})


export type BioLinkInput = z.infer<typeof bioLinkValidator>;
export type ShortLinkInput = z.infer<typeof shortLinkValidator>;
export type LinkUpdateInput = z.infer<typeof linkUpdateValidator>;
export type LinkExpirationInput = z.infer<typeof linkExpirationValidator>;
export type LinkExpirationUpdateInput = z.infer<typeof linkExpirationUpdateValidator>;
export type LinkPasswordInput = z.infer<typeof linkPasswordValidator>;
export type LinkPasswordAccessInput = z.infer<typeof linkPasswordAccessValidator>;