"use client";

import {
  hasAiAccess,
  hasApproveOrBanAccess,
  isPremium,
} from "@/actions/premium";
import { UserResponse } from "@/app/api/user/me/route";
import { PremiumTier } from "@/types/app";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
export function usePremium() {
  const { data, isLoading, error, refetch } = useQuery<UserResponse>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get<UserResponse>("/user/me");
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const premium = data?.premium;
  const openAIApikey = data?.ai_api_key;

  const isUserPremium = !!(
    premium && isPremium(premium.lemon_squeezy_renews_at)
  );

  const isProPlanWithoutApiKey =
    (premium?.tier === PremiumTier.PRO_MONTHLY ||
      premium?.tier === PremiumTier.PRO_ANNUALLY) &&
    !openAIApikey;

  return {
    data,
    isLoading,
    error,
    isPremium: isUserPremium,
    hasApproveOrBanAccess:
      isUserPremium ||
      hasApproveOrBanAccess(
        premium?.bulk_approve_or_ban_access,
        premium?.approve_or_ban_credits,
      ),
    hasAiAccess: hasAiAccess(premium?.ai_automation_access),
    isProPlanWithoutApiKey,
  };
}
