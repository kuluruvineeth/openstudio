"use client";

import { Button } from "@openstudio/ui/components/ui/button";
import { ChevronDown, ChevronsUpDownIcon } from "lucide-react";

export function HeaderButton(props: {
  children: React.ReactNode;
  sorted: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={props.onClick}
    >
      <span>{props.children}</span>
      {props.sorted ? (
        <ChevronDown className="ml-2 h-4 w-4" />
      ) : (
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}
