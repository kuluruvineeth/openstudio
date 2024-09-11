import { UserAIFields } from "@/utils/llms/types";
import { aiResponseSchema, CategorizeCommentBody } from "./validation";
import { chatCompletionObject } from "@/utils/llms";
import { getCategory, saveCategory } from "@/utils/redis/category";
import { getVideoTranscript } from "../../youtube/transcripts/controller";

async function aiCategorize(
  body: CategorizeCommentBody & UserAIFields,
  userEmail: string,
  videoTranscriptEnabled?: boolean,
  videoTranscript?: string,
) {
  const system = "You are an assistant that helps categorize youtube comments.";
  const prompt = `Categorize this YouTube comment.
  Like if it is friendly, supportive into Positive and so on.
  Return a JSON object with a "category" and "requiresMoreInformation" field.
  These are the categories to choose from, with an explanation of each one:
    - POSITIVE: Positive sentiment.
    - NEGATIVE: Negative sentiment.
    - NEUTRAL: Neutral sentiment.
    - SPAM: Comment contains irrelevant or promotional content.
    - OFFENSIVE: Comment is offensive or inappropriate.
    - INFORMATIVE: Comment provides useful information.
    - ENGAGEMENT: Comment encourages interaction or discussion.
    - CONSTRUCTIVE_CRITICISM: Comment offers constructive criticism.
    - QUESTION: Comment asks a question.
    - APPRECIATION: Comment expresses appreciation or gratitude.
    - COLLABORATION_OPPORTUNITY: Comment suggests collaboration opportunity.
    - SUPPORT: Comment offers support or encouragement.
    - HUMOROUS: Comment is intended to be humorous.
    - EDUCATIONAL: Comment provides educational content.
    - PERSONAL_STORY: Comment shares a personal story.
    - OTHER: comment which does not fit into above categories.

    We only provide you with a snippet of the comment. If you need more information, set "requiresMoreInformation" to true and we will provide you with the full video transcript to better categorize it.

    An example response would be:
    {
      "category": "POSITIVE",
      "requiresMoreInformation": false
    }

    The Comment:

    ###
    ${videoTranscriptEnabled ? `Video Transcript: ${videoTranscript}` : ""}
    Content: ${body.commentedText}
    ###
    `;

  const response = await chatCompletionObject({
    userAi: body,
    system,
    prompt,
    schema: aiResponseSchema,
    userEmail,
    usageLabel: "Categorize",
  });

  return response;
}

export async function categorize(
  body: CategorizeCommentBody & UserAIFields,
  options: { email: string },
): Promise<{ category: string } | undefined> {
  //1. check redis cache
  const existingCategory = await getCategory({
    email: options.email,
    commentId: body.commentId,
  });

  if (existingCategory) return existingCategory;

  //2. ai categorize
  let category = await aiCategorize(body, options.email, false);
  if (category.object.requiresMoreInformation) {
    console.log(
      "Not enough information, providing video transcript and trying again",
    );
    const videoTranscript = await getVideoTranscript({ videoId: body.videoId });
    category = await aiCategorize(
      body,
      options.email,
      true,
      videoTranscript.map((item) => item.text).join(" "),
    );
  }

  if (!category.object.category) return;

  //3. save category
  await saveCategory({
    email: options.email,
    commentId: body.commentId,
    category: { category: category.object.category },
  });

  return { category: category.object.category };
}
