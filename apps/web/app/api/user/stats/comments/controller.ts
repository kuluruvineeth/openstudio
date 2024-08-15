import {
  CommentStatsQuery,
  commentStatsResponse,
  CommentStatsResponse,
} from "./validation";
import {
  getMostCommentedVideo,
  getWhoCommentedMost,
} from "@openstudio/tinybird";

export async function getCommentsTinybird(
  options: CommentStatsQuery & {
    ownerEmail: string;
  },
): Promise<CommentStatsResponse> {
  const [whoCommentedMost, mostCommentedVideo] = await Promise.all([
    getWhoCommentedMost(options),
    getMostCommentedVideo(options),
  ]);

  const result = {
    mostActiveCommenters: whoCommentedMost.data.map((d) => ({
      name: d.authorDisplayName,
      value: d.count,
    })),
    mostCommentedVideos: mostCommentedVideo.data.map((d) => ({
      id: d.videoId,
      name: d.videoTitle,
      value: d.count,
    })),
  };

  // Validate the result against the schema
  commentStatsResponse.parse(result);

  return result;
}
