import { User } from "@/types/app";

export type UserAIFields = Pick<
  User,
  "ai_provider" | "ai_model" | "ai_api_key"
>;
