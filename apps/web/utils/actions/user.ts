"use server";

import { z } from "zod";
import { ServerActionResponse } from "../error";
import { auth } from "../auth";
import { supabaseServerClient } from "@/supabase/supabaseServer";

const savePromptBody = z.object({ prompt: z.string() });
export type SavePromptBody = z.infer<typeof savePromptBody>;

export async function savePromptAction(
  options: SavePromptBody,
): Promise<ServerActionResponse> {
  const session = await auth();

  if (!session?.ownerEmail) return { error: "Not logged in" };

  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .update({ prompt: options.prompt })
    .eq("email", session.ownerEmail);

  if (error) {
    console.error("Error updating user prompt:", error.message);
    return { error: "Failed to update prompt" };
  }

  return { success: true, data };
}
