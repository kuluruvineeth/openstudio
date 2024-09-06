import { truncate } from "../string";

export type CommentForLLM = {
  content: string;
  videoId?: string;
  videoTitle?: string;
  videoDescription?: string;
  videoTranscript?: string;
};

export function stringifyComment(comment: CommentForLLM, maxLength: number) {
  return (
    `Content: ${comment.content}` +
    `${comment.videoTitle ? `\nVideo Title: ${comment.videoTitle}` : ""}` +
    `${comment.videoDescription ? `\nVideo Description: ${comment.videoDescription}` : ""}` +
    `${comment.videoTranscript ? `\nVideo Transcript: ${truncate(comment.videoTranscript, maxLength)}` : ""}`
  );
}
