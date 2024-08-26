"use client";

import { Row } from "@/app/[locale]/(dashboard)/dashboard/comments/authors/_components/types";
import { type PostHog } from "posthog-js/react";
import { useCallback, useState } from "react";

export function useBanAuthorButton<T extends Row>({
  item,
  hasApproveorBanAccess,
  mutate,
  posthog,
  refetchPremium,
}: {
  item: T;
  hasApproveorBanAccess: boolean;
  mutate: () => Promise<void>;
  posthog: PostHog;
  refetchPremium: () => Promise<any>;
}) {
  const [banAuthorLoading, setBanAuthorLoading] = useState(false);

  const onBanAuthor = useCallback(async () => {
    if (!hasApproveorBanAccess) return;

    setBanAuthorLoading(true);

    //TODO: perform actions

    posthog.capture("Clicked Ban Author");

    setBanAuthorLoading(false);
  }, [hasApproveorBanAccess, item.name, mutate, posthog, refetchPremium]);

  return {
    banAuthorLoading,
    onBanAuthor,
  };
}
