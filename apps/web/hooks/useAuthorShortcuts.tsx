"use client";

import { Row } from "@/app/[locale]/(dashboard)/dashboard/comments/new-senders/_components/NewSenderRow";
import { useEffect } from "react";

export function useAuthorShortcuts<T extends Row>({
  authors,
  selectedRow,
  setOpenedAuthor,
  setSelectedRow,
  refetchPremium,
  hasApproveorBanAccess,
  mutate,
}: {
  authors?: T[];
  selectedRow?: T;
  setSelectedRow: (row: T) => void;
  setOpenedAuthor: (row: T) => void;
  refetchPremium?: () => Promise<any>;
  hasApproveorBanAccess?: boolean;
  mutate?: () => Promise<any>;
}) {
  //perform actions using keybord shortcuts
  useEffect(() => {
    const down = async (e: KeyboardEvent) => {
      const item = selectedRow;
      if (!item) return;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        console.log("This is working");
        e.preventDefault();
        const index = authors?.findIndex((a) => a.name === item.name);
        if (index === undefined) return;
        const nextItem = authors?.[index + (e.key === "ArrowDown" ? 1 : -1)];
        if (!nextItem) return;
        setSelectedRow(nextItem);
        return;
      } else if (e.key === "Enter") {
        //open modal
        e.preventDefault();
        setOpenedAuthor(item);
        return;
      }

      if (!hasApproveorBanAccess) return;
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [
    mutate,
    authors,
    selectedRow,
    hasApproveorBanAccess,
    refetchPremium,
    setSelectedRow,
    setOpenedAuthor,
  ]);
}
