import { z } from "zod";
import { encrypt } from "./encrypt";
import { tb } from "./client";

const tinybirdComment = z.object({
  ownerEmail: z.string(),
  commentId: z.string(),
  videoThumbnail: z.string(),
  videoTitle: z.string(),
  videoDescription: z.string(),
  commentedText: z.any().transform(encrypt),
  authorDisplayName: z.string().transform(encrypt),
  authorProfileImageUrl: z.string(),
  videoId: z.string().optional(),
  timestamp: z.number(), // Comment PublishedAt value
});

export type TinybirdComment = z.infer<typeof tinybirdComment>;

export const publishComment = tb.buildIngestEndpoint({
  datasource: "comment",
  event: tinybirdComment,
});
