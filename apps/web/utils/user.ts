"use client";

import { supabaseBrowserClient } from "@/supabase/supabaseClient";

export async function logOut() {
  localStorage.clear();
  await supabaseBrowserClient.auth.signOut();
  //TODO: Does redirect needed here?
}
