"use server";

import { supabaseServerClient } from "@/supabase/supabaseServer";
import { FeatureAccess, PremiumTier, PremiumTierType } from "@/types/app";

const TEN_YEARS = 10 * 365 * 24 * 60 * 60 * 1000;

export async function upgradeToPremium(options: {
  userId: string;
  tier: PremiumTierType;
  lemon_squeezy_renews_at: string | null;
  lemon_squeezy_subscription_id: number | null;
  lemon_squeezy_subscription_item_id: number | null;
  lemon_squeezy_order_id: number | null;
  lemon_squeezy_customer_id: number | null;
  lemon_squeezy_product_id: number | null;
  lemon_squeezy_variant_id: number | null;
  lemon_license_key?: string;
  lemon_license_instance_id?: string;
}): Promise<{ premium_id: string; email: string }> {
  const { userId, ...rest } = options;

  const lemon_squeezy_renews_at =
    options.tier === PremiumTier.LIFETIME
      ? new Date(Date.now() + TEN_YEARS).toISOString()
      : options.lemon_squeezy_renews_at;

  const supabase = await supabaseServerClient();

  // Fetch the user to check if they already have a premium ID
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("premium_id, email")
    .eq("id", userId)
    .single();

  if (userError) {
    throw new Error(`Error fetching user: ${userError.message}`);
  }

  const premiumData = {
    tier: options.tier,
    lemon_squeezy_renews_at,
    lemon_squeezy_subscription_id: options.lemon_squeezy_subscription_id,
    lemon_squeezy_subscription_item_id:
      options.lemon_squeezy_subscription_item_id,
    lemon_squeezy_order_id: options.lemon_squeezy_order_id,
    lemon_squeezy_customer_id: options.lemon_squeezy_customer_id,
    lemon_squeezy_product_id: options.lemon_squeezy_product_id,
    lemon_squeezy_variant_id: options.lemon_squeezy_variant_id,
    lemon_license_key: options.lemon_license_key,
    lemon_license_instance_id: options.lemon_license_instance_id,
    ...getTierAccess(options.tier),
  };

  if (user?.premium_id) {
    // Update the existing premium record
    const { data: updatedPremium, error: updateError } = await supabase
      .from("premium")
      .update(premiumData)
      .eq("id", user.premium_id)
      .select("id")
      .single();

    if (updateError) {
      throw new Error(`Error updating premium: ${updateError.message}`);
    }

    return {
      premium_id: updatedPremium.id,
      email: user.email,
    };
  } else {
    // Create a new premium record
    const { data: newPremium, error: createError } = await supabase
      .from("premium")
      .insert(premiumData)
      .select("id")
      .single();

    if (createError) {
      throw new Error(`Error creating premium: ${createError.message}`);
    }

    // Update the user's premium_id and premium_admin_id
    const { error: updateUserError } = await supabase
      .from("users")
      .update({ premium_id: newPremium.id, premium_admin_id: newPremium.id })
      .eq("id", userId);

    if (updateUserError) {
      throw new Error(`Error updating user: ${updateUserError.message}`);
    }

    return {
      premium_id: newPremium.id,
      email: user.email,
    };
  }
}

export async function extendPremium(options: {
  premium_id: string;
  lemon_squeezy_renews_at: string;
}) {
  const supabase = await supabaseServerClient();

  await supabase
    .from("premium")
    .update({
      lemon_squeezy_renews_at: options.lemon_squeezy_renews_at,
    })
    .eq("id", options.premium_id);
}

export async function cancelPremium(options: {
  premium_id: string;
  lemon_squeezy_renews_at: string;
}) {
  const supabase = await supabaseServerClient();

  await supabase
    .from("premium")
    .update({
      lemon_squeezy_renews_at: options.lemon_squeezy_renews_at,
      bulk_approve_or_ban_access: null,
      ai_automation_access: null,
    })
    .eq("id", options.premium_id);
}

function getTierAccess(tier: PremiumTierType) {
  switch (tier) {
    case PremiumTier.BASIC_MONTHLY:
    case PremiumTier.BASIC_ANNUALLY:
      return {
        ai_automation_access: FeatureAccess.LOCKED,
        bulk_approve_or_ban_access: FeatureAccess.LOCKED,
      };
    case PremiumTier.PRO_MONTHLY:
    case PremiumTier.PRO_ANNUALLY:
      return {
        ai_automation_access: FeatureAccess.UNLOCKED_WITH_API_KEY,
        bulk_approve_or_ban_access: FeatureAccess.UNLOCKED,
      };
    case PremiumTier.BUSINESS_MONTHLY:
    case PremiumTier.BUSINESS_ANNUALLY:
    case PremiumTier.COPILOT_MONTHLY:
    case PremiumTier.LIFETIME:
      return {
        ai_automation_access: FeatureAccess.UNLOCKED,
        bulk_approve_or_ban_access: FeatureAccess.UNLOCKED,
      };
    default:
      throw new Error(`Unknown premium tier: ${tier}`);
  }
}
