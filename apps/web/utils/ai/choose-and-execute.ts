import { ExecutedRuleStatus, RuleTable, User } from "@/types/app";
import { ActionItem, CommentForAction } from "./actions";
import { chooseRule, ChooseRuleOptions } from "./choose";
import { CommentForLLM } from "./stringify-comment";
import { UserAIFields } from "../llms/types";
import { youtube_v3 } from "googleapis";
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { executeAct } from "./execute";

type ChooseRuleAndExecuteOptions = ChooseRuleOptions & {
  comment: CommentForLLM & CommentForAction;
  user: Pick<User, "id" | "email" | "prompt"> & UserAIFields;
  youtube: youtube_v3.Youtube;
  forceExecute?: boolean;
  isTest: boolean;
};
export async function saveExecutedRule(
  {
    userId,
    videoId,
    commentId,
  }: {
    userId: string;
    videoId: string;
    commentId: string;
  },
  plannedAct: Awaited<ReturnType<typeof chooseRule>>,
) {
  const supabase = await supabaseServerClient();

  const { data: existingRule, error: fetchError } = await supabase
    .from("executed_rule")
    .select("id")
    .eq("user_id", userId)
    .eq("comment_id", commentId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw new Error(`Error fetching existing rule: ${fetchError.message}`);
  }

  const ruleData = {
    video_id: videoId,
    comment_id: commentId,
    automated: !!plannedAct.rule?.automate,
    status: ExecutedRuleStatus.PENDING,
    reason: plannedAct.reason,
    rule_id: plannedAct.rule?.id || null,
    user_id: userId,
  };

  let executedRuleId;

  if (existingRule) {
    // Update existing rule
    const { data, error: updateError } = await supabase
      .from("executed_rule")
      .update(ruleData)
      .eq("id", existingRule.id)
      .select();

    if (updateError) {
      throw new Error(`Error updating executed rule: ${updateError.message}`);
    }

    executedRuleId = existingRule.id;
  } else {
    // Insert new rule
    const { data, error: insertError } = await supabase
      .from("executed_rule")
      .insert({
        ...ruleData,
      })
      .select();

    if (insertError) {
      throw new Error(`Error inserting executed rule: ${insertError.message}`);
    }

    executedRuleId = data[0].id;
  }

  // Handle inserting action items if they exist
  if (plannedAct.actionItems && plannedAct.actionItems.length > 0) {
    const actionItemsData = plannedAct.actionItems.map((item) => ({
      executed_rule_id: executedRuleId,
      type: item.type,
      content: item.content,
    }));

    const { error: actionItemsError } = await supabase
      .from("executed_action")
      .insert(actionItemsData);

    if (actionItemsError) {
      throw new Error(
        `Error inserting action items: ${actionItemsError.message}`,
      );
    }
  }

  return executedRuleId;
}
