"use server";

import { supabaseServerClient } from "@/supabase/supabaseServer";

export const getCommentNextPageToken = async (
  channelId: string,
): Promise<{
  nextPageToken: string;
  lastFetchedTimestamp: string;
  noMoreComments: boolean;
} | null> => {
  const supabase = await supabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("NO USER", user);
    return null;
  }

  const { data, error } = await supabase
    .from("channel_comment_pagination")
    .select("next_page_token, last_fetched_timestamp, no_more_comments")
    .eq("channel_id", channelId)
    .single();

  if (error) {
    console.log("Error storing channel comment next page token", error);
    return null;
  }

  return (
    {
      nextPageToken: data.next_page_token,
      lastFetchedTimestamp: data.last_fetched_timestamp,
      noMoreComments: data.no_more_comments,
    } || null
  );
};
