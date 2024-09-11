import { ActionType, ActionTypeType, ExecutedAction } from "@/types/app";
import { PartialRecord } from "../types";
import { youtube_v3 } from "googleapis";
import {
  deleteComment,
  markSpam,
  replyToComment,
  setModerationStatus,
} from "../youtube/comment";

export type CommentForAction = {
  commentId: string;
  content: string;
};

export type ActionItem = {
  type: ExecutedAction["type"];
  content?: ExecutedAction["content"];
};

type ActionFunction<T extends Omit<ActionItem, "type">> = (
  youtube: youtube_v3.Youtube,
  comment: CommentForAction,
  args: T,
  userEmail: string,
) => Promise<any>;

export type Properties = PartialRecord<
  "content",
  {
    type: string;
    description: string;
  }
>;

type ActionFunctionDef = {
  name: string;
  description: string;
  parameters:
    | {
        type: string;
        properties: Properties;
        required: string[];
      }
    | { type: string; properties?: undefined; required: string[] };
  action: ActionTypeType | null;
};

const MARK_SPAM: ActionFunctionDef = {
  name: "mark_spam",
  description: "Mark as spam.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
  action: ActionType.MARK_SPAM,
};

const DELETE: ActionFunctionDef = {
  name: "delete",
  description: "Delete a comment.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
  action: ActionType.DELETE,
};

const REJECT: ActionFunctionDef = {
  name: "reject",
  description: "Reject a comment.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
  action: ActionType.REJECT,
};

const REVIEW: ActionFunctionDef = {
  name: "review",
  description: "Review a comment",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
  action: ActionType.REVIEW,
};

const PUBLISH: ActionFunctionDef = {
  name: "publish",
  description: "Publish a comment",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
  action: ActionType.PUBLISH,
};

const REPLY: ActionFunctionDef = {
  name: "reply",
  description: "Reply to comment.",
  parameters: {
    type: "object",
    properties: {
      content: {
        type: "string",
        description: "The content to reply to the comment.",
      },
    },
    required: ["content"],
  },
  action: ActionType.REPLY,
};

export const actionFunctionDefs: Record<ActionTypeType, ActionFunctionDef> = {
  [ActionType.DELETE]: DELETE,
  [ActionType.MARK_SPAM]: MARK_SPAM,
  [ActionType.PUBLISH]: PUBLISH,
  [ActionType.REJECT]: REJECT,
  [ActionType.REPLY]: REPLY,
  [ActionType.REVIEW]: REVIEW,
};
const delete_comment: ActionFunction<any> = async (
  youtube: youtube_v3.Youtube,
  comment: CommentForAction,
) => {
  return await deleteComment({ youtube, commentId: comment.commentId });
};

const review_comment: ActionFunction<any> = async (
  youtube: youtube_v3.Youtube,
  comment: CommentForAction,
) => {
  return await setModerationStatus({
    youtube,
    commentId: comment.commentId,
    moderationStatus: "heldForReview",
  });
};

const reject_comment: ActionFunction<any> = async (
  youtube: youtube_v3.Youtube,
  comment: CommentForAction,
) => {
  return await setModerationStatus({
    youtube,
    commentId: comment.commentId,
    moderationStatus: "rejected",
  });
};

const publish_comment: ActionFunction<any> = async (
  youtube: youtube_v3.Youtube,
  comment: CommentForAction,
) => {
  return await setModerationStatus({
    youtube,
    commentId: comment.commentId,
    moderationStatus: "published",
  });
};

const reply_to_comment: ActionFunction<any> = async (
  youtube: youtube_v3.Youtube,
  comment: CommentForAction,
  args: {
    content: string;
  },
) => {
  return await replyToComment({
    youtube,
    commentId: comment.commentId,
    content: args.content,
  });
};

const mark_spam: ActionFunction<any> = async (
  youtube: youtube_v3.Youtube,
  comment: CommentForAction,
) => {
  return await markSpam({ youtube, commentId: comment.commentId });
};

