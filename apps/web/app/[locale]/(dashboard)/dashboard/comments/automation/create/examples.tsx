import { CreateRuleBody } from "@/app/api/user/rules/validation";
import { ActionType, Rule } from "@/types/app";
import {
  CheckCheckIcon,
  GlassesIcon,
  MessageCircleQuestionIcon,
  XCircle,
  XIcon,
} from "lucide-react";

export const RULES_EXAMPLES: {
  title: string;
  icon: React.ReactNode;
  rule: CreateRuleBody;
  automate?: boolean;
}[] = [
  {
    title: "Mark Offensive Comments as Spam",
    icon: <XIcon className="h-4 w-4" />,
    rule: {
      name: "Mark offensive comments as spam",
      instructions:
        "Identify and mark comments containing offensive language or content as spam.",
      actions: [
        {
          type: ActionType.MARK_SPAM,
        },
      ],
      type: Rule.AI,
    },
  },
  {
    title: "Auto-Publish Positive Feedback and Respond",
    icon: <CheckCheckIcon className="h-4 w-4" />,
    rule: {
      name: "Auto-Publish Positive Feedback and Respond",
      instructions:
        "Publish comments that contain positive feedback, such as compliments or expressions of gratitude, and draft a personalized response with emotional emojis.",
      actions: [
        {
          type: ActionType.PUBLISH,
        },
        {
          type: ActionType.REPLY,
          content: {
            value:
              "Draft a response with a personalized message and emotional emojis.",
            ai: true,
          },
        },
      ],
      type: Rule.AI,
      automate: true,
    },
  },
  {
    title: "Reject and Remove Spammy Comments",
    icon: <XCircle className="h-4 w-4" />,
    rule: {
      name: "Reject and remove spammy comments",
      instructions:
        "Reject and remove comments identified as spam or containing irrelevant promotional content.",
      actions: [
        {
          type: ActionType.REJECT,
        },
        {
          type: ActionType.DELETE,
        },
      ],
      type: Rule.AI,
    },
  },
  {
    title: "Auto-Respond to Frequently Asked Questions",
    icon: <MessageCircleQuestionIcon className="h-4 w-4" />,
    rule: {
      name: "Auto-Respond to FAQs",
      instructions:
        "Reply to common questions by providing standard answers based on predefined responses.",
      actions: [
        {
          type: ActionType.REPLY,
          content: {
            value:
              "Thank you for your question! Please check the video description for more details.",
            ai: true,
          },
        },
      ],
      type: Rule.AI,
    },
  },
  {
    title: "Review Potentially Harmful Comments",
    icon: <GlassesIcon className="h-4 w-4" />,
    rule: {
      name: "Review potentially harmful comments",
      instructions:
        "Set the moderation status of comments that may be harmful or controversial to 'heldForReview' for further evaluation.",
      actions: [
        {
          type: ActionType.REVIEW,
        },
      ],
      type: Rule.AI,
    },
  },
];
