import { env } from "@/env.mjs";
import { auth } from "@/utils/auth";
import { withError } from "@/utils/middleware";
import { NextResponse } from "next/server";
import OpenAI from "openai";

async function getOpenAIModels({ apiKey }: { apiKey: string }) {
  const openai = new OpenAI({ apiKey });

  const models = await openai.models.list();

  return models.data.filter((m) => m.id.startsWith("gpt-"));
}

export const GET = withError(async () => {
  const session = await auth();

  if (!session?.ownerEmail) {
    return NextResponse.json({ error: "Not authenticated" });
  }

  //TODO: Should use user openai api key
  const result = await getOpenAIModels({ apiKey: env.OPENAI_API_KEY });

  return NextResponse.json(result);
});
