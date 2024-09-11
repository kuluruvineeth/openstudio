import { supabaseServerClient } from "@/supabase/supabaseServer";
import { auth } from "@/utils/auth";
import { withError } from "@/utils/middleware";
import { NextResponse } from "next/server";

export type RulesResponse = Awaited<ReturnType<typeof getRules>>;

async function getRules(options: { userId: string }) {
  const supabase = await supabaseServerClient();

  // Fetch rules along with actions
  const { data: rules, error } = await supabase
    .from("rule")
    .select(
      `
      id,
      type,
      name,
      instructions,
      automate,
      user_id,
      created_at,
      action (
        id,
        type,
        content,
        content_prompt,
        rule_id
      )
    `,
    )
    .eq("user_id", options.userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Error fetching rules: ${error.message}`);
  }

  return rules;
}

export const GET = withError(async () => {
  const session = await auth();
  if (!session?.ownerEmail)
    return NextResponse.json({ error: "Not authenticated" });

  const result = await getRules({ userId: session.userId });

  return NextResponse.json(result);
});
