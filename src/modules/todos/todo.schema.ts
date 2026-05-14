import {z} from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(5, "Content must be at least 5 characters long"),
  completed: z.boolean().default(false),
  categoryId: z.string().min(1, "Category is required"),
});

export const getTodoByIdScehma = z.object({
    id : z.string()
})

export const updateTodoSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(5, "Content must be at least 5 characters long"),
    completed: z.boolean().default(false),
    categoryId: z.string("Category is required"),
});

export const deleteTodoSchema = z.object({
    id : z.string()
})