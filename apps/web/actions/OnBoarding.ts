"use server";

import { supabaseServerClient } from "@/supabase/supabaseServer";
import { ServerActionResponse } from "@/utils/error";

export const saveOnboardingAnswersAction = async (onboardingAnswers: {
  surveyId?: string;
  questions: any;
  answers: Record<string, string>;
}): Promise<ServerActionResponse> => {
  const supabase = await supabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  await supabase
    .from("users")
    .update({
      onboarding_answers: onboardingAnswers,
    })
    .eq("id", user.id);
};
