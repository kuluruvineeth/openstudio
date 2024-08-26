"use client";

import {
  AuthorCommentsQuery,
  AuthorCommentsResponse,
} from "@/app/api/user/stats/comments/author-comments/route";
import { DateRange } from "@/types/app";
import { api } from "@/utils/api";
import { getDateRangeParams } from "@/utils/date";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { useQuery } from "@tanstack/react-query";
import { BarChart } from "@tremor/react";

export function AuthorCommentsChart(props: {
  authorDisplayName: string;
  dateRange?: DateRange | undefined;
  refreshInterval?: number;
}) {
  const params: AuthorCommentsQuery = {
    ...props,
    ...getDateRangeParams(props.dateRange),
  };

  const { data, isLoading, error } = useQuery<AuthorCommentsResponse>({
    queryKey: ["authorCommentsCounts", params],
    queryFn: async () => {
      const response = await api.get<AuthorCommentsResponse>(
        `/user/stats/comments/author-comments/?${new URLSearchParams(params as any)}`,
      );
      return response.data;
    },
    refetchInterval: props.refreshInterval,
  });

  return (
    <LoadingContent loading={isLoading} error={error}>
      {data && (
        <BarChart
          className="h-72"
          data={data.result}
          index="startOfPeriod"
          categories={["Comments"]}
          colors={["red"]}
        />
      )}
    </LoadingContent>
  );
}
