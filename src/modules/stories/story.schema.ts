import { z } from "zod";

export const createStorySchema = z.object({
    title: z.string(),
})