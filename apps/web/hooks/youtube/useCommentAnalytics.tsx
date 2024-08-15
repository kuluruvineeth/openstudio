import { api } from "@/utils/api";
import {
  CommentStatsQuery,
  CommentStatsResponse,
} from "@/app/api/user/stats/comments/validation";

export const useCommentAnalytics = async (query: CommentStatsQuery) => {
  const { data } = await api.get<CommentStatsResponse>("/user/stats/comments", {
    params: {
      ...query,
    },
  });

  return data;
};
