import { PremiumTier, PremiumTierType } from "@/types/app";
export const frequencies = [
  {
    value: "monthly" as const,
    label: "Monthly",
    priceSuffix: "/month",
  },
  {
    value: "annually" as const,
    label: "Annually",
    priceSuffix: "/month",
  },
];
export const pricing: Record<PremiumTierType, number> = {
  [PremiumTier.BASIC_MONTHLY]: 10,
  [PremiumTier.BASIC_ANNUALLY]: 6,
  [PremiumTier.PRO_MONTHLY]: 14,
  [PremiumTier.PRO_ANNUALLY]: 9,
  [PremiumTier.BUSINESS_MONTHLY]: 22,
  [PremiumTier.BUSINESS_ANNUALLY]: 15,
  [PremiumTier.COPILOT_MONTHLY]: 99,
  [PremiumTier.LIFETIME]: 299,
};
