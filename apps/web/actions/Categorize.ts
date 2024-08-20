"use server";

import { CategorizeCommentBody } from "@/app/api/ai/categorize/validation";
import { ServerActionResponse } from "@/utils/error";
import { getUserData } from "./GetUserData";
import { getAiProviderAndModel } from "@/utils/llms";
import { categorize } from "@/app/api/ai/categorize/controller";

export async function categorizeAction(
  commentBody: CategorizeCommentBody,
): Promise<ServerActionResponse<{ category: string }>> {
  const user = await getUserData();

  if (!user) return { error: "User not found" };

  const { model, provider } = getAiProviderAndModel(
    user.aiprovider ?? "openai",
    user.aimodel,
  );

  const res = await categorize(
    {
      ...commentBody,
      openaiapikey: user.openaiapikey,
      aiprovider: provider,
      aimodel: model,
    },
    {
      email: user.email,
    },
  );

  return res;
}
