export const Provider = {
  OPEN_AI: "openai",
  ANTHROPIC: "anthropic",
};

export const Model = {
  GPT_4O: "gpt-4o",
  GPT_4O_MINI: "gpt-4o-mini",
  CLAUDE_3_5_SONNET_BEDROCK: "anthropic.claude-3-5-sonnet-20240620-v1:0",
  CLAUDE_3_5_SONNET_ANTHROPIC: "claude-3-5-sonnet-20240620",
};

export const providerOptions = [
  {
    label: "OpenAI",
    value: Provider.OPEN_AI,
  },
  {
    label: "Anthropic",
    value: Provider.ANTHROPIC,
  },
];

export const modelOptions: Record<string, { label: string; value: string }[]> =
  {
    [Provider.OPEN_AI]: [
      {
        label: "GPT-4o",
        value: Model.GPT_4O,
      },
      {
        label: "GPT-4o Mini",
        value: Model.GPT_4O_MINI,
      },
    ],
    [Provider.ANTHROPIC]: [
      {
        label: "Claude 3.5 Sonnet",
        value: "claude-3-5-sonnet",
      },
    ],
  };

