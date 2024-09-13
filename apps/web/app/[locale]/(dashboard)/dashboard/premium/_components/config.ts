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

export const pricingAdditionalChannel: Record<PremiumTierType, number> = {
  [PremiumTier.BASIC_MONTHLY]: 2,
  [PremiumTier.BASIC_ANNUALLY]: 1.5,
  [PremiumTier.PRO_MONTHLY]: 3,
  [PremiumTier.PRO_ANNUALLY]: 2.5,
  [PremiumTier.BUSINESS_MONTHLY]: 3.5,
  [PremiumTier.BUSINESS_ANNUALLY]: 3,
  [PremiumTier.COPILOT_MONTHLY]: 0,
  [PremiumTier.LIFETIME]: 59,
};

function discount(monthly: number, annually: number) {
  return ((monthly - annually) / monthly) * 100;
}

const freeTier = {
  name: "Free",
  id: "tier-free",
  tiers: {
    monthly: PremiumTier.BASIC_MONTHLY,
    annually: PremiumTier.BASIC_ANNUALLY,
  },
  href: { monthly: "/welcome", annually: "/welcome" },
  price: { monthly: 0, annually: 0 },
  priceAdditional: { monthly: 0, annually: 0 },
  discount: { monthly: 0, annually: 0 },
  description: "Try Open Studio for free.",
  features: [
    `Ban or Approve 5 audiences per month`,
    "Authors & Comments clean up",
    "New senders",
    "Comment Section",
  ],
  cta: "Get Started",
};
