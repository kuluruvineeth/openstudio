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
  const authorDisplayName = searchParams.get("authorDisplayName");
  const limit = searchParams.get("limit") || 500;
  let query;
  if (authorDisplayName)
    query = commentsQuery.parse({ limit, authorDisplayName });
  else query = commentsQuery.parse({ limit });
  const commentsData = await getComments({
    ownerEmail: session.ownerEmail,
    ...query,
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
