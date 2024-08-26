import { AuthorStatsResponse } from "@/app/api/user/stats/comments/authors/route";
import { AuthorStatusType } from "@/types/app";
import React from "react";

export type Row = {
  name: string;
  status?: AuthorStatusType | null;
};

export type Author = AuthorStatsResponse["authors"][number];

export interface RowProps {
  item: Author;
  setOpenedAuthor: React.Dispatch<React.SetStateAction<Author | undefined>>;
  authorDisplayName: string;
  mutate: () => Promise<any>;
  selected: boolean;
  onSelectRow: () => void;
  onDoubleClick: () => void;
  hasApproveorBanAccess: boolean;
  refetchPremium: () => Promise<any>;
  openPremiumModal: () => void;
}
