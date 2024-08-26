export type User = {
  access_token: string | null;
  aimodel: string | null;
  aiprovider: string | null;
  avatar_url: string;
  created_at: string | null;
  email: string;
  id: string;
  name: string | null;
  openaiapikey: string | null;
  refresh_token: string | null;
  type: string | null;
};

export interface DateRange {
  from: Date;
  to: Date | undefined;
}

export const AuthorStatus = {
  APPROVED: "APPROVED",
  BANNED: "BANNED",
} as const;
export type AuthorStatusType = (typeof AuthorStatus)[keyof typeof AuthorStatus];
