import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import {
  DEFAULT_AI_PROVIDER,
  DEFAULT_ANTHROPIC_MODEL,
  DEFAULT_OPENAI_MODEL,
} from "../constants";
import { env } from "@/env.mjs";
import { type CoreTool, generateObject, generateText, streamText } from "ai";
import { z } from "zod";
import { saveAiUsage } from "../usage";

export function getAiProviderAndModel(
  provider: string | null,
  model: string | null,
): {
  provider: string;
  model: string;
} {
  if (provider === "anthropic") {
    return {
      provider,
      model: model || DEFAULT_ANTHROPIC_MODEL,
    };
  }

  return {
    provider: provider || DEFAULT_AI_PROVIDER,
    model: model || DEFAULT_OPENAI_MODEL,
  };
}

function getModel(provider: string, model: string, apiKey: string | null) {
  if (provider === "openai") {
    return createOpenAI({ apiKey: apiKey || env.OPENAI_API_KEY })(model);
  } else if (provider === "anthropic") {
    return createAnthropic({ apiKey: apiKey || env.ANTHROPIC_API_KEY })(model);
  }

  throw new Error("AI provider not supported");
}

export async function chatCompletionObject<T>({
  provider,
  model,
  apiKey,
  prompt,
  system,
  schema,
  userEmail,
  usageLabel,
}: {
  provider: string;
  model: string;
  apiKey: string | null;
  prompt: string;
  system?: string;
  schema: z.Schema<T>;
  userEmail: string;
  usageLabel: string;
}) {
  const result = await generateObject({
    model: getModel(provider, model, apiKey),
    prompt,
    system,
    schema,
  });

  if (result.usage) {
    await saveAiUsage({
      email: userEmail,
      usage: result.usage,
      provider,
      model,
      label: usageLabel,
    });
  }

  return result;
}
