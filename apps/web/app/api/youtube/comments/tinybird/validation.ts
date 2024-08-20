import { z } from "zod";

export const commentsQuery = z.object({
  authorDisplayName: z.string().optional(),
  limit: z.coerce.number().max(500).optional(),
});

export type CommentsQuery = z.infer<typeof commentsQuery>;
