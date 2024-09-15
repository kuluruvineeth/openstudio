import { env } from "@/env.mjs";
import { PremiumTier, PremiumTierType } from "@/types/app";
import { Payload } from "./types";
import {
  cancelPremium,
} from "@/actions/premium/server";
import { posthogCaptureEvent } from "@/utils/posthog";
import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/supabase/supabaseServer";

async function subscriptionCancelled({
  payload,
  premium_id,
  ends_at,
}: {
  payload: Payload;
  premium_id: string;
  ends_at: NonNullable<Payload["data"]["attributes"]["ends_at"]>;
}) {
  const updatedPremium = await cancelPremium({
    premium_id,
    lemon_squeezy_renews_at: new Date(ends_at).toISOString(),
  });

  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("id", payload.meta.custom_data?.user_id)
    .single();

  if (data?.email) {
    await Promise.allSettled([
      await posthogCaptureEvent(data.email, "Cancelled premium subscription", {
        ...payload.data.attributes,
        $set: { premium: false, premiumCancelled: true },
      }),
      //TODO: send cancellation email
    ]);
  }

  return NextResponse.json({ ok: true });
}

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
