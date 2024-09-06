import { type youtube_v3 } from "googleapis";

export async function markSpam(options: {
  youtube: youtube_v3.Youtube;
  commentId: string;
}) {
  const { youtube, commentId } = options;

  await youtube.comments.markAsSpam({
    id: [commentId],
  });
}

export async function setModerationStatus(options: {
  youtube: youtube_v3.Youtube;
  commentId: string;
  moderationStatus: "heldForReview" | "rejected" | "published";
}) {
  const { youtube, commentId, moderationStatus } = options;

  await youtube.comments.setModerationStatus({
    id: [commentId],
    moderationStatus,
  });
}

export async function banAuthor(options: {
  youtube: youtube_v3.Youtube;
  commentId: string;
}) {
  const { youtube, commentId } = options;

  await youtube.comments.setModerationStatus({
    id: [commentId],
    banAuthor: true,
    // moderationStatus: "rejected",
  });
}

export async function deleteComment(options: {
  youtube: youtube_v3.Youtube;
  commentId: string;
}) {
  const { youtube, commentId } = options;

  try {
    // Attempt to delete the comment
    //TODO: There is an issue with this from youtube api itself
    // await youtube.comments.delete({
    //   id: commentId,
    // });

    //TODO: Remove this work around later
    await youtube.comments.setModerationStatus({
      id: [commentId],
      moderationStatus: "rejected",
    });
  } catch (error: any) {
    // Handle errors
    console.error("Error deleting comment:", error.message);
    throw error; // Re-throw the error to propagate it further if needed
  }
}

export async function replyToComment(options: {
  youtube: youtube_v3.Youtube;
  commentId: string;
  content: string;
}) {
  const { youtube, commentId, content } = options;

  await youtube.comments.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        parentId: commentId,
        textOriginal: content,
      },
    },
  });
}

export async function getComment(
  commentId: string,
  youtube: youtube_v3.Youtube,
) {
  const comment = await youtube.comments.list({
    id: [commentId],
    part: ["snippet"],
  });

  return comment.data;
}
