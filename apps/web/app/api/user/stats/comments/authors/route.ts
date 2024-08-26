import { NextResponse } from "next/server";
import { z } from "zod";
import { withError } from "@/utils/middleware";
import { getAuthorCounts } from "@openstudio/tinybird";
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { auth } from "@/utils/auth";

const authorStatsQuery = z.object({
  limit: z.coerce.number().nullish(),
  fromDate: z.coerce.number().nullish(),
  toDate: z.coerce.number().nullish(),
});
export type AuthorStatsQuery = z.infer<typeof authorStatsQuery>;
export type AuthorStatsResponse = Awaited<
  ReturnType<typeof getAuthorsTinybird>
>;

async function getAuthorsTinybird(
  options: { ownerEmail: string; userId: string } & AuthorStatsQuery,
) {
  const authorCounts = await getAuthorCounts(options);

  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("author_status_summary")
    .select("status, display_name")
    .eq("user_id", options.userId);

  if (error) {
    throw new Error(`Failed to fetch author summary: ${error.message}`);
  }

  return {
    authors: authorCounts.data.map((d) => ({
      name: d.from,
      value: d.count,
      status: data?.find((a) => a.display_name === d.from)?.status,
    })),
  };
}

export const GET = withError(async (request) => {
  const session = await auth();
  if (!session?.ownerEmail)
    return NextResponse.json({ error: "Not authenticated" });

  const { searchParams } = new URL(request.url);
  const params = authorStatsQuery.parse({
    limit: searchParams.get("limit"),
    fromDate: searchParams.get("fromDate"),
    toDate: searchParams.get("toDate"),
  });

  const result = await getAuthorsTinybird({
    ownerEmail: session.ownerEmail,
    ...params,
    userId: session.userId,
  });

  return NextResponse.json(result);
});
