import { z } from "zod";

export const transcriptsQuery = z.object({
  videoId: z.string(),
  lang: z.string().optional().nullish(),
});

export type TranscriptsQuery = z.infer<typeof transcriptsQuery>;
