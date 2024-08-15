import { z } from "zod";

export const commentStatsQuery = z.object({
  limit: z.coerce.number().nullish(),
  fromDate: z.coerce.number().nullish(),
  toDate: z.coerce.number().nullish(),
});

export type CommentStatsQuery = z.infer<typeof commentStatsQuery>;

export const commentStatsResponse = z.object({
  mostActiveCommenters: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
    }),
  ),
  mostCommentedVideos: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      value: z.number(),
    }),
  ),
});

export type CommentStatsResponse = z.infer<typeof commentStatsResponse>;
