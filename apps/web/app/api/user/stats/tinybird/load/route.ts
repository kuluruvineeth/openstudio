import { auth } from "@/utils/auth";
import { withError } from "@/utils/middleware";
import { loadTinybirdComments } from "./controller";
import { NextResponse } from "next/server";

export const GET = withError(async (request: Request) => {
  const session = await auth();

  if (!session) {
    throw new Error("Not Authenticated");
  }

  const result = await loadTinybirdComments({
    ownerEmail: session.ownerEmail,
  });

  return NextResponse.json(result);
});
