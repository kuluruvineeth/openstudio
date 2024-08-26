import { getUserData } from "@/actions/GetUserData";
import { supabaseServerClient } from "@/supabase/supabaseServer";

export const auth = async () => {
  const { error } = await (await supabaseServerClient()).auth.getSession();
  if (error) {
    return null;
  }
  const userData = await getUserData();

  if (!userData || !userData.access_token || !userData.refresh_token) {
    return null;
  }

  return {
    userId: userData.id,
    ownerEmail: userData.email,
    accessToken: userData?.access_token,
    refreshToken: userData?.refresh_token,
  };
};
