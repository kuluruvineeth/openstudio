"use client";

import { api } from "@/utils/api";

export const useComments = async () => {
  //TODO: fix type specific
  const { data } = await api.get<any>("/youtube/comments/tinybird", {});

  return { allComments: data.allComments };
};
