"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import React from "react";
import { HeaderButton } from "./HeaderButton";
import { RowProps } from "./types";
import { ActionCell } from "./ActionCell";

export function AuthorDesktop(props: {
  tableRows?: React.ReactNode;
  sortColumn?: "comments";
  setSortColumn?: (sortColumn: "comments") => void;
}) {
  const { tableRows, sortColumn, setSortColumn } = props;

  return (
    <Table className="mt-6">
      <TableHead>
        <TableRow>
          <TableHeaderCell className="hidden lg:table-cell">
            <span className="text-sm font-medium">From</span>
          </TableHeaderCell>
          <TableHeaderCell>
            <HeaderButton
              sorted={sortColumn === "comments"}
              // onClick={() => setSortColumn("comments")}
              onClick={() => {}}
            >
              Comments
            </HeaderButton>
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>{tableRows}</TableBody>
    </Table>
  );
}

export function AuthorRowDesktop(props: RowProps) {
  const { item, refetchPremium } = props;

  return (
    <TableRow
      key={item.name}
      className={props.selected ? "bg-red-50" : undefined}
      aria-selected={props.selected || undefined}
      data-selected={props.selected || undefined}
      onMouseEnter={props.onSelectRow}
      onDoubleClick={props.onDoubleClick}
    >
      <TableCell className="max-w-[250px] truncate pl-6 min-[1550px]:max-w-[300px] min-[1650px]:max-w-none">
        {item.name}
      </TableCell>
      <TableCell>{item.value}</TableCell>
      <TableCell className="flex justify-end gap-2 p-2">
        <ActionCell
          item={item}
          hasApproveorBanAccess={props.hasApproveorBanAccess}
          mutate={props.mutate}
          refetchPremium={props.refetchPremium}
          setOpenedAuthor={props.setOpenedAuthor}
          selected={props.selected}
          openPremiumModal={props.openPremiumModal}
          authorDisplayName={props.authorDisplayName}
        />
      </TableCell>
    </TableRow>
  );
}
