"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import React from "react";
import { HeaderButton } from "../../authors/_components/HeaderButton";
import { Row } from "./NewSenderRow";

export function NewSendersTable<T extends Row>(props: {
  tableRows?: React.ReactNode;
  sortColumn?: "comment" | "date" | "comments";
  setSortColumn?: (sortColumn: "comment" | "date" | "comments") => void;
}) {
  const { tableRows, sortColumn, setSortColumn } = props;

  return (
    <Table className="mt-4">
      <TableHead>
        <TableRow>
          <TableHeaderCell className="pl-6">
            <span className="text-sm font-medium">From</span>
          </TableHeaderCell>
          <TableHeaderCell>
            <HeaderButton sorted={sortColumn === "comment"} onClick={() => {}}>
              Comment
            </HeaderButton>
          </TableHeaderCell>
          <TableHeaderCell>
            <HeaderButton sorted={sortColumn === "date"} onClick={() => {}}>
              Date
            </HeaderButton>
          </TableHeaderCell>
          <TableHeaderCell>
            <HeaderButton sorted={sortColumn === "comments"} onClick={() => {}}>
              Comments
            </HeaderButton>
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>{tableRows}</TableBody>
    </Table>
  );
}
