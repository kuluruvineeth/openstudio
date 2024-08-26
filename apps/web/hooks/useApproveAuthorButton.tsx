"use client";

import { Row } from "@/app/[locale]/(dashboard)/dashboard/comments/authors/_components/types";
import { type PostHog } from "posthog-js/react";
import { useCallback, useState } from "react";

export function useApproveAuthorButton<T extends Row>({
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
  const [approveAuthorLoading, setApproveAuthorLoading] = useState(false);

  const onApproveAuthor = useCallback(async () => {
    if (!hasApproveorBanAccess) return;

    setApproveAuthorLoading(true);

    //TODO: perform actions

    posthog.capture("Clicked Ban Author");

    setApproveAuthorLoading(false);
  }, [hasApproveorBanAccess, item.name, mutate, posthog, refetchPremium]);

  return {
    approveAuthorLoading,
    onApproveAuthor,
  };
}
