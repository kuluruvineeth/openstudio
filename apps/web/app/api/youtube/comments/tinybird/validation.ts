import { z } from "zod";

export const commentsQuery = z.object({
  authorDisplayName: z.string().nullish(),
  limit: z.coerce.number().max(500).optional(),
  fromDate: z.coerce.number().nullish(),
  toDate: z.coerce.number().nullish(),
});

export type CommentsQuery = z.infer<typeof commentsQuery>;
