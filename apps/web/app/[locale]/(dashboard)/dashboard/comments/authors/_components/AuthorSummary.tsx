"use client";

import { AuthorStatus, DateRange } from "@/types/app";
import { api } from "@/utils/api";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@openstudio/ui/components/ui/skeleton";
import { StatsCards } from "@/components/stats/StatsCards";
import { formatStat } from "@/utils/stats";
import { BadgeCheckIcon, UserRoundMinusIcon } from "lucide-react";

export function AuthorSummary(props: {
  dateRange?: DateRange | undefined;
  refreshInterval?: number;
}) {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["authorSummary"],
    queryFn: async () => {
      const response = await api.get<any>(
        `/user/stats/comments/authors/summary`,
      );
      return response.data;
    },
    refetchInterval: props.refreshInterval,
  });

  return (
    <LoadingContent
      loading={isLoading}
      error={error}
      loadingComponent={<Skeleton className="h-24 rounded" />}
    >
      <StatsCards
        stats={[
          {
            name: "Rejected",
            value: formatStat(data?.result?.[AuthorStatus.BANNED] || 0),
            subValue: "authors",
            icon: <UserRoundMinusIcon className="h-4 w-4" />,
          },
          {
            name: "Approved",
            value: formatStat(data?.result?.[AuthorStatus.APPROVED] || 0),
            subValue: "authors",
            icon: <BadgeCheckIcon className="h-4 w-4" />,
          },
        ]}
      />
    </LoadingContent>
  );
}
