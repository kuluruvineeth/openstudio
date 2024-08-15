import { getComments } from "@/app/api/youtube/comments/controller";
import { youtube_v3 } from "googleapis";
import {
  getLatestOrOldestComment,
  publishComment,
  TinybirdComment,
} from "@openstudio/tinybird";
import { CommentItem } from "@/types/youtube/comment";
import { LoadTinybirdCommentsBody } from "./validation";
import { sleep } from "@/utils/sleep";

//TODO: Lot to work on the logic, it is dumbest solution
export async function loadTinybirdComments(
  options: {
    ownerEmail: string;
    youtubeDataClient?: youtube_v3.Youtube;
    accessToken?: string;
  },
  body?: LoadTinybirdCommentsBody,
) {
  const { ownerEmail, youtubeDataClient, accessToken } = options;

  const [oldestCommentSaved, newestCommentSaved] = await Promise.all([
    getLatestOrOldestComment({
      ownerEmail: options.ownerEmail,
      direction: "oldest",
    }),
    getLatestOrOldestComment({
      ownerEmail: options.ownerEmail,
      direction: "newest",
    }),
  ]);

  let res;
  try {
    res = await saveBatch({
      ownerEmail,
      youtubeDataClient,
      accessToken,
      oldestComment: oldestCommentSaved.data[0]?.timestamp ?? undefined,
      newestComment: newestCommentSaved.data[0]?.timestamp ?? undefined,
    });
  } catch (error) {
    console.log(`Error while loading comments data into tinybird`);
    await sleep(10_000);
    res = await saveBatch({
      ownerEmail,
      youtubeDataClient,
      accessToken,
      oldestComment: oldestCommentSaved.data[0]?.timestamp ?? undefined,
      newestComment: newestCommentSaved.data[0]?.timestamp ?? undefined,
    });
  }

  return res;
}

async function saveBatch(
  options: {
    ownerEmail: string;
    youtubeDataClient?: youtube_v3.Youtube;
    accessToken?: string;
    nextPageToken?: string;
    oldestComment?: number;
    newestComment?: number;
  },
  //   } & (
  //     | { before: number; after: undefined }
  //     | { before: undefined; after: number }
  //   ),
) {
  const {
    ownerEmail,
    youtubeDataClient,
    accessToken,
    nextPageToken,
    // before,
    // after,
    oldestComment,
    newestComment,
  } = options;

  const comments: CommentItem[] = await getComments();

  // Filter comments before oldestComment
  const commentsBeforeOldest = comments.filter((comment) => {
    const commentTimestamp = new Date(comment.commentedAt!).getTime();
    return oldestComment !== undefined && commentTimestamp < oldestComment;
  });

  //Filter comments after newestComment
  const commentsAfterNewest = comments.filter((comment) => {
    const commentTimestamp = new Date(comment.commentedAt!).getTime();
    return newestComment !== undefined && commentTimestamp > newestComment;
  });

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
    // Publish in batches of 200
    for (let i = 0; i < commentsToPublish.length; i += 200) {
      const batch = commentsToPublish.slice(
        i,
        Math.min(i + 200, commentsToPublish.length),
      );
      await publishComment(batch);
      await sleep(20_000);
    }
  }

  // await publishComment(commentsToPublish);

  return comments;
}
