import { type youtube_v3 } from "googleapis";
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
