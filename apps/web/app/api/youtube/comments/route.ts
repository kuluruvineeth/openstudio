import { withError } from "@/utils/middleware";
import { NextResponse } from "next/server";
import { getComments } from "./controller";

export const GET = withError(async (request: Request) => {
  const comments = await getComments();
  return NextResponse.json({
    commentsData: comments,
  });
});
