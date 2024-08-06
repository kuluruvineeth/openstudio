export type User = {
  avatar_url: string;
  created_at: string | null;
  email: string;
  id: string;
  name: string | null;
  type: string | null;
  access_token: string | null;
  refresh_token: string | null;
};

export interface DateRange {
  from: Date;
  to: Date | undefined;
}
