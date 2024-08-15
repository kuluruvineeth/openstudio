import { z } from "zod";

export const loadTinybirdCommentsBody = z.object({
  loadBefore: z.coerce.boolean().optional(),
});

export type LoadTinybirdCommentsBody = z.infer<typeof loadTinybirdCommentsBody>;
