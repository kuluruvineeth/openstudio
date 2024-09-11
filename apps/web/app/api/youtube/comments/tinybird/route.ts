import { getComments } from "@openstudio/tinybird";
import { commentsQuery } from "./validation";
import { auth } from "@/utils/auth";
import { withError } from "@/utils/middleware";
import { NextResponse } from "next/server";
import { getCategory } from "@/utils/redis/category";
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { isDefined } from "@/utils/types";
import { ExecutedRuleStatus } from "@/types/app";

export const GET = withError(async (request: Request) => {
  const session = await auth();

  if (!session) {
    throw new Error("Not logged in");
  }

  const { searchParams } = new URL(request.url);

  // Construct the query object from searchParams
  const query = {
    // limit: searchParams.get("limit"),
    authorDisplayName: searchParams.get("authorDisplayName"),
    fromDate: searchParams.get("fromDate"),
    toDate: searchParams.get("toDate"),
  };

  // Parse the query object using Zod
  const parsedQuery = commentsQuery.parse(query);

  const commentsData = await getComments({
    ownerEmail: session.ownerEmail,
    ...parsedQuery,
  });

  const commentIds =
    commentsData.data.map((c) => c.commentId).filter(isDefined) || [];

  const supabase = await supabaseServerClient();

  const { data: plans, error } = await supabase
    .from("executed_rule")
    .select(
      `
    id,
    comment_id, 
    video_id,
    rule:rule_id (*),
    actionItems:executed_action (
      id, type, content
    ),
    status,
    reason
  `,
    )
    .eq("user_id", session.userId)
    .in("comment_id", commentIds)
    .in("status", [ExecutedRuleStatus.PENDING, ExecutedRuleStatus.SKIPPED]);

  if (error) {
    console.error("Error fetching plans:", error.message);
  } else {
    console.log("Plans fetched successfully:", plans);
  }

  const commentsWithCategoryAndPlan = await Promise.all(
    commentsData.data.map(async (c) => {
      const plan = plans?.find((p) => p.comment_id === c.commentId);
      return {
        ...c,
        category: await getCategory({
          email: session.ownerEmail,
          commentId: c.commentId,
        }),
        plan,
      };
    }),
  );
  return NextResponse.json({ allComments: commentsWithCategoryAndPlan });
});
