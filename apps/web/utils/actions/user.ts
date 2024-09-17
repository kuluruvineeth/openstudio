"use server";

import { z } from "zod";
import { ServerActionResponse } from "../error";
import { auth } from "../auth";
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { deleteUserStats } from "../redis/stats";
import {
  deleteTinybirdAiCalls,
  deleteTinybirdComments,
} from "@openstudio/tinybird";
import { deletePosthogUser } from "../posthog";

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

export async function deleteAccountAction(): Promise<ServerActionResponse> {
  const session = await auth();
  if (!session?.ownerEmail) return { error: "Not logged in" };

  //TODO: to add resend and loops
  try {
    await Promise.allSettled([
      deleteUserStats({ email: session.ownerEmail }),
      deleteTinybirdComments({ ownerEmail: session.ownerEmail }),
      deleteTinybirdAiCalls({ userId: session.ownerEmail }),
      deletePosthogUser({ email: session.ownerEmail }),
    ]);
  } catch (error) {
    console.error("Error while deleting account: ", error);
  }

  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("email", session.ownerEmail);

  if (error) {
    console.error("Error deleting the user from supabase: ", error);
    return { success: false };
  } else {
    return { success: true };
  }
}
