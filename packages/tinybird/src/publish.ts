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

const tinybirdAiCall = z.object({
  userId: z.string(),
  timestamp: z.number(),
  totalTokens: z.number().int(),
  completionTokens: z.number().int(),
  promptTokens: z.number().int(),
  cost: z.number(),
  model: z.string(),
  provider: z.string(),
  label: z.string().optional(),
  data: z.string().optional(),
});

export type TinybirdAiCall = z.infer<typeof tinybirdAiCall>;

export const publishAiCall = tb.buildIngestEndpoint({
  datasource: "aicall",
  event: tinybirdAiCall,
});
