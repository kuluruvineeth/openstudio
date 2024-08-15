import { z } from "zod";

export const zodDimension = z.enum(["day", "week", "month", "year"]);

export const analyticsQuery = z.object({
  fromDate: z.string(),
  toDate: z.string(),
  dimensions: zodDimension,
  type: z.enum(["channel", "subscribers", "acceptance", "visitors"]),
  metrics: z
    .enum([
      "views",
      "subscribersGained",
      "subscribersLost",
      "likes",
      "dislikes",
      "comments",
      "shares",
    ])
    .array(),
});

export type AnalyticsQuery = z.infer<typeof analyticsQuery>;
