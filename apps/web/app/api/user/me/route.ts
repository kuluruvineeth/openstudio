import { supabaseServerClient } from "@/supabase/supabaseServer";
import { auth } from "@/utils/auth";
import { SafeError } from "@/utils/error";
import { withError } from "@/utils/middleware";
import { NextResponse } from "next/server";

export type UserResponse = Awaited<ReturnType<typeof getUser>>;

async function getUser(userEmail: string) {
  const supabase = await supabaseServerClient();

  const { data: userWithPremium, error: userError } = await supabase
    .from("users")
    .select(
      `
    *,
    premium: premium!user_premium_id_fkey (*)
  `,
    )
    .eq("email", userEmail)
    .single();

  if (userError) throw new SafeError("User not found");

  return userWithPremium;
}

export const GET = withError(async () => {
  const session = await auth();
  if (!session?.ownerEmail) {
    return NextResponse.json({ error: "Not authenticated" });
  }

  const user = await getUser(session.ownerEmail);

  return NextResponse.json(user);
});
