"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@openstudio/ui/components/ui/dropdown-menu";
import { Row } from "../../new-senders/_components/NewSenderRow";
import { type PostHog } from "posthog-js/react";
import { Button } from "@openstudio/ui/components/ui/button";
import { ExpandIcon, MoreHorizontalIcon } from "lucide-react";

export function MoreDropdown<T extends Row>({
  setOpenedAuthor,
  item,
  posthog,
}: {
  setOpenedAuthor?: (row: T) => void;
  item: T;
  posthog?: PostHog;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size={"icon"} variant={"ghost"}>
          <MoreHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!!setOpenedAuthor && (
          <DropdownMenuItem
            onClick={() => {
              setOpenedAuthor(item);
              posthog?.capture("Clicked Expand Sender");
            }}
          >
            <ExpandIcon className="mr-2 h-4 w-4" />
            <span>View Stats</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
