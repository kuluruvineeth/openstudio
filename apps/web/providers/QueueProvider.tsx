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
function updateQueueStorage(
  name: QueueNameLocalStorage,
  commentIds: string[],
  state: "pending" | "complete",
) {
  const currentStateString = localStorage.getItem(name);

  if (currentStateString) {
    const currentState: string[] = JSON.parse(currentStateString);
    const updatedState: string[] =
      state === "pending"
        ? Array.from(new Set([...currentState, ...commentIds]))
        : currentState.filter((id: string) => !commentIds.includes(id));
    localStorage.setItem(name, JSON.stringify(updatedState));
  } else {
    return localStorage.setItem(name, JSON.stringify(commentIds));
  }
}

function getPendingComments(name: QueueNameLocalStorage) {
  const currentStateString = localStorage.getItem(name);
  if (!currentStateString) return;

  const currentState = JSON.parse(currentStateString);
  if (!currentState.length) return;

  return currentState;
}
