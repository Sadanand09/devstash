import { z } from "zod";

export const updateItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().nullable(),
  content: z.string().nullable(),
  url: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .nullable()
    .or(z.literal("")),
  language: z.string().trim().nullable(),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export type UpdateItemInput = z.infer<typeof updateItemSchema>;
