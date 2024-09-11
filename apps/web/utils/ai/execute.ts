import { youtube_v3 } from "googleapis";
import { ActionItem, CommentForAction, runActionFunction } from "./actions";
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { ExecutedRuleStatus } from "@/types/app";

type ExecutedRuleWithActionItems = {
  id: string;
  comment_id: string;
  status: string;
  user_id: string;
  action_items: ActionItem[];
};

export async function executeAct({
  youtube,
  executedRule,
  comment,
  userEmail,
}: {
  youtube: youtube_v3.Youtube;
  executedRule: ExecutedRuleWithActionItems;
  comment: CommentForAction;
  userEmail: string;
}) {
  console.log("Executing act:", executedRule.id);
  const supabase = await supabaseServerClient();

  // Execute all actions and update the status in Supabase
  await Promise.allSettled([
    ...executedRule.action_items.map(async (action) => {
      return runActionFunction(youtube, comment, action, userEmail);
    }),
    supabase
      .from("executed_rule")
      .update({ status: ExecutedRuleStatus.APPLIED })
      .eq("id", executedRule.id),
  ]);
}
