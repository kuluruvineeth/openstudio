"use client";

import { type PostHog } from "posthog-js/react";
import { Row } from "./types";
import { useApproveAuthorButton } from "@/hooks/useApproveAuthorButton";
import { Button, ButtonLoader } from "@openstudio/ui/components/ui/button";
import { AuthorStatus } from "@/types/app";
import { BadgeCheckIcon } from "lucide-react";

export function ApproveAuthorButton<T extends Row>({
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
  const { approveAuthorLoading, onApproveAuthor } = useApproveAuthorButton({
    item,
    hasApproveorBanAccess,
    mutate,
    posthog,
    refetchPremium,
  });

  return (
    <Button
      size={"sm"}
      variant={item.status === AuthorStatus.APPROVED ? "green" : "secondary"}
      onClick={onApproveAuthor}
      disabled={!hasApproveorBanAccess}
    >
      {approveAuthorLoading && <ButtonLoader />}
      <span className="sr-only">Approve</span>
      <span>
        <BadgeCheckIcon className="h-4 w-4" />
      </span>
    </Button>
  );
}
