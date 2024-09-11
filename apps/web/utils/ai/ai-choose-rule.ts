import { User } from "@/types/app";
import { UserAIFields } from "../llms/types";
import { stringifyComment } from "./stringify-comment";
import { chatCompletionObject } from "../llms";
import { z } from "zod";

type GetAiResponseOptions = {
  comment: {
    content: string;
    videoTitle?: string;
    videoDescription?: string;
    videoTranscript?: string;
  };
  user: Pick<User, "email" | "prompt"> & UserAIFields;
  rules: { instructions: string }[];
};

export async function getAiResponse(options: GetAiResponseOptions) {
  const { comment, user, rules } = options;

  if (!rules.length) return;

  const rulesWithUnknownRule = [
    ...rules,
    {
      instructions:
        "None of the other rules match or not enough information to make a decision.",
    },
  ];

  const system = `You are an AI assistant that helps people manage their youtube comments.
  It's better not to act if you don't know how.
  
  These are the rules you can select from:
  ${rulesWithUnknownRule.map((rule, i) => `${i + 1}.${rule.instructions}`).join("\n")}
  
  ${
    user.prompt
      ? `Some additional information the user has provided:\n\n${user.prompt}`
      : ""
  }`;

  const prompt = `This youtube comment was received for processing. Select a rule to apply for it.
  Respond with a JSON object with the following fields:
  "rule" - the number of the rule you want to apply
  "reason" - the reason you choose that rule
  
  The Comment:
  
  ${stringifyComment(comment, 500)}`;

  const aiResponse = await chatCompletionObject({
    userAi: user,
    prompt,
    system,
    schema: z.object({
      rule: z.number(),
      reason: z.string(),
    }),
    userEmail: user.email || "",
    usageLabel: "Choose rule",
  });

  return aiResponse.object;
}
