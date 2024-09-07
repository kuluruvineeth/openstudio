export type User = {
  about: string | null;
  access_token: string | null;
  ai_model: string | null;
  ai_provider: string | null;
  avatar_url: string;
  behavior_profile: any | null;
  completed_onboarding: boolean | null;
  created_at: string | null;
  email: string;
  id: string;
  last_login: string | null;
  name: string | null;
  onboarding_answers: any | null;
  openai_api_key: string | null;
  premium_admin_id: string | null;
  premium_id: string | null;
  refresh_token: string | null;
  type: string | null;
};

export type Premium = {
  ai_automation_access: FeatureAccessType | null;
  ai_credits: number | null;
  ai_month: number | null;
  approve_or_ban_credits: number | null;
  approve_or_ban_month: number | null;
  bulk_approve_or_ban_access: FeatureAccessType | null;
  created_at: string | null;
  id: string;
  lemon_license_instance_id: string | null;
  lemon_license_key: string | null;
  lemon_squeezy_customer_id: number | null;
  lemon_squeezy_order_id: number | null;
  lemon_squeezy_product_id: number | null;
  lemon_squeezy_renews_at: string | null;
  lemon_squeezy_subscription_id: number | null;
  lemon_squeezy_subscription_item_id: number | null;
  lemon_squeezy_variant_id: number | null;
  tier: PremiumTierType | null;
  updated_at: string | null;
};

export type Action = {
  content_prompt: string | null;
  content: string | null;
  created_at: string | null;
  id: string;
  rule_id: string;
  type: ActionTypeType;
  updated_at: string | null;
};

export type Author = {
  created_at: string | null;
  display_name: string;
  id: string;
  status: AuthorStatusType | null;
  updated_at: string | null;
  user_id: string;
};


export interface DateRange {
  from: Date;
  to: Date | undefined;
}

export const ActionType = {
  REPLY: "REPLY",
  PUBLISH: "PUBLISH",
  REJECT: "REJECT",
  REVIEW: "REVIEW",
  MARK_SPAM: "MARK_SPAM",
} as const;
export type ActionTypeType = (typeof ActionType)[keyof typeof ActionType];

export const AuthorStatus = {
  APPROVED: "APPROVED",
  BANNED: "BANNED",
} as const;
export type AuthorStatusType = (typeof AuthorStatus)[keyof typeof AuthorStatus];

export const ExecutedRuleStatus = {
  APPLIED: "APPLIED",
  REJECTED: "REJECTED",
  PENDING: "PENDING",
  SKIPPED: "SKIPPED",
} as const;
export type ExecutedRuleStatusType =
  (typeof ExecutedRuleStatus)[keyof typeof ExecutedRuleStatus];

export const FeatureAccess = {
  UNLOCKED: "UNLOCKED",
  UNLOCKED_WITH_API_KEY: "UNLOCKED_WITH_API_KEY",
  LOCKED: "LOCKED",
} as const;
export type FeatureAccessType =
  (typeof FeatureAccess)[keyof typeof FeatureAccess];
export const PremiumTier = {
  BASIC_MONTHLY: "BASIC_MONTHLY",
  BASIC_ANNUALLY: "BASIC_ANNUALLY",
  PRO_MONTHLY: "PRO_MONTHLY",
  PRO_ANNUALLY: "PRO_ANNUALLY",
  BUSINESS_MONTHLY: "BUSINESS_MONTHLY",
  BUSINESS_ANNUALLY: "BUSINESS_ANNUALLY",
  COPILOT_MONTHLY: "COPILOT_MONTHLY",
  LIFETIME: "LIFETIME",
} as const;

export type PremiumTierType = (typeof PremiumTier)[keyof typeof PremiumTier];

export type RuleType = "AI" | "STATIC";
