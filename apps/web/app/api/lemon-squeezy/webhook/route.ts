import { env } from "@/env.mjs";
import { PremiumTier, PremiumTierType } from "@/types/app";
function getSubscriptionTier({
  variantId,
}: {
  variantId: number;
}): PremiumTierType {
  switch (variantId) {
    case env.NEXT_PUBLIC_BASIC_MONTHLY_VARIANT_ID:
      return PremiumTier.BASIC_MONTHLY;
    case env.NEXT_PUBLIC_BASIC_ANNUALLY_VARIANT_ID:
      return PremiumTier.BASIC_ANNUALLY;

    case env.NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID:
      return PremiumTier.PRO_MONTHLY;
    case env.NEXT_PUBLIC_PRO_ANNUALLY_VARIANT_ID:
      return PremiumTier.PRO_ANNUALLY;

    case env.NEXT_PUBLIC_BUSINESS_MONTHLY_VARIANT_ID:
      return PremiumTier.BUSINESS_MONTHLY;
    case env.NEXT_PUBLIC_BUSINESS_ANNUALLY_VARIANT_ID:
      return PremiumTier.BUSINESS_ANNUALLY;
  }

  throw new Error(`Unknown variant id: ${variantId}`);
}
