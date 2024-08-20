import {
  DEFAULT_AI_PROVIDER,
  DEFAULT_ANTHROPIC_MODEL,
  DEFAULT_OPENAI_MODEL,
} from "../constants";
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
