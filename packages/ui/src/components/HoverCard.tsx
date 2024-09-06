"use client";

import React from "react";
import {
  HoverCard as HoverCardUi,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";

export function HoverCard(props: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <HoverCardUi>
      <HoverCardTrigger asChild>{props.children}</HoverCardTrigger>
      <HoverCardContent className="w-80" align="start" side="right">
        {props.content}
      </HoverCardContent>
    </HoverCardUi>
  );
}
