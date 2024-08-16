import { getComments } from "@/app/api/youtube/comments/controller";
import { publishComment, TinybirdComment } from "@openstudio/tinybird";
import { CommentItem } from "@/types/youtube/comment";
import { sleep } from "@/utils/sleep";

export type LoadTinybirdCommentsResponse = Awaited<
  ReturnType<typeof loadTinybirdComments>
>;

export async function loadTinybirdComments(options: { ownerEmail: string }) {
  const { ownerEmail } = options;

  let res;
  try {
    res = await saveBatch({
      ownerEmail,
    });
  } catch (error) {
    console.log(`Error while loading comments data into tinybird`);
    await sleep(10_000);
    res = await saveBatch({
      ownerEmail,
    });
  }

  return res;
}

async function saveBatch(options: { ownerEmail: string }) {
  const { ownerEmail } = options;

  const comments: CommentItem[] = await getComments();

  const commentsToPublish: (TinybirdComment | any)[] =
    comments
      .map((item) => {
        if (!item.commentId) return;

        const tinybirdComment: TinybirdComment = {
          ownerEmail,
          commentId: item.commentId,
          videoTitle: item.videoTitle,
          videoThumbnail: item.videoThumbnail,
          videoDescription: item.videoDescription,
          commentedText: item.commentedText!,
          authorDisplayName: item.authorDisplayName!,
          authorProfileImageUrl: item.authorProfileImageUrl!,
          videoId: item.videoId,
          timestamp: +new Date(item.commentedAt!),
        };

        if (!tinybirdComment.timestamp) {
          console.error(
            "No timestamp for Comment",
            tinybirdComment.ownerEmail,
            tinybirdComment.commentId,
            item.commentedAt,
          );
          return null;
        }

        return tinybirdComment;
      })
      .filter((comment): comment is TinybirdComment => comment !== null) || [];

  if (commentsToPublish.length > 0) {
    await publishComment(commentsToPublish);
  }

  return comments;
}
