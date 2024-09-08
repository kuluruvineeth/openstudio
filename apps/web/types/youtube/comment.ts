export interface CommentItem {
  videoId: string;
  videoThumbnail: string;
  videoTitle: string;
  videoDescription: string;
  commentId: string | null | undefined;
  commentedAt: string | null | undefined;
  commentedText: string | null | undefined;
  authorDisplayName: string | null | undefined;
  authorProfileImageUrl: string | null | undefined;
  category?: {
    category: string;
  };
  plan?: any;
}
