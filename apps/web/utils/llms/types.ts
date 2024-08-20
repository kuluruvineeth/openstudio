import { User } from "@/types/app";

export type UserAIFields = Pick<
  User,
  "aiprovider" | "aimodel" | "openaiapikey"
>;
