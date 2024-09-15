import { env } from "@/env.mjs";
import { PremiumTier, PremiumTierType } from "@/types/app";
import { Payload } from "./types";
import crypto from "crypto";
import {
  cancelPremium,
  extendPremium,
  upgradeToPremium,
} from "@/actions/premium/server";
import { posthogCaptureEvent } from "@/utils/posthog";
import { NextResponse } from "next/server";
import { withError } from "@/utils/middleware";
import { supabaseServerClient } from "@/supabase/supabaseServer";

export const POST = withError(async (request: Request) => {
  const payload = await getPayload(request);
  const userId = payload.meta.custom_data?.user_id;

  console.log("===Lemon event type:", payload.meta.event_name);

  // ignored events
  if (["subscription_payment_success"].includes(payload.meta.event_name)) {
    return NextResponse.json({ ok: true });
  }

  // monthly/annual subscription
  if (payload.meta.event_name === "subscription_created") {
    if (!userId) throw new Error("No userId provided");
    return await subscriptionCreated({ payload, userId });
  }

  const variant = payload.data.attributes.first_order_item?.variant_id;
  const isLifetimePlan = variant === env.NEXT_PUBLIC_LIFETIME_VARIANT_ID;

  // lifetime plan
  if (payload.meta.event_name === "order_created" && isLifetimePlan) {
    if (!userId) throw new Error("No userId provided");
    return await lifetimeOrder({ payload, userId });
  }

  const lemon_squeezy_customer_id = payload.data.attributes.customer_id;

  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("premium")
    .select("id")
    .eq("lemon_squeezy_customer_id", lemon_squeezy_customer_id)
    .single();

  if (!data?.id) {
    throw new Error(
      `No user found for lemon_squeezy_customer_id ${lemon_squeezy_customer_id}`,
    );
  }

  // renewal
  if (payload.meta.event_name === "subscription_updated") {
    return await subscriptionUpdated({ payload, premium_id: data.id });
  }

  // cancellation
  if (payload.data.attributes.ends_at) {
    return await subscriptionCancelled({
      payload,
      premium_id: data.id,
      ends_at: payload.data.attributes.ends_at,
    });
  }

  return NextResponse.json({ ok: true });
});

// https://docs.lemonsqueezy.com/help/webhooks#signing-requests
// https://gist.github.com/amosbastian/e403e1d8ccf4f7153f7840dd11a85a69
async function getPayload(request: Request): Promise<Payload> {
  if (!env.LEMON_SQUEEZY_SIGNING_SECRET) {
    throw new Error("No Lemon Squeezy signing secret provided.");
  }

  const text = await request.text();
  const hmac = crypto.createHmac("sha256", env.LEMON_SQUEEZY_SIGNING_SECRET);
  const digest = Buffer.from(hmac.update(text).digest("hex"), "utf-8");
  const signature = Buffer.from(
    request.headers.get("x-signature") as string,
    "utf-8",
  );

  if (!crypto.timingSafeEqual(digest, signature)) {
    throw new Error("Invalid signature.");
  }

  const payload: Payload = JSON.parse(text);

  return payload;
}

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
