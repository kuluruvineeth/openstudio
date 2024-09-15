import { env } from "@/env.mjs";
import { PremiumTier, PremiumTierType } from "@/types/app";
import { Payload } from "./types";
import {
  cancelPremium,
  extendPremium,
  upgradeToPremium,
} from "@/actions/premium/server";
import { posthogCaptureEvent } from "@/utils/posthog";
import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/supabase/supabaseServer";

async function subscriptionCreated({
  payload,
  userId,
}: {
  payload: Payload;
  userId: string;
}) {
  if (!payload.data.attributes.renews_at) {
    throw new Error("No renews_at provided");
  }

  const lemon_squeezy_renews_at = new Date(
    payload.data.attributes.renews_at,
  ).toISOString();

  if (!payload.data.attributes.first_subscription_item) {
    throw new Error("No subscription item");
  }

  const tier = getSubscriptionTier({
    variantId: payload.data.attributes.variant_id,
  });

  const updatedPremium = await upgradeToPremium({
    userId,
    tier,
    lemon_squeezy_renews_at,
    lemon_squeezy_subscription_id:
      payload.data.attributes.first_subscription_item.subscription_id,
    lemon_squeezy_subscription_item_id:
      payload.data.attributes.first_subscription_item.id,
    lemon_squeezy_order_id: null,
    lemon_squeezy_customer_id: payload.data.attributes.customer_id,
    lemon_squeezy_product_id: payload.data.attributes.product_id,
    lemon_squeezy_variant_id: payload.data.attributes.variant_id,
  });

  if (updatedPremium.email) {
    await Promise.allSettled([
      posthogCaptureEvent(updatedPremium.email, "Upgraded to premium", {
        ...payload.data.attributes,
        $set: { premium: true, premiumTier: "subscription" },
      }),
      //TODO: send out emails
    ]);
  }

  return NextResponse.json({ ok: true });
}

async function lifetimeOrder({
  payload,
  userId,
}: {
  payload: Payload;
  userId: string;
}) {
  if (!payload.data.attributes.first_order_item) {
    throw new Error("No order item");
  }

  const updatedPremium = await upgradeToPremium({
    userId,
    tier: PremiumTier.LIFETIME,
    lemon_squeezy_renews_at: null,
    lemon_squeezy_subscription_id: null,
    lemon_squeezy_subscription_item_id: null,
    lemon_squeezy_order_id: payload.data.attributes.first_order_item.order_id,
    lemon_squeezy_customer_id: payload.data.attributes.customer_id,
    lemon_squeezy_product_id: payload.data.attributes.product_id,
    lemon_squeezy_variant_id: payload.data.attributes.variant_id,
  });

  if (updatedPremium.email) {
    await Promise.allSettled([
      posthogCaptureEvent(updatedPremium.email, "Upgraded to lifetime plan", {
        ...payload.data.attributes,
        $set: { premium: true, premiumTier: "lifetime" },
      }),
      //TODO: send out emails
    ]);
  }

  return NextResponse.json({ ok: true });
}

async function subscriptionUpdated({
  payload,
  premium_id,
}: {
  payload: Payload;
  premium_id: string;
}) {
  if (!payload.data.attributes.renews_at) {
    throw new Error("No renews_at provided");
  }

  const updatedPremium = await extendPremium({
    premium_id,
    lemon_squeezy_renews_at: new Date(
      payload.data.attributes.renews_at,
    ).toISOString(),
  });

  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("id", payload.meta.custom_data?.user_id)
    .single();

  if (data?.email) {
    await posthogCaptureEvent(
      data.email,
      "Premium subscription payment success",
      {
        ...payload.data.attributes,
        $set: { premium: true, premiumTier: "subscription" },
      },
    );
  }

  return NextResponse.json({ ok: true });
}

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
