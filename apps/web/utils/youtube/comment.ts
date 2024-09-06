import { type youtube_v3 } from "googleapis";

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
