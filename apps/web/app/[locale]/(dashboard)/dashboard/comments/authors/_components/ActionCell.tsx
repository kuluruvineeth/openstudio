"use client";

import React from "react";
import { Row } from "./types";
import { usePostHog } from "posthog-js/react";
import {
  PremiumTooltip,
  PremiumTooltipContent,
} from "../../../premium/_components/PremiumAlert";
import { BanAuthorButton } from "./BanAuthorButton";
import { Tooltip } from "@openstudio/ui/components/Tooltip";
import { ApproveAuthorButton } from "./ApproveAuthorButton";
import { MoreDropdown } from "./MoreDropdown";

export function ActionCell<T extends Row>({
  item,
  hasApproveorBanAccess,
  mutate,
  refetchPremium,
  setOpenedAuthor,
  selected,
  openPremiumModal,
  authorDisplayName,
}: {
  item: T;
  hasApproveorBanAccess: boolean;
  mutate: () => Promise<void>;
  refetchPremium: () => Promise<any>;
  setOpenedAuthor: React.Dispatch<React.SetStateAction<T | undefined>>;
  selected: boolean;
  openPremiumModal: () => void;
  authorDisplayName: string;
}) {
  const posthog = usePostHog();

  return (
    <>
      <PremiumTooltip
        showTooltip={!hasApproveorBanAccess}
        openModal={openPremiumModal}
      >
        <BanAuthorButton
          item={item}
          hasApproveorBanAccess={hasApproveorBanAccess}
          mutate={mutate}
          posthog={posthog}
          refetchPremium={refetchPremium}
        />
      </PremiumTooltip>
      <Tooltip
        contentComponent={
          !hasApproveorBanAccess ? (
            <PremiumTooltipContent openModal={openPremiumModal} />
          ) : undefined
        }
        content={
          hasApproveorBanAccess
            ? "Approve Author to receive comments from"
            : undefined
        }
      >
        <ApproveAuthorButton
          item={item}
          hasApproveorBanAccess={hasApproveorBanAccess}
          mutate={mutate}
          posthog={posthog}
          refetchPremium={refetchPremium}
        />
      </Tooltip>
      <MoreDropdown
        setOpenedAuthor={setOpenedAuthor}
        item={item}
        posthog={posthog}
      />
    </>
  );
}
