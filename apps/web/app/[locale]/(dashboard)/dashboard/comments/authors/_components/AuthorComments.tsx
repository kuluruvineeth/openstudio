"use client";

import { AuthorCommentsQuery } from "@/app/api/user/stats/comments/author-comments/route";
import { DateRange } from "@/types/app";
import { api } from "@/utils/api";
import { getDateRangeParams } from "@/utils/date";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { useQuery } from "@tanstack/react-query";
import { CommentList } from "../../_components/CommentList";

export function AuthorComments(props: {
  authorDisplayName: string;
  dateRange?: DateRange | undefined;
  refreshInterval?: number;
}) {
  const params: AuthorCommentsQuery = {
    ...props,
    ...getDateRangeParams(props.dateRange),
  };

  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["authorComments", params],
    queryFn: async () => {
      const response = await api.get<any>(
        `/youtube/comments/tinybird/?${new URLSearchParams(params as any)}`,
      );
      return response.data;
    },
    refetchInterval: props.refreshInterval,
  });

  return (
    <LoadingContent loading={isLoading} error={error}>
      {data && (
        <CommentList comments={data.allComments} hideActionBarWhenEmpty />
      )}
    </LoadingContent>
  );
}
