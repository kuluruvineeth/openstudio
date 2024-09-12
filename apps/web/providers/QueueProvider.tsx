"use client";

import { runRulesAction } from "@/actions/AiRule";
import { useAiQueueStore } from "@/store/queue";
import { CommentItem } from "@/types/youtube/comment";
import { deleteCommentAction } from "@/utils/actions/comment";
import PQueue from "p-queue";
import React, { useEffect } from "react";

const queue = new PQueue({ concurrency: 3 });

type QueueNameLocalStorage = "deleteQueue" | "aiRuleQueue";

export const deleteComments = async (
  commentIds: string[],
  refetch: () => void,
) => {
  queue.addAll(
    commentIds.map((commentId) => async () => {
      await deleteCommentAction(commentId);
      refetch();
    }),
  );
};
