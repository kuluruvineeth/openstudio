import { youtube_v3 } from "googleapis";
import { CommentForAction } from "./actions";
import { RulesResponse } from "@/app/api/user/rules/route";
import { ExecutedRuleStatus, Rule, User } from "@/types/app";
import { UserAIFields } from "../llms/types";
import { chooseRuleAndExecute } from "./choose-and-execute";
import { supabaseServerClient } from "@/supabase/supabaseServer";
async function saveSkippedExecutedRule({
  userId,
  commentId,
  reason,
}: {
  userId: string;
  commentId: string;
  reason?: string;
}) {
  const supabase = await supabaseServerClient();
  const { data: existingRule, error } = await supabase
    .from("executed_rule")
    .select("id")
    .eq("user_id", userId)
    .eq("comment_id", commentId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking existing rule:", error);
    return;
  }

  if (existingRule) {
    const { error: updateError } = await supabase
      .from("executed_rule")
      .update({
        comment_id: commentId,
        automated: true,
        reason,
        status: ExecutedRuleStatus.SKIPPED,
      })
      .eq("id", existingRule.id);

    if (updateError) {
      console.error("Error updating existing executed rule:", updateError);
      return;
    }
  } else {
    const { error: insertError } = await supabase.from("executed_rule").insert({
      comment_id: commentId,
      automated: true,
      reason,
      status: ExecutedRuleStatus.SKIPPED,
      user_id: userId,
    });

    if (insertError) {
      console.error("Error inserting new executed rule:", insertError);
      return;
    }
  }
}
