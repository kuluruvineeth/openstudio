"use server";

import { youtube_v3 } from "googleapis";
import { ServerActionResponse } from "../error";
import { getSessionAndYoutubeClient, handleError, isStatusOk } from "./helpers";
import { deleteComment } from "../youtube/comment";
import { deleteTinybirdCommentById } from "@openstudio/tinybird";

async function executeYoutubeAction<T>(
  action: (
    youtube: youtube_v3.Youtube,
    user: { id: string; email: string },
  ) => Promise<any>,
  errorMessage: string,
  onError?: (error: unknown) => boolean,
): Promise<ServerActionResponse<T>> {
  const { youtube, user, error } = await getSessionAndYoutubeClient();
  if (error) return { error };
  if (!youtube) return { error: "Could not load Youtube" };

  try {
    const res = await action(youtube, user);
    return !isStatusOk(res.status) ? handleError(res, errorMessage) : undefined;
  } catch (error) {
    if (onError?.(error)) return;
    return handleError(error, errorMessage);
  }
}

export async function deleteCommentAction(
  commentId: string,
): Promise<ServerActionResponse> {
  await deleteTinybirdCommentById({
    commentId,
    ownerEmail: "vineethreddy3268@gmail.com",
  });
  return executeYoutubeAction(
    async (youtube) =>
      deleteComment({
        youtube,
        commentId,
      }),
    "Deleted!", //TODO: Some issue with error capture here
  );
}
