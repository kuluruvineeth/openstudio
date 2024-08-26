import { supabaseServerClient } from "@/supabase/supabaseServer";
import { auth } from "@/utils/auth";
import { withError } from "@/utils/middleware";
import { NextResponse } from "next/server";

export type AuthorSummaryResponse = Awaited<
  ReturnType<typeof getAuthorSummary>
>;

async function getAuthorSummary(options: { userId: string }) {
  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("author_status_summary")
    .select("status, status_count")
    .eq("user_id", options.userId);

  if (error) {
    throw new Error(`Failed to fetch author summary: ${error.message}`);
  }

  const resultObject = Object.fromEntries(
    data.map((item) => [item.status, item.status_count]),
  );

  return { result: resultObject };
}

export const GET = withError(async () => {
  const session = await auth();
  if (!session?.ownerEmail)
    return NextResponse.json({ error: "Not authenticated" });

  const result = await getAuthorSummary({ userId: session.userId });

  return NextResponse.json(result);
});
