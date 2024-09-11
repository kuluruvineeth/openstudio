import { RulesResponse } from "@/app/api/user/rules/route";
import { CommentForLLM } from "./stringify-comment";
import { RuleTable, User } from "@/types/app";
import { UserAIFields } from "../llms/types";
import { ActionItem } from "./actions";
import { getAiResponse } from "./ai-choose-rule";
import {
  getActionItemsFromAiArgsResponse,
  getActionsWithParameters,
  getArgsAiResponse,
} from "./ai-choose-args";

export type ChooseRuleOptions = {
  comment: CommentForLLM;
  rules: RulesResponse;
  user: Pick<User, "email" | "prompt"> & UserAIFields;
};

export async function chooseRule(options: ChooseRuleOptions): Promise<
  | {
      rule: Omit<RuleTable, "updated_at">;
      actionItems: ActionItem[];
      reason?: string;
    }
  | { rule?: undefined; actionItems?: undefined; reason?: string }
> {
  const { comment, rules, user } = options;

  if (!rules.length) return { reason: "No rules" };

  const aiResponse = await getAiResponse({
    comment,
    rules,
    user,
  });

  const ruleNumber = aiResponse ? aiResponse.rule - 1 : undefined;
  if (typeof ruleNumber !== "number") {
    console.warn("No rule selected");
    return { reason: aiResponse?.reason };
  }

  const selectedRule = rules[ruleNumber];

  if (!selectedRule) return { reason: aiResponse?.reason };

  const shouldAiGenerateArgs =
    getActionsWithParameters(selectedRule.action as any).length > 0;

  const aiArgsResponse = shouldAiGenerateArgs
    ? await getArgsAiResponse({
        ...options,
        comment,
        selectedRule,
      })
    : undefined;

  const actionItems = getActionItemsFromAiArgsResponse(
    aiArgsResponse,
    selectedRule.action as any,
  );

  return {
    rule: selectedRule,
    actionItems,
    reason: aiResponse?.reason,
  };
}
