import { z } from 'zod';

export const qrCodeValidator = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  url: z.string().url("Please provide a valid URL"),
  description: z.string().max(500).optional(),
  size: z.number().int().min(100).max(1000).default(300),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").default("#000000"),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid background color format").default("#ffffff"),
})

export const qrCodeUpdateValidator = z.object({
  title: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  description: z.string().max(500).optional(),
  size: z.number().int().min(100).max(1000).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").optional(),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid background color format").optional(),
})

export type QRCodeInput = z.infer<typeof qrCodeValidator>;
export type QRCodeUpdateInput = z.infer<typeof qrCodeUpdateValidator>;
