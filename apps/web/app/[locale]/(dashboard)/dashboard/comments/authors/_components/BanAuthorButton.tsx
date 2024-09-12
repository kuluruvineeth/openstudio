"use client";

import { type PostHog } from "posthog-js/react";
import { Row } from "./types";
import { Button, ButtonLoader } from "@openstudio/ui/components/ui/button";
import { AuthorStatus } from "@/types/app";
import { MailMinusIcon, MinusIcon, XIcon } from "lucide-react";
import { useBanAuthorButton } from "@/hooks/useBanAuthorButton";

export function BanAuthorButton<T extends Row>({
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
  const { banAuthorLoading, onBanAuthor } = useBanAuthorButton({
    item,
    hasApproveorBanAccess,
    mutate,
    posthog,
    refetchPremium,
  });

  return (
    <Button
      size={"sm"}
      variant={item.status === AuthorStatus.BANNED ? "red" : "secondary"}
      onClick={onBanAuthor}
      disabled={!hasApproveorBanAccess}
    >
      {banAuthorLoading && <ButtonLoader />}
      <span className="hidden xl:block">BAN Author</span>
      <span className="block xl:hidden">
        <XIcon className="h-4 w-4" />
      </span>
    </Button>
  );
}
