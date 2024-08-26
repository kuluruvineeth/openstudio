"use client";

import { AuthorStatusType } from "@/types/app";

export type Row = {
  name?: string;
  status?: AuthorStatusType | null;
};
