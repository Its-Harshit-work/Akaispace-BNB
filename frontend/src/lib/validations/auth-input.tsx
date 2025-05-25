import { z } from 'zod';
export const registerInputSchema = z.object({
    name: z.string().min(2, "Please enter a valid name"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters long")
})

export const loginInputSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters long")
})