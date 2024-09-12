"use server";

import { supabaseServerClient } from "@/supabase/supabaseServer";
import { ExecutedRuleStatus } from "@/types/app";
import { getSessionAndYoutubeClient } from "@/utils/actions/helpers";
import { CommentForAction } from "@/utils/ai/actions";
import { executeAct } from "@/utils/ai/execute";
import { runRulesOnComment } from "@/utils/ai/run-rules";
import { auth } from "@/utils/auth";
import { ServerActionResponse } from "@/utils/error";
import { getYoutubeDataClient } from "@/utils/youtube/client";
import { getComment } from "@/utils/youtube/comment";

export async function runRulesAction(
  comment: CommentForAction,
  force: boolean,
): Promise<ServerActionResponse> {
  const { youtube, user: u, error } = await getSessionAndYoutubeClient();
  if (error) return { error };
  if (!youtube) return { error: "Could not load Youtube" };

  const supabase = await supabaseServerClient();

  // Fetch user data along with rules and actions from Supabase
  const { data: user, error: userError } = await supabase
    .from("users")
    .select(
      `id, email, prompt, ai_provider, ai_model, ai_api_key,
       rule (
         id, name, type, instructions, action (id, type, content)
       )`,
    )
    .eq("id", u.id)
    .single();

  if (!user?.email) return { error: "User email not found" };

  const [commentDetails, hasExistingRule] = await Promise.all([
    getComment(comment.commentId, youtube),
    supabase
      .from("executed_rule")
      .select("id")
      .eq("user_id", user.id)
      .eq("comment_id", comment.commentId)
      .single(),
  ]);

  if (hasExistingRule && !force) {
    console.log("Skipping. Rule already exists.");
    return;
  }

  await runRulesOnComment({
    youtube,
    comment,
    rules: user.rule,
    user: { ...user, email: user.email },
  });
}

export async function approvePlanAction(
  executedRuleId: string,
  comment: CommentForAction,
): Promise<ServerActionResponse> {
  const session = await auth();
  if (!session?.ownerEmail) return { error: "Not logged in" };

  const youtube = getYoutubeDataClient(session);

  const supabase = await supabaseServerClient();

  const { data: executedRule, error } = await supabase
    .from("executed_rule")
    .select(
      `
      *,
      executed_action(*)
    `,
    )
    .eq("id", executedRuleId)
    .single();

  if (error || !executedRule) return { error: "Item not found" };

  await executeAct({
    youtube,
    executedRule,
    userEmail: session.ownerEmail,
    comment: {
      commentId: comment.commentId,
      content: comment.content,
    },
  });
}

export async function rejectPlanAction(
  executedRuleId: string,
): Promise<ServerActionResponse> {
  const session = await auth();
  if (!session?.userId) return { error: "Not logged in" };

  const supabase = await supabaseServerClient();

  const { error } = await supabase
    .from("executed_rule")
    .update({ status: ExecutedRuleStatus.REJECTED })
    .eq("id", executedRuleId)
    .eq("user_id", session.userId);

  if (error) return { error: "Failed to update the status" };

  return { success: true };
}
