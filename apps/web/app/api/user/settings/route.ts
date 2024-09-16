import { auth } from "@/utils/auth";
import { saveSettingsBody, SaveSettingsBody } from "./validation";
import { Model, Provider } from "@/utils/llms/config";
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { withError } from "@/utils/middleware";
import { NextResponse } from "next/server";

export type SaveSettingsResponse = Awaited<ReturnType<typeof saveAISettings>>;

async function saveAISettings(options: SaveSettingsBody) {
  const session = await auth();
  if (!session?.ownerEmail) throw new Error("Not logged in");

  const aiProvider = options.aiProvider || Provider.ANTHROPIC;

  function getModel() {
    switch (aiProvider) {
      case Provider.OPEN_AI:
        return options.aiModel;
      case Provider.ANTHROPIC:
        if (options.aiApiKey) {
          // use anthropic if api key is set
          return Model.CLAUDE_3_5_SONNET_ANTHROPIC;
        } else {
          // use bedrock if no api key set
          return Model.CLAUDE_3_5_SONNET_BEDROCK;
        }
      default:
        throw new Error("Invalid AI provider");
    }
  }

  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .update({
      ai_provider: aiProvider,
      ai_model: getModel(),
      ai_api_key: options.aiApiKey || null,
    })
    .eq("email", session.ownerEmail);

  if (error) {
    console.error("Error updating user:", error.message);
  } else {
    console.log("User updated successfully:", data);
    return data;
  }
}

export const POST = withError(async (request: Request) => {
  const session = await auth();
  if (!session?.ownerEmail) {
    return NextResponse.json({ error: "Not authenticated" });
  }

  const json = await request.json();
  const body = saveSettingsBody.parse(json);

  const result = await saveAISettings(body);

  return NextResponse.json(result);
});
