"use server";

import {
  createRuleBody,
  CreateRuleBody,
  updateRuleBody,
  UpdateRuleBody,
} from "@/app/api/user/rules/validation";
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { auth } from "@/utils/auth";
import { ServerActionResponse } from "@/utils/error";
import { revalidatePath } from "next/cache";

export async function createRuleAction(options: CreateRuleBody) {
  const session = await auth();
  if (!session?.userId) return { error: "Not logged in" };

  const supabase = await supabaseServerClient();

  const { data: body, error } = createRuleBody.safeParse(options);
  if (error) return { error: error.message };

  // Construct actions data if available
  const actionsData = body.actions?.map(({ type, content }) => ({
    type,
    content: content?.ai ? null : content?.value,
    content_prompt: content?.ai ? content?.value : null,
  }));

  try {
    const { data: result, error: rpcError } = await supabase.rpc(
      "insert_rule_with_actions",
      {
        rule_type: body.type || "AI",
        rule_name: body.name || "",
        rule_instructions: body.instructions || "",
        rule_automate: body.automate ?? false,
        user_id: session.userId,
        actions_data: actionsData,
      },
    );

    if (rpcError) {
      if (rpcError.message.includes("unique constraint")) {
        return { error: "Rule name already exists for this user" };
      }
      return { error: "Error creating rule." };
    }

    return { rule: { id: result[0].rule_id } };
  } catch (error) {
    return { error: "Unexpected error creating rule." };
  }
}

export async function deleteRuleAction(
  ruleId: string,
): Promise<ServerActionResponse> {
  const session = await auth();
  if (!session?.ownerEmail) return { error: "Not logged in" };

  const supabase = await supabaseServerClient();

  const { error } = await supabase
    .from("rule")
    .delete()
    .eq("id", ruleId)
    .eq("user_id", session.userId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

