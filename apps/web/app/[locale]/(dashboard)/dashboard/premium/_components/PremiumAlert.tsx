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
import { usePremiumModal } from "./PremiumModal";
import { AlertWithButton } from "@openstudio/ui/components/Alert";
import Link from "next/link";
import { CrownIcon } from "lucide-react";
import { Button } from "@openstudio/ui/components/Button";
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

function PremiumAlert({
  plan = "Open Studio Business",
  showSetApiKey,
}: {
  plan?: "Open Studio Business" | "Open Studio Pro";
  showSetApiKey: boolean;
}) {
  const { PremiumModal, openModal } = usePremiumModal();

  return (
    <>
      <AlertWithButton
        title="Premium"
        description={
          <>
            This is a premium feature. Upgrade to {plan}
            {showSetApiKey ? (
              <>
                {" "}
                or set an OpenAI API key on the{" "}
                <Link
                  href={"/settings"}
                  className="font-semibold hover:text-gray-700"
                >
                  settings
                </Link>{" "}
                page.
              </>
            ) : (
              <></>
            )}
          </>
        }
        icon={<CrownIcon className="h-4 w-4" />}
        button={<Button onClick={openModal}>Upgrade</Button>}
        variant="red"
      />
      <PremiumModal />
    </>
  );
}

export function PremiumAlertWithData() {
  const {
    hasAiAccess,
    isLoading: isLoadingPremium,
    isProPlanWithoutApiKey,
  } = usePremium();

  if (!isLoadingPremium && !hasAiAccess) {
    return <PremiumAlert showSetApiKey={isProPlanWithoutApiKey} />;
  }

  return null;
}
