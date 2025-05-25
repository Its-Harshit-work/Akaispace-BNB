import { z } from 'zod';
export const publishInputSchema = z.object({
    name: z.string().min(2, "Please enter a valid name"),
    description: z.string().min(6, "Description must be at least 6 characters long"),
    license: z.string().min(2, "License must be at least 2 characters long")
})

