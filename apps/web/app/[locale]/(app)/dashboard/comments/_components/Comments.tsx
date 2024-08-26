"use client";

import { CommentItem } from "@/types/youtube/comment";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { List } from "./List";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useComments } from "@/hooks/youtube/useComments";
import { useCallback, useEffect } from "react";
import { useCommentStore } from "@/store/comment";

export default function Comments() {
  const queryClient = useQueryClient();
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    error: errorComments,
  } = useQuery<any>({
    queryKey: ["comments"],
    queryFn: async () => await useComments(),
    refetchOnWindowFocus: false,
    // refetchInterval: 1_000,
    staleTime: 1000,
  });

  const refetch = useCallback(
    (removedCommentIds?: string[]) => {
      if (removedCommentIds && removedCommentIds.length > 0) {
        // Modify the cache to remove the specified comments
        queryClient.setQueryData<any>(["comments"], (currentData: any) => {
          const comments =
            currentData?.allComments.filter(
              (c: CommentItem) => !removedCommentIds.includes(c.commentId!),
            ) || [];
          return { allComments: comments };
        });
      } else {
        // Invalidate the query to refetch all data
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    },
    [queryClient],
  );

  const setRetchCommentList = useCommentStore(
    (state) => state.setRefetchCommentList,
  );

  useEffect(() => {
    setRetchCommentList(refetch);
  }, [refetch, setRetchCommentList]);
  return (
    <LoadingContent loading={isLoadingComments} error={errorComments}>
      {commentsData && (
        <List
          comments={(commentsData.allComments as any) || []}
          refetch={refetch}
        />
      )}
    </LoadingContent>
  );
}
