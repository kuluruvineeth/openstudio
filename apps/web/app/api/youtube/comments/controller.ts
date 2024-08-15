import { auth } from "@/utils/auth";
import { getYoutubeDataClient } from "@/utils/youtube/client";
import { youtube_v3 } from "googleapis";
import Schema$PlaylistItem = youtube_v3.Schema$PlaylistItem;
import Schema$CommentThread = youtube_v3.Schema$CommentThread;
import { Thumbnails, VideoItem } from "@/types/youtube/playlistItems";
import { CommentItem } from "@/types/youtube/comment";

// Fetch all videos from a channel
async function getAllVideosFromPlaylist(
  channelId: string,
  youtubeDataClient: youtube_v3.Youtube,
): Promise<VideoItem[]> {
  try {
    let videos: VideoItem[] = [];
    let nextPageToken = null;

    do {
      const response: any = await youtubeDataClient.playlistItems.list({
        part: ["snippet", "contentDetails", "id", "status"],
        playlistId: channelId, // channelId gives me all videos of including playlists
        // maxResults: 5, //TODO: Need to pass in param this later
        pageToken: nextPageToken !== null ? nextPageToken : undefined,
      });

      const playlistItems: Schema$PlaylistItem[] = response.data.items || [];
      playlistItems.forEach((item) => {
        if (item.snippet && item.status?.privacyStatus !== "private") {
          videos.push({
            id: item.contentDetails?.videoId ?? "N/A",
            title: item.snippet.title ?? "No Title",
            description: item.snippet.description ?? "No Description",
            thumbnails: item.snippet.thumbnails as Thumbnails,
          });
        }
      });
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken); //For now restricting to 5 videos for development purposes
    return videos;
  } catch (error) {
    return [];
  }
}

async function getCommentsByVideoId(
  videoItem: VideoItem,
  youtubeDataClient: youtube_v3.Youtube,
  resultsPerPage: number = 20,
): Promise<CommentItem[]> {
  let videoComments: CommentItem[] = [];
  let nextPageToken = null;
  try {
    do {
      const response: any = await youtubeDataClient.commentThreads.list({
        videoId: videoItem.id,
        part: ["id", "replies", "snippet"],
        pageToken: nextPageToken !== null ? nextPageToken : undefined,
        maxResults: resultsPerPage,
      });

      const commentThreads: Schema$CommentThread[] = response.data.items || [];

      commentThreads.forEach((item) => {
        videoComments.push({
          videoId: videoItem.id,
          videoThumbnail: videoItem.thumbnails.default.url,
          videoTitle: videoItem.title,
          videoDescription: videoItem.description,
          commentId: item.id,
          commentedAt: item.snippet?.topLevelComment?.snippet?.publishedAt,
          commentedText: item.snippet?.topLevelComment?.snippet?.textDisplay,
          authorDisplayName:
            item.snippet?.topLevelComment?.snippet?.authorDisplayName,
          authorProfileImageUrl:
            item.snippet?.topLevelComment?.snippet?.authorProfileImageUrl,
        });
      });
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);
    return videoComments;
  } catch (error) {
    console.error(
      `Error fetching comments for video : ${videoItem.id} : , ${error}`,
    );
    throw error;
  }
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
      console.log(response.data.items[0]);
      const videos = await getAllVideosFromPlaylist(
        response.data.items[0]?.contentDetails?.relatedPlaylists
          ?.uploads as string,
        youtubeDataClient,
      );

      // Use Promise.all to wait for all comments to be fetched
      const commentPromises = videos.map(async (item) => {
        return await getCommentsByVideoId(item, youtubeDataClient, 20);
      });

      // Wait for all promises to resolve and flatten the array
      comments = (await Promise.all(commentPromises)).flat();
    }
    // Sort comments by commentedAt in descending order
    return comments.sort(
      (a, b) =>
        new Date(b.commentedAt!).getTime() - new Date(a.commentedAt!).getTime(),
    );
  } catch (error) {
    console.log(`Error fetching comments : ${error}`);
    throw error;
  }
}
