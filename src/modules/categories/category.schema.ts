import { z } from "zod";

export const createCategorySchema = z.object({
  name: 
  z.string()
  .min(1, "Name is required")
  .min(3, "Name must be at least 3 character")
  .max(50, "Name must not exceed 50 character")
});

export const updateCategorySchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 character")
    .max(50, "Name must not exceed 50 character"),
});


export const deleteCategorySchema = z.object({
  id: z.string()
});

export const getCategoryByIdSchema = z.object({
  id: z.string()
});
