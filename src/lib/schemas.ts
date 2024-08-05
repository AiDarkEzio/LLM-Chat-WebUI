import { z } from 'zod';

export const PromptSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    model: z.string().min(1, "Model is required"),
    prompt: z.string().min(1, "Prompt is required"),
    image: z.string().optional(),
    conversationId: z.string().optional(),
    conversationName: z.string().optional()
});

export type Prompt = z.infer<typeof PromptSchema>

export const SignUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
  
export type SignUpFormData = z.infer<typeof SignUpSchema>;