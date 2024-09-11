import { ActionType, Rule } from "@/types/app";
import { z } from "zod";
export const zodRuleType = z.enum([Rule.AI, Rule.STATIC]);


const zodField = z
  .object({
    value: z.string().nullish(),
    ai: z.boolean().nullish(),
  })
  .nullish();

const zodAction = z.object({
  type: zodActionType,
  content: zodField,
  to: zodField, // commentId
});
export const createRuleBody = z.object({
  id: z.string().optional(),
  name: z.string(),
  instructions: z.string().nullish(),
  automate: z.boolean().nullish(),
  actions: z.array(zodAction),
  type: zodRuleType,
  // static conditions
  to: z.string().nullish(),
  content: z.string().nullish(),
});

export type CreateRuleBody = z.infer<typeof createRuleBody>;
