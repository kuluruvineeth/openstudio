"use client";

import React from "react";
import { RowProps } from "./types";
import { usePostHog } from "posthog-js/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@openstudio/ui/components/ui/card";
import { Badge } from "@openstudio/ui/components/ui/badge";
import { Button } from "@openstudio/ui/components/ui/button";
import { AuthorStatus } from "@/types/app";
import { BadgeCheckIcon, MailMinusIcon, MoreVerticalIcon } from "lucide-react";

export function AuthorMobile({ tableRows }: { tableRows?: React.ReactNode }) {
  return <div className="mx-2 mt-2 grid gap-2">{tableRows}</div>;
}

export function AuthorRowMobile(props: RowProps) {
  const { item, refetchPremium, mutate, hasApproveorBanAccess } = props;

  const posthog = usePostHog();

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="truncate">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2 text-nowrap">
          <Badge variant={"outline"} className="justify-center">
            {item.value} comments
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size={"sm"}
            variant={
              item.status === AuthorStatus.APPROVED ? "green" : "secondary"
            }
            onClick={() => {}}
            disabled={!hasApproveorBanAccess}
          >
            <BadgeCheckIcon className="mr-2 h-4 w-4" />
            Approve
          </Button>

          <Button
            size="sm"
            variant={item.status === AuthorStatus.BANNED ? "red" : "default"}
            disabled={true}
            // asChild={}
          >
            <MailMinusIcon className="mr-2 h-4 w-4" />
            Ban
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => props.setOpenedAuthor(item)}
          >
            <MoreVerticalIcon className="mr-2 size-4" />
            More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
