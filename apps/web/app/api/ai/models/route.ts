import { supabaseServerClient } from "@/supabase/supabaseServer";
import { auth } from "@/utils/auth";
import { Provider } from "@/utils/llms/config";
import { withError } from "@/utils/middleware";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export type OpenAiModelsResponse = Awaited<ReturnType<typeof getOpenAIModels>>;

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
  const supabase = await supabaseServerClient();
  const { data: user, error } = await supabase
    .from("users")
    .select("ai_api_key, ai_provider")
    .eq("email", session.ownerEmail)
    .single();

  if (error) {
    console.error("Error fetching user data:", error.message);
    return NextResponse.json({ error: "User not found" });
  }

  if (!user.ai_api_key || user.ai_provider !== Provider.OPEN_AI)
    return NextResponse.json([]);

  const result = await getOpenAIModels({ apiKey: user.ai_api_key });

  return NextResponse.json(result);
});
