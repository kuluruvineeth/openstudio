"use client";

import { AuthorStatusType } from "@/types/app";
import { formatShortDate } from "@/utils/date";
import { TableRow, TableCell } from "@tremor/react";
import React from "react";
import { MoreDropdown } from "../../authors/_components/MoreDropdown";
import { usePostHog } from "posthog-js/react";

export type Row = {
  name?: string;
  status?: AuthorStatusType | null;
};

export function NewSenderRow(props: {
  item?: Row;
  firstComment: {
    commentId: string | undefined;
    from: string | undefined;
    text: string | undefined;
    timestamp: any | undefined;
  };
  numberOfComments: number;
  setOpenedAuthor?: React.Dispatch<React.SetStateAction<Row | undefined>>;
  mutate?: () => Promise<any>;
  selected?: boolean;
  onSelectRow?: () => void;
  hasBanApproveAccess?: boolean;
  refetchPremium?: () => Promise<any>;
}) {
  const {
    item,
    firstComment,
    numberOfComments,
    refetchPremium,
    setOpenedAuthor,
  } = props;

  const posthog = usePostHog();

  return (
    <TableRow
      key={firstComment.commentId}
      className={props.selected ? "bg-red-50" : undefined}
      aria-selected={props.selected || undefined}
      data-selected={props.selected || undefined}
      onMouseEnter={props.onSelectRow}
    >
      <TableCell className="max-w-[200px] truncate pl-6 lg:max-w-[300px]">
        {firstComment.from}
      </TableCell>
      <TableCell className="max-w-[300px] truncate lg:max-w-[400px]">
        {firstComment.text}
      </TableCell>
      <TableCell>{formatShortDate(new Date(firstComment.timestamp))}</TableCell>
      <TableCell className="text-center">{numberOfComments}</TableCell>
      <TableCell>
        <MoreDropdown
          item={item!}
          setOpenedAuthor={setOpenedAuthor}
          posthog={posthog}
          // selected={props.selected}
        />
      </TableCell>
    </TableRow>
  );
}
