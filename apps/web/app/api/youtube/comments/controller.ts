import { auth } from "@/utils/auth";
import { getYoutubeDataClient } from "@/utils/youtube/client";
import { youtube_v3 } from "googleapis";
import { VideoItem } from "@/types/youtube/playlistItems";
import { CommentItem } from "@/types/youtube/comment";
import { getCommentNextPageToken } from "@/actions/GetCommentNextPageToken";
import { storeCommentNextPageToken } from "@/actions/StoreCommentNextPageToken";
import { getLatestOrOldestComment } from "@openstudio/tinybird";

async function processCommentsWithVideoDetails(
  commentThreads: youtube_v3.Schema$CommentThread[],
  youtubeDataClient: youtube_v3.Youtube,
): Promise<CommentItem[]> {
  const videoIds = extractVideoIds(commentThreads);
  const videoDetails = await getVideoDetailsBulk(videoIds, youtubeDataClient);
  const videoDetailsMap = new Map(
    videoDetails.map((video) => [video.id, video]),
  );

  return commentThreads.map((item) => {
    const videoId = item.snippet?.topLevelComment?.snippet?.videoId;
    const video = videoId ? videoDetailsMap.get(videoId) : undefined;
    return {
      videoId: videoId ?? "N/A",
      videoThumbnail: video?.thumbnails?.default?.url ?? "N/A",
      videoTitle: video?.title ?? "No Title",
      videoDescription: video?.description ?? "No Description",
      commentId: item.id,
      commentedAt: item.snippet?.topLevelComment?.snippet?.publishedAt,
      commentedText: item.snippet?.topLevelComment?.snippet?.textDisplay,
      authorDisplayName:
        item.snippet?.topLevelComment?.snippet?.authorDisplayName,
      authorProfileImageUrl:
        item.snippet?.topLevelComment?.snippet?.authorProfileImageUrl,
    };
  });
}

function extractVideoIds(
  commentThreads: youtube_v3.Schema$CommentThread[],
): string[] {
  return [
    ...new Set(
      commentThreads
        .map((thread) => thread.snippet?.topLevelComment?.snippet?.videoId)
        .filter(Boolean),
    ),
  ] as string[];
}

async function fetchLatestComments(
  ownerEmail: string,
  youtubeDataClient: youtube_v3.Youtube,
  channelId: string,
): Promise<{ comments: CommentItem[]; nextPageToken?: string }> {
  const latestCommentsResponse = await youtubeDataClient.commentThreads.list({
    allThreadsRelatedToChannelId: channelId,
    part: ["id", "replies", "snippet"],
    maxResults: 100,
  });

  const [newestCommentSaved] = await Promise.all([
    getLatestOrOldestComment({
      ownerEmail: ownerEmail,
      direction: "newest",
    }),
  ]);

  const latestComments = latestCommentsResponse.data.items || [];

  // Filter out comments that are older than or equal to the latest known timestamp
  const filteredComments = newestCommentSaved.data[0]?.timestamp
    ? latestComments.filter((comment: any) => {
        const commentTimestamp = new Date(
          comment.snippet?.topLevelComment?.snippet?.publishedAt,
        ).getTime();
        return commentTimestamp > newestCommentSaved.data[0]?.timestamp!;
      })
    : latestComments;

  let comments: CommentItem[] = [];
  if (filteredComments.length > 0) {
    comments = await processCommentsWithVideoDetails(
      filteredComments,
      youtubeDataClient,
    );
  }

  return {
    comments,
    nextPageToken: latestCommentsResponse.data.nextPageToken ?? undefined,
  };
}

// Helper function to fetch video details in bulk
async function getVideoDetailsBulk(
  videoIds: string[],
  youtubeDataClient: youtube_v3.Youtube,
): Promise<VideoItem[]> {
  const response: any = await youtubeDataClient.videos.list({
    part: ["snippet"],
    id: videoIds,
  });
  return (
    response.data.items?.map((video: any) => ({
      id: video.id!,
      title: video.snippet?.title ?? "No Title",
      description: video.snippet?.description ?? "No Description",
      thumbnails: video.snippet?.thumbnails ?? {},
    })) || []
  );
}

// Helper function to fetch comments with video details
async function fetchCommentsWithVideoDetails(
  youtubeDataClient: youtube_v3.Youtube,
  channelId: string,
  pageToken?: string,
): Promise<{ comments: CommentItem[]; nextPageToken?: string }> {
  const response = await youtubeDataClient.commentThreads.list({
    allThreadsRelatedToChannelId: channelId,
    part: ["id", "replies", "snippet"],
    pageToken: pageToken ?? undefined,
    maxResults: 100, // Adjust as needed
  });

  const commentThreads = response.data.items || [];

  const comments = await processCommentsWithVideoDetails(
    commentThreads,
    youtubeDataClient,
  );

  return {
    comments,
    nextPageToken: response.data.nextPageToken ?? undefined,
  };
}

export async function getComments(): Promise<CommentItem[]> {
  const session = await auth();

  if (!session) {
    throw new Error("Not logged in");
  }

  const youtubeDataClient = getYoutubeDataClient(session);

  let comments: CommentItem[] = [];
  try {
    const response = await youtubeDataClient.channels.list({
      part: ["contentDetails"],
      mine: true,
    });
    if (response.status === 200 && response.data.items) {
      const channelId = response.data.items[0]?.id as string;
      // Retrieve the stored page token if available
      const pageInfo = await getCommentNextPageToken(channelId);

      const latestCommentsResponse = await fetchLatestComments(
        session.ownerEmail,
        youtubeDataClient,
        channelId,
      );
      const latestComments = latestCommentsResponse.comments;
      if (pageInfo && pageInfo?.noMoreComments) return latestComments;
      let paginatedComments: CommentItem[] = [];
      let nextPageToken = latestCommentsResponse.nextPageToken;
      if (pageInfo?.nextPageToken) {
        const { comments, nextPageToken: paginatedToken } =
          await fetchCommentsWithVideoDetails(
            youtubeDataClient,
            channelId,
            pageInfo?.nextPageToken,
          );
        paginatedComments = comments;
        nextPageToken = paginatedToken;
      }

      comments = latestComments.concat(paginatedComments);

      // Update the stored page token
      if (nextPageToken) {
        await storeCommentNextPageToken(channelId, nextPageToken);
      } else {
        //TODO: Clear the stored token if there are no more pages
        await storeCommentNextPageToken(channelId, null, true);
      }
    }
    return comments;
  } catch (error) {
    console.log(`Error fetching comments : ${error}`);
    throw error;
  }
}
