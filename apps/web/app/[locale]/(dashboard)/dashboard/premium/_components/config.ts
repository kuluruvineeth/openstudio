import { env } from "@/env.mjs";
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

const basicTier = {
  name: "Basic",
  tiers: {
    monthly: PremiumTier.BASIC_MONTHLY,
    annually: PremiumTier.BASIC_ANNUALLY,
  },
  //TODO: Add Links
  href: {
    monthly: "",
    annually: "",
  },
  price: { monthly: pricing.BASIC_MONTHLY, annually: pricing.BASIC_ANNUALLY },
  priceAdditional: {
    monthly: pricingAdditionalChannel.BASIC_MONTHLY,
    annually: pricingAdditionalChannel.BASIC_ANNUALLY,
  },
  discount: {
    monthly: 0,
    annually: discount(pricing.BASIC_MONTHLY, pricing.BASIC_ANNUALLY),
  },
  description: "Unlimited Approve or Ban credits.",
  features: [
    "Everything in free",
    "5 Categorization's per month",
    "Unlimited approves or bans",
    "Comment Analytics",
  ],
  cta: "Upgrade",
};

const proTier = {
  name: "Pro",
  tiers: {
    monthly: PremiumTier.PRO_MONTHLY,
    annually: PremiumTier.PRO_ANNUALLY,
  },
  href: {
    monthly: env.NEXT_PUBLIC_PRO_MONTHLY_PAYMENT_LINK,
    annually: env.NEXT_PUBLIC_PRO_ANNUALLY_PAYMENT_LINK,
  },
  price: { monthly: pricing.PRO_MONTHLY, annually: pricing.PRO_ANNUALLY },
  priceAdditional: {
    monthly: pricingAdditionalChannel.PRO_MONTHLY,
    annually: pricingAdditionalChannel.PRO_ANNUALLY,
  },
  discount: {
    monthly: 0,
    annually: discount(pricing.PRO_MONTHLY, pricing.PRO_ANNUALLY),
  },
  description: "Unlock AI features with your own OpenAI key.",
  features: [
    "Everything in basic",
    "Unlimited bans or approvals",
    "AI Automations with personal OpenAI key",
    "AI automated categorization with personal OpenAI key",
    "AI Planned mode with personal OpenAI key",
    "AI test mode with personal OpenAI key",
  ],
  cta: "Upgrade",
  mostPopular: false,
};

const businessTier = {
  name: "Business",
  tiers: {
    monthly: PremiumTier.BUSINESS_MONTHLY,
    annually: PremiumTier.BUSINESS_ANNUALLY,
  },
  href: {
    monthly: env.NEXT_PUBLIC_BUSINESS_MONTHLY_PAYMENT_LINK,
    annually: env.NEXT_PUBLIC_BUSINESS_ANNUALLY_PAYMENT_LINK,
  },
  price: {
    monthly: pricing.BUSINESS_MONTHLY,
    annually: pricing.BUSINESS_ANNUALLY,
  },
  priceAdditional: {
    monthly: pricingAdditionalChannel.BUSINESS_MONTHLY,
    annually: pricingAdditionalChannel.BUSINESS_ANNUALLY,
  },
  discount: {
    monthly: 0,
    annually: discount(pricing.BUSINESS_MONTHLY, pricing.BUSINESS_ANNUALLY),
  },
  description: "Unlock full AI-powered channel management",
  features: [
    "Everything in pro",
    "Unlimited AI credits",
    "No need to provide your own OpenAI API key",
    "Priority support",
  ],
  cta: "Upgrade",
  mostPopular: true,
};
