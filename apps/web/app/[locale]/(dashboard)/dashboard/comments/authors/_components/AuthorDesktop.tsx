"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@openstudio/ui/components/ui/table";
import React from "react";
import { HeaderButton } from "./HeaderButton";
import { RowProps } from "./types";
import { ActionCell } from "./ActionCell";
import { Checkbox } from "@openstudio/ui/components/Checkbox";

export function AuthorDesktop(props: {
  tableRows?: React.ReactNode;
  sortColumn?: "comments";
  setSortColumn?: (sortColumn: "comments") => void;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
}) {
  const { tableRows, sortColumn, setSortColumn } = props;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pr-0">
            <Checkbox
              checked={props.isAllSelected}
              onChange={props.onToggleSelectAll}
            />
          </TableHead>
          <TableHead className="pr-0">
            <span className="text-sm font-medium">From</span>
          </TableHead>
          <TableHead>
            <HeaderButton
              sorted={sortColumn === "comments"}
              // onClick={() => setSortColumn("comments")}
              onClick={() => {}}
            >
              Comments
            </HeaderButton>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{tableRows}</TableBody>
    </Table>
  );
}

export function AuthorRowDesktop(props: RowProps) {
  const { item, refetchPremium, checked, onToggleSelect } = props;

  return (
    <TableRow
      key={item.name}
      className={props.selected ? "bg-red-50" : undefined}
      aria-selected={props.selected || undefined}
      data-selected={props.selected || undefined}
      onMouseEnter={props.onSelectRow}
      onDoubleClick={props.onDoubleClick}
    >
      <TableCell className="pr-0">
        <Checkbox
          checked={checked}
          onChange={() => onToggleSelect?.(item.name)}
        />
      </TableCell>
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
