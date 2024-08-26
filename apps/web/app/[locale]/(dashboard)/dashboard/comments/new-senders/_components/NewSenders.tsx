"use client";

import { NewSendersResponse } from "@/app/api/user/stats/comments/new-senders/route";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { groupBy } from "lodash";
import { NewSenderRow, Row } from "./NewSenderRow";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { Skeleton } from "@openstudio/ui/components/ui/skeleton";
import { StatsCards } from "@/components/stats/StatsCards";
import { formatStat } from "@/utils/stats";
import { Users2Icon } from "lucide-react";
import { Card } from "@tremor/react";
import { SectionHeader } from "../../authors/_components/SectionHeader";
import { NewSendersTable } from "./NewSendersTable";
import { useMemo, useState } from "react";
import { useExpanded } from "@/hooks/useExpanded";
import { ActionBar } from "../../../_components/ActionBar";
import { subDays } from "date-fns";
import { DateRange } from "@/types/app";
import { AuthorModal } from "../../authors/_components/AuthorModal";
import { useAuthorShortcuts } from "@/hooks/useAuthorShortcuts";
import { ShortcutTooltip } from "../../authors/_components/ShortcutTooltip";

export function NewSenders(props: {}) {
  const now = useMemo(() => new Date(), []);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(now, parseInt("7")),
    to: now,
  });
  const { data, isLoading, error, refetch } = useQuery<NewSendersResponse>({
    queryKey: ["user", dateRange],
    queryFn: async () => {
      const response = await api.get<NewSendersResponse>(
        `/user/stats/comments/new-senders?fromDate=${+new Date(dateRange?.from!).getTime()}&toDate=${+new Date(dateRange?.to!).getTime()}`,
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const groupedSenders = groupBy(
    data?.comments,
    (comment) => comment.authorDisplayName,
  );
  const newSenders = Object.entries(groupedSenders);

  const { expanded, extraWithoutIndex } = useExpanded();
  const [selectedRow, setSelectedRow] = useState<Row | undefined>();
  const [openedAuthor, setOpenedAuthor] = useState<Row>();

  const rows: (Row & {
    firstComment: {
      commentId: string | undefined;
      from: string | undefined;
      text: string | undefined;
      timestamp: number | undefined;
    };
    numberOfComments: number;
  })[] = newSenders.map(([_, comments]) => {
    const firstComment = comments[0];
    return {
      name: firstComment?.authorDisplayName,
      firstComment: {
        commentId: firstComment?.commentId,
        from: firstComment?.authorDisplayName,
        text: firstComment?.commentedText,
        timestamp: firstComment?.commentedAt,
      },
      numberOfComments: comments.length,
    };
  });

  useAuthorShortcuts({
    authors: rows,
    selectedRow,
    setOpenedAuthor,
    setSelectedRow,
  });

  return (
    <>
      <div className="sticky -top-7 z-10 justify-end space-x-1 border-b bg-background px-4 py-2 shadow sm:flex mb-4">
        <div className="space-y-1 sm:flex sm:space-x-1 sm:space-y-0">
          <ActionBar dateRange={dateRange} onDateRangeUpdate={setDateRange} />
        </div>
      </div>
      <LoadingContent
        loading={isLoading}
        error={error}
        loadingComponent={<Skeleton className="h-24 rounded" />}
      >
        <StatsCards
          stats={[
            {
              name: "New Senders",
              value: formatStat(newSenders.length),
              subValue: "senders",
              icon: <Users2Icon className="h-4 w-4" />,
            },
          ]}
        />
      </LoadingContent>

      <Card className="mt-4 p-0">
        <div className="items-center justify-between px-6 pt-6 md:flex">
          <SectionHeader
            title="Who are the first time senders?"
            description="A list of comments that you received from the first time commenters."
          />
          <div className="ml-4 mt-3 flex justify-end space-x-2 md:mt-0">
            <div className="hidden md:block">
              <ShortcutTooltip isAuthorPage={false} />
            </div>
          </div>
        </div>

        <LoadingContent
          loading={isLoading}
          error={error}
          loadingComponent={<Skeleton className="m-4 h-screen rounded" />}
        >
          {newSenders && (
            <NewSendersTable
              //   sortColumn={}
              //   setSortColumn={}
              tableRows={rows.slice(0, expanded ? undefined : 5).map((item) => {
                return (
                  <NewSenderRow
                    key={item.name}
                    item={item}
                    firstComment={item.firstComment}
                    numberOfComments={item.numberOfComments}
                    setOpenedAuthor={setOpenedAuthor}
                    selected={selectedRow?.name === item.name}
                    onSelectRow={() => {
                      setSelectedRow(item);
                    }}
                  />
                );
              })}
            />
          )}
          <div className="mt-2 px-6 pb-6">{extraWithoutIndex()}</div>
        </LoadingContent>
      </Card>
      <AuthorModal
        dateRange={dateRange!}
        author={openedAuthor}
        onClose={() => setOpenedAuthor(undefined)}
      />
    </>
  );
}
