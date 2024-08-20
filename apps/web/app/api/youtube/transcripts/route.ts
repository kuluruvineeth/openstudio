import { getVideoTranscript } from "./controller";
import { withError } from "@/utils/middleware";
import { NextResponse } from "next/server";
import { transcriptsQuery } from "./validation";

export const GET = withError(async (request: Request) => {
  const { searchParams } = new URL(request.url);

  const query = transcriptsQuery.parse({
    videoId: searchParams.get("videoId"),
    lang: searchParams.get("lang"),
  });
  const transcript = await getVideoTranscript({ ...query });
  const combinedText = transcript.map((item) => item.text).join(" ");
  return NextResponse.json({
    transcript: transcript,
    combinedText,
  });
});
