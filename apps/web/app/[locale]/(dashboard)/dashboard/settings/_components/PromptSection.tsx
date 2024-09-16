import { NotLoggedIn } from "@/components/ErrorDisplay";
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { auth } from "@/utils/auth";
import { PromptSectionForm } from "./PromptSectionForm";

export const PromptSection = async () => {
  const session = await auth();

  if (!session?.ownerEmail) return <NotLoggedIn />;

  const supabase = await supabaseServerClient();

  // Fetch user data using Supabase
  const { data: user, error } = await supabase
    .from("users")
    .select("prompt")
    .eq("email", session.ownerEmail)
    .single();

  if (error || !user) {
    console.error("Error fetching user:", error?.message);
    return <NotLoggedIn />;
  }

  return <PromptSectionForm prompt={user.prompt ?? undefined} />;
};
