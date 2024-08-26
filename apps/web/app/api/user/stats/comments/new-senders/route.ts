import { auth } from "@/utils/auth";
import { withError } from "@/utils/middleware";
import { getWhoCommentedForFirstTime } from "@openstudio/tinybird";
import { subDays } from "date-fns";
import { NextResponse } from "next/server";
import { z } from "zod";

export const newSendersQuery = z.object({
  fromDate: z.coerce.number().nullish(),
  toDate: z.coerce.number().nullish(),
});
export type NewSendersQuery = z.infer<typeof newSendersQuery>;
export type NewSendersResponse = Awaited<
  ReturnType<typeof getNewCommentSenders>
>;

async function getNewCommentSenders(
  options: NewSendersQuery & { ownerEmail: string },
) {
  const newSenders = await getWhoCommentedForFirstTime({
    ...options,
  });

  return { comments: newSenders.data };
}

export const GET = withError(async (request) => {
  const session = await auth();
  if (!session?.ownerEmail) {
    return NextResponse.json({ error: "Not authenticated" });
  }

  const { searchParams } = new URL(request.url);

  const query = newSendersQuery.parse({
    fromDate:
      searchParams.get("fromDate") || subDays(new Date(), 100).getTime(),
    toDate: searchParams.get("toDate") || subDays(new Date(), 1).getTime(),
  });

  const result = await getNewCommentSenders({
    ...query,
    ownerEmail: session.ownerEmail,
  });

  return NextResponse.json(result);
});
