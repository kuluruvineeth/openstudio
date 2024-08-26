"use client";

import { Row } from "../../new-senders/_components/NewSenderRow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@openstudio/ui/components/ui/dialog";
import { AuthorCommentsChart } from "./AuthorCommentsChart";
import { DateRange } from "@/types/app";
import { SectionHeader } from "@openstudio/ui/components/Typography";
import { AuthorComments } from "./AuthorComments";

export function AuthorModal(props: {
  dateRange: DateRange;
  author?: Pick<Row, "name">;
  onClose: (isOpen: boolean) => void;
  refreshInterval?: number;
}) {
  const { author, onClose, refreshInterval, dateRange } = props;

  return (
    <Dialog open={!!author} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-x-scroll overflow-y-scroll lg:min-w-[880px] xl:min-w-[1280px]">
        {author && (
          <>
            <DialogHeader>
              <DialogTitle>Stats for {author.name}</DialogTitle>
            </DialogHeader>
            {/* TODO: to add actions and more options here */}
            <div className="flex space-x-2"></div>

            <div>
              <AuthorCommentsChart
                authorDisplayName={author.name!}
                dateRange={dateRange}
              />
            </div>

            <div className="lg:max-w-[820px] xl:max-w-[1220px]">
              <SectionHeader>Comments</SectionHeader>
              <AuthorComments
                dateRange={dateRange}
                authorDisplayName={author.name!}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
