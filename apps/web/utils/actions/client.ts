"use client";

import { handleActionResult } from "../server-action";
import { deleteCommentAction } from "./comment";

export async function onDeleteComment(commentId: string) {
  const result = await deleteCommentAction(commentId);
  handleActionResult(result, "Comment deleted!");
}
