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

function getModel({ ai_provider, ai_model, ai_api_key }: UserAIFields) {
  const provider = ai_provider || Provider.ANTHROPIC;
  //TODO: Temporary code for testing
  const model = ai_model || Model.GPT_4O;
  return {
    provider: Provider.OPEN_AI,
    model,
    llmModel: createOpenAI({ apiKey: ai_api_key || env.OPENAI_API_KEY })(model),
  };

  if (provider === Provider.OPEN_AI) {
    const model = ai_model || Model.GPT_4O;
    return {
      provider: Provider.OPEN_AI,
      model,
      llmModel: createOpenAI({ apiKey: ai_api_key || env.OPENAI_API_KEY })(
        model,
      ),
    };
  }

  if (provider === Provider.ANTHROPIC) {
    if (ai_api_key) {
      const model = ai_model || Model.CLAUDE_3_5_SONNET_ANTHROPIC;
      return {
        provider: Provider.ANTHROPIC,
        model,
        llmModel: createAnthropic({ apiKey: ai_api_key })(model),
      };
    } else {
      if (!env.BEDROCK_ACCESS_KEY) {
        throw new Error("BEDROCK_ACCESS_KEY is not set");
      }
      if (!env.BEDROCK_SECRET_KEY) {
        throw new Error("BEDROCK_SECRET_KEY is not set");
      }

      const model = ai_model || Model.CLAUDE_3_5_SONNET_BEDROCK;
      return {
        provider: Provider.ANTHROPIC,
        model,
        llmModel: createAmazonBedrock({
          accessKeyId: env.BEDROCK_ACCESS_KEY,
          secretAccessKey: env.BEDROCK_SECRET_KEY,
          region: env.BEDROCK_REGION,
        })(model),
      };
    }
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

//TODO: to fix type visibility type issue
export async function chatCompletionStream({
  provider,
  model,
  apiKey,
  prompt,
  system,
  userEmail,
  usageLabel: label,
  onFinish,
}: {
  provider: string;
  model: string;
  apiKey: string | null;
  prompt: string;
  system?: string;
  userEmail: string;
  usageLabel: string;
  onFinish?: (text: string) => Promise<void>;
}) {
  const result = await streamText({
    model: getModel(provider, model, apiKey),
    prompt,
    system,
    onFinish: async ({ usage, text }) => {
      await saveAiUsage({
        email: userEmail,
        provider,
        model,
        usage,
        label,
      });

      if (onFinish) await onFinish(text);
    },
  });

  return result;
}

export async function chatCompletionTools({
  provider,
  model,
  apiKey,
  prompt,
  system,
  tools,
  label,
  userEmail,
}: {
  provider: string;
  model: string;
  apiKey: string | null;
  prompt: string;
  system?: string;
  tools: Record<string, CoreTool>;
  label: string;
  userEmail: string;
}) {
  const result = await generateText({
    model: getModel(provider, model, apiKey),
    tools,
    toolChoice: "required",
    prompt,
    system,
  });

  if (result.usage) {
    await saveAiUsage({
      email: userEmail,
      usage: result.usage,
      provider,
      model,
      label,
    });
  }

  return result;
}
