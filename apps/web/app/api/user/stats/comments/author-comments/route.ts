import { NextResponse } from "next/server";
import { z } from "zod";
import { format } from "date-fns";
import { withError } from "@/utils/middleware";
import { getCommentsFromAuthor } from "@openstudio/tinybird";
import { auth } from "@/utils/auth";

const authorCommentsQuery = z.object({
  authorDisplayName: z.string(),
  fromDate: z.coerce.number().nullish(),
  toDate: z.coerce.number().nullish(),
});
export type AuthorCommentsQuery = z.infer<typeof authorCommentsQuery>;
export type AuthorCommentsResponse = Awaited<
  ReturnType<typeof getAuthorComments>
>;

async function getAuthorComments(
  options: AuthorCommentsQuery & { ownerEmail: string },
) {
  const authorComments = await getCommentsFromAuthor(options);

  return {
    result: authorComments.data.map((d) => ({
      startOfPeriod: format(d.startOfPeriod, "LLL dd, y"),
      Comments: d.count,
    })),
  };
}

export const GET = withError(async (request) => {
  const session = await auth();
  if (!session?.ownerEmail)
    return NextResponse.json({ error: "Not authenticated" });

  const { searchParams } = new URL(request.url);

  const query = authorCommentsQuery.parse({
    authorDisplayName: searchParams.get("authorDisplayName"),
    fromDate: searchParams.get("fromDate"),
    toDate: searchParams.get("toDate"),
  });

  const result = await getAuthorComments({
    ...query,
    ownerEmail: session.ownerEmail,
  });

  return NextResponse.json(result);
});
