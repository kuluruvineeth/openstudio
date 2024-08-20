import { z } from "zod";

export const categorizeCommentBody = z.object({
  commentId: z.string(),
  videoId: z.string(),
  commentedText: z.string(),
});

export type CategorizeCommentBody = z.infer<typeof categorizeCommentBody>;

export const aiResponseSchema = z.object({
  requiresMoreInformation: z.boolean(),
  category: z
    .enum([
      "POSITIVE",
      "NEGATIVE",
      "NEUTRAL",
      "SPAM",
      "OFFENSIVE",
      "INFORMATIVE",
      "ENGAGEMENT",
      "CONSTRUCTIVE_CRITICISM",
      "QUESTION",
      "SUPPORT",
      "APPRECIATION",
      "COLLABORATION_OPPORTUNITY",
      "HUMOROUS",
      "EDUCATIONAL",
      "PERSONAL_STORY",
      "OTHER",
    ])
    .optional(),
});

export type AiResponseSchema = z.infer<typeof aiResponseSchema>;
