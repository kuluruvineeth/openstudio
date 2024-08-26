"use client";

import {
  CommentStatsQuery,
  CommentStatsResponse,
} from "@/app/api/user/stats/comments/validation";
import { BarList } from "@/components/charts/BarList";
import { useExpanded } from "@/hooks/useExpanded";
import { useCommentAnalytics } from "@/hooks/youtube/useCommentAnalytics";
import { LoadingContent } from "@openstudio/ui/components/LoadingContent";
import { Card } from "@openstudio/ui/components/Card";
import { Skeleton } from "@openstudio/ui/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Text, Title } from "@tremor/react";
import { Button } from "@openstudio/ui/components/ui/button";
import { useTranslations } from "next-intl";
import { useComments } from "@/hooks/youtube/useComments";
import { CommentsQuery } from "@/app/api/youtube/comments/tinybird/validation";

export function CommentAnalytics(props: {
  query: CommentStatsQuery | CommentsQuery;
  refreshInterval: number;
}) {
  const t = useTranslations("DASHBOARD.COMMENT");
  const { data, isLoading, error } = useQuery<CommentStatsResponse>({
    queryKey: ["commentAnalytics", props.query],
    queryFn: async () => await useCommentAnalytics(props.query),
    refetchInterval: props.refreshInterval,
  });

  const {
    data: commentCategories,
    isLoading: isLoadingCommentCategories,
    error: errorCommentCategories,
  } = useQuery<any>({
    queryKey: ["commentcategoryAnalytics", props.query],
    queryFn: async () => await useComments(props.query),
    refetchInterval: props.refreshInterval,
  });

  const { expandedIndex, extra } = useExpanded();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <LoadingContent
        loading={isLoading}
        error={error}
        loadingComponent={<Skeleton className="h-64 w-full rounded" />}
      >
        {data && (
          <BarList
            title={t("WHO_COMMENTS_MOST.TITLE")}
            col1={t("WHO_COMMENTS_MOST.COL1")}
            col2={t("WHO_COMMENTS_MOST.COL2")}
            data={data.mostActiveCommenters
              .slice(0, expandedIndex == 0 ? undefined : 5)
              .map((d) => ({
                ...d,
                target: "_blank",
              }))}
            extra={extra(0)}
          />
        )}
      </LoadingContent>
      <LoadingContent
        loading={isLoading}
        error={error}
        loadingComponent={<Skeleton className="h-64 w-full rounded" />}
      >
        {data && (
          <BarList
            title={t("MOST_COMMENTED_VIDEO.TITLE")}
            col1={t("MOST_COMMENTED_VIDEO.COL1")}
            col2={t("MOST_COMMENTED_VIDEO.COL2")}
            data={data.mostCommentedVideos
              .slice(0, expandedIndex === 1 ? undefined : 5)
              .map((d) => ({
                ...d,
                target: "_blank",
              }))}
            extra={extra(1)}
          />
        )}
      </LoadingContent>
      <LoadingContent
        loading={isLoadingCommentCategories}
        error={errorCommentCategories}
        loadingComponent={<Skeleton className="h-64 w-full rounded" />}
      >
        {commentCategories && (
          <div className="relative h-full">
            <BarList
              title={t("COMMENTS_CATEGORY.TITLE")}
              col1={t("COMMENTS_CATEGORY.COL1")}
              col2={t("COMMENTS_CATEGORY.COL2")}
              data={commentCategories?.allComments
                .reduce((acc: any, comment: any) => {
                  const category = comment.category
                    ? comment.category.category
                    : "UNCATEGORIZED";
                  const existingCategory = acc.find(
                    (c: any) => c.name === category,
                  );

                  if (existingCategory) {
                    existingCategory.value += 1;
                  } else {
                    acc.push({ name: category, value: 1 });
                  }

                  return acc;
                }, [])
                .slice(0, expandedIndex == 2 ? undefined : 5)
                .map((d: any) => ({
                  ...d,
                  target: "_blank",
                }))}
              extra={extra(2)}
            />
            {/* <div className="absolute inset-0 flex items-center justify-center rounded bg-slate-900/30">
              <div className="m-4 w-full max-w-full">
                <Card>
                  <Title>{t("COMMENTS_CATEGORY.AI_CATEGORIZATION")}</Title>
                  <Text className="mt-1">
                    {t("COMMENTS_CATEGORY.DESCRIPTION")}
                  </Text>
                  <Button className="mt-4 w-full">
                    {t("COMMENTS_CATEGORY.BUTTON_TEXT")}
                  </Button>
                </Card>
              </div>
            </div> */}
          </div>
        )}
      </LoadingContent>
    </div>
  );
}
