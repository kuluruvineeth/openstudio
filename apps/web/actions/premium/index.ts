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
