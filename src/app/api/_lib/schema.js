import { z } from "zod";

export const ChatSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  conversationId: z.string().nullable().optional(),
});

export const HistorySchema = z.object({
  conversationId: z.string().min(1, "conversationId is required"),
});
