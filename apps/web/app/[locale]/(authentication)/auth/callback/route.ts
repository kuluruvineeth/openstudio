import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  //   const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      },
    );
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    const { error: updateError } = await supabase
      .from("users")
      .update({
        access_token: data.session?.provider_token,
        refresh_token: data.session?.provider_refresh_token,
      })
      .eq("id", data.session?.user.id);

    if (updateError) {
      console.error(updateError);
    }
    if (!error && !updateError) {
      return NextResponse.redirect(`${origin}/dashboard`); // Changed from `${origin}${next}`
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
