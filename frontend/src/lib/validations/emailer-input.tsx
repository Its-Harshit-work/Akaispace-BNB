import { z } from 'zod';
export const emailerInputSchema = z.object({
    name: z.string().min(2, "Please enter a valid name"),
    email: z.string().email("Please enter a valid email")
})