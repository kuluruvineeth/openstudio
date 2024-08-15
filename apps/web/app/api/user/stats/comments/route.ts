import { auth } from "@/utils/auth";
import { withError } from "@/utils/middleware";

import { NextResponse } from "next/server";
import { commentStatsQuery } from "./validation";
import { getCommentsTinybird } from "./controller";

export const GET = withError(async (request: Request) => {
  const session = await auth();

  if (!session) {
    throw new Error("Not logged in");
  }

  const { searchParams } = new URL(request.url);

  const query = commentStatsQuery.parse({
    limit: searchParams.get("limit"),
    fromDate: searchParams.get("fromDate"),
    toDate: searchParams.get("toDate"),
  });

  const result = await getCommentsTinybird({
    ownerEmail: session.ownerEmail,
    ...query,
  });

  return NextResponse.json(result);
});
