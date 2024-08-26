"use client";

import { CommentStatsQuery } from "@/app/api/user/stats/comments/validation";
import { CommentsQuery } from "@/app/api/youtube/comments/tinybird/validation";
import { api } from "@/utils/api";

export const useComments = async (
  query?: CommentStatsQuery | CommentsQuery,
) => {
  //TODO: fix type specific
  const { data } = await api.get<any>("/youtube/comments/tinybird", {
    params: {
      ...query,
    },
  });

  return { allComments: data.allComments };
};
