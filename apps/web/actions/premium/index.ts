import {
  FeatureAccess,
  FeatureAccessType,
  PremiumTier,
  PremiumTierType,
  Premium,
} from "@/types/app";

export const isPremium = (lemonSqueezyRenewsAt: Date | null): boolean => {
  return !!lemonSqueezyRenewsAt && new Date(lemonSqueezyRenewsAt) > new Date();
};

const getUserPlan = (
  lemonSqueezyRenewsAt?: string | null,
): PremiumTierType | null => {
  if (!lemonSqueezyRenewsAt) return null;

  const renewsAt = new Date(lemonSqueezyRenewsAt);

  // if renewsAt is 5 years in the future then it's a lifetime plan
  if (renewsAt.getFullYear() - new Date().getFullYear() >= 5) {
    return PremiumTier.LIFETIME;
  }

  // if renewsAt is more than 6 months in the future then it's annual plan
  if (renewsAt > new Date(new Date().setMonth(new Date().getMonth() + 6))) {
    return PremiumTier.BASIC_ANNUALLY;
  }

  // if renewsAt is less than 6 months in the future then it's a monthly plan
  return PremiumTier.BASIC_MONTHLY;
};

export const getUserTier = (
  premium?: Pick<Premium, "tier" | "lemon_squeezy_renews_at"> | null,
) => {
  return premium?.tier || getUserPlan(premium?.lemon_squeezy_renews_at);
};

export const isAdminForPremium = (
  premiumAdmins: { id: string }[],
  userId?: string,
) => {
  if (!userId) return;
  // if no admins are set, then we skip the check
  if (!premiumAdmins.length) return true;
  return premiumAdmins.some((admin) => admin.id === userId);
};

export const hasApproveOrBanAccess = (
  approveOrBanAccess?: FeatureAccessType | null,
  approveOrBanCredits?: number | null,
): boolean => {
  if (
    approveOrBanAccess === FeatureAccess.UNLOCKED ||
    approveOrBanAccess === FeatureAccess.UNLOCKED_WITH_API_KEY
  ) {
    return true;
  }

  return approveOrBanCredits !== 0;
};

export const hasAiAccess = (
  aiAutomationAccess?: FeatureAccessType | null,
  openAIApiKey?: string | null,
) => {
  const hasAiAccess = !!(
    aiAutomationAccess === FeatureAccess.UNLOCKED ||
    (aiAutomationAccess === FeatureAccess.UNLOCKED_WITH_API_KEY && openAIApiKey)
  );

  return hasAiAccess;
};
