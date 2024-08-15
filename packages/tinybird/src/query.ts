import { z } from "zod";
import { tb } from "./client";
import { decrypt } from "./encrypt";

export const getLatestOrOldestComment = tb.buildPipe({
  pipe: "find_oldest_or_latest_comment",
  parameters: z.object({
    ownerEmail: z.string(),
    direction: z.enum(["oldest", "newest"]),
  }),
  data: z.object({
    timestamp: z.number(),
    commentId: z.string(),
  }),
});

export const getWhoCommentedMost = tb.buildPipe({
  pipe: "who_commented_most",
  parameters: z.object({
    ownerEmail: z.string(),
    limit: z.number().nullish(),
    fromDate: z.number().nullish(),
    toDate: z.number().nullish(),
  }),
  data: z.object({
    authorDisplayName: z.string().transform(decrypt),
    count: z.number(),
  }),
});

export const getMostCommentedVideo = tb.buildPipe({
  pipe: "most_commented_video",
  parameters: z.object({
    ownerEmail: z.string(),
    limit: z.number().nullish(),
    fromDate: z.number().nullish(),
    toDate: z.number().nullish(),
  }),
  data: z.object({
    videoId: z.string(),
    videoTitle: z.string(),
    count: z.number(),
  }),
});
