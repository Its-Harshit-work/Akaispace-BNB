import { z } from "zod";

export const projectInputSchema = z.object({
    name: z.string().min(2, "Please enter a valid name"),
})