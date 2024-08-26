import { getComments } from "@openstudio/tinybird";
import { commentsQuery } from "./validation";
import { auth } from "@/utils/auth";
import { withError } from "@/utils/middleware";
import { NextResponse } from "next/server";
import { getCategory } from "@/utils/redis/category";

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

  const commentsWithCategory = await Promise.all(
    commentsData.data.map(async (c) => {
      return {
        ...c,
        category: await getCategory({
          email: session.ownerEmail,
          commentId: c.commentId,
        }),
      };
    }),
  );
  return NextResponse.json({ allComments: commentsWithCategory });
});
